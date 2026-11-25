'use strict';

const express = require('express');
const { createHash } = require('node:crypto');
const { createRateLimiter } = require('../middleware/rateLimit');
const { sendTilCrm, crmKontaktUrl } = require('../crm');

const PATH = '/hjemmeside/alyoth-demo';
const ORIGINS = ['https://coopincdk.github.io'];
const MODULES = new Set(['oms','wms','shipping','returns','finance','pim','support','checkout','insight','ai','tpl']);
const CATEGORIES = new Set(['webshop','market','pos','erp','carrier','shipping','warehouse','automation','purchasing','returns','support','pim','bi']);
const VOLUMES = { orders:1000000, labels:1000000, returns:1000000, cases:1000000, documents:1000000, aiJobs:1000000, skus:1000000, entities:1000, stores:1000, clients:10000, apiCalls:1000000000 };
const plain = v => v && typeof v === 'object' && !Array.isArray(v);
const text = (v,max) => typeof v === 'string' && v.length <= max;
const cents = v => Number.isSafeInteger(v) && v >= 0 && v <= 100000000000;

function validateDemo(b) {
  if(!plain(b) || b.schemaVersion!==1 || !text(b.requestId,80) || !/^[a-zA-Z0-9-]{16,80}$/.test(b.requestId))return false;
  const c=b.contact,p=b.plan,q=b.quote;
  if(!plain(c)||!text(c.name,120)||!c.name.trim()||!text(c.email,200)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)||!text(c.company,160)||!text(c.phone,40)||!text(c.message,4000))return false;
  if(!text(b._hp,200)||!plain(p)||!plain(p.systems)||!plain(p.volumes)||!plain(p.decisions))return false;
  if(!Array.isArray(p.modules)||p.modules.length>11||new Set(p.modules).size!==p.modules.length||!p.modules.every(m=>text(m,20)&&MODULES.has(m)))return false;
  if(!['alyoth','shipmondo','webshipper','mixed','other'].includes(p.labelProvider)||typeof p.labelFollow!=='boolean')return false;
  if((p.labelProvider==='alyoth'||p.labelProvider==='mixed')!==p.modules.includes('shipping'))return false;
  if(Object.keys(p.systems).some(k=>!CATEGORIES.has(k)))return false;
  if(!Object.values(p.systems).every(v=>Array.isArray(v)&&v.length<=40&&v.every(s=>text(s,100))))return false;
  if(Object.keys(p.decisions).some(k=>!CATEGORIES.has(k))||!Object.values(p.decisions).every(v=>['keep','alyoth','mixed'].includes(v)))return false;
  if(Object.keys(p.volumes).length!==Object.keys(VOLUMES).length||!Object.entries(VOLUMES).every(([k,max])=>Number.isSafeInteger(p.volumes[k])&&p.volumes[k]>=0&&p.volumes[k]<=max))return false;
  if(!plain(q)||q.currency!=='EUR'||q.draft!==true||q.excludingVat!==true||!text(q.version,160)||!q.version.trim())return false;
  if(![q.fixedCents,q.usageCents,q.totalCents].every(cents)||q.totalCents!==q.fixedCents+q.usageCents)return false;
  if(q.externalLabelCents!==null&&!cents(q.externalLabelCents))return false;
  if(!Array.isArray(q.lines)||q.lines.length>35)return false;
  if(!q.lines.every(r=>plain(r)&&['fixed','usage'].includes(r.kind)&&text(r.label,160)&&text(r.detail,500)&&cents(r.amountCents)&&(r.quantity===null||Number.isSafeInteger(r.quantity)&&r.quantity>=0&&r.quantity<=1000000000)))return false;
  for(const [kind,total]of [['fixed',q.fixedCents],['usage',q.usageCents]])if(q.lines.filter(r=>r.kind===kind).reduce((sum,r)=>sum+r.amountCents,0)!==total)return false;
  return true;
}

const eur = n => (n/100).toFixed(2)+' EUR';
function demoTilCrm(b) {
  const c=b.contact,p=b.plan,q=b.quote;
  const lines=[
    'ALYOTH — DEMO REQUEST',
    'Customer plan and browser-calculated estimate. Draft pricing, excluding VAT; not an offer or a verified quotation.',
    'Pricing version: '+q.version,
    '', 'CURRENT SYSTEMS AND INTENDED SETUP',
    ...Object.entries(p.systems).filter(([,values])=>values.length).map(([cat,values])=>cat+': '+values.join(', ')+' — '+(p.decisions[cat]||'keep')),
    '', 'SELECTED ALYOTH MODULES',p.modules.length?p.modules.join(', '):'None selected',
    'Label provider: '+p.labelProvider,
    'Labels follow order count: '+(p.labelFollow?'yes':'no'),
    '', 'MONTHLY VOLUMES / CAPACITY INPUTS',
    ...Object.entries(p.volumes).map(([key,value])=>key+': '+value+(key==='labels'&&!p.modules.includes('shipping')?' (retained input; no Alyoth labels charged with the selected external provider)':'')),
    '', 'DRAFT MONTHLY ESTIMATE',
    ...q.lines.map(r=>r.kind+' | '+r.label+(r.quantity===null?'':' | quantity '+r.quantity)+' | '+eur(r.amountCents)+(r.detail?' | '+r.detail:'')),
    'Fixed total: '+eur(q.fixedCents),'Usage total: '+eur(q.usageCents),'Alyoth total: '+eur(q.totalCents),
    q.externalLabelCents===null?'External label agreement: not included / not provided.':'External label agreement: '+eur(q.externalLabelCents)+'; known combined budget: '+eur(q.totalCents+q.externalLabelCents),
    'Freight, payment fees, external apps and expert services are excluded. Additional API capacity above fair use is not priced.',
    '', 'CUSTOMER MESSAGE',c.message||'No additional message.',
  ];
  // Use the existing CRM contact-form fields. Do not silently truncate the plan.
  return {name:c.name.trim(),email:c.email.trim(),phone:c.phone.trim(),company:c.company.trim(),type:'Lead',emne:'Alyoth demo',hoert_via:'Alyoth website',page:'https://coopincdk.github.io/alyoth-web/check-your-setup.html',message:lines.join('\n')};
}

function alyothDemoRouter(opts={}) {
  const router=express.Router(),send=opts.send||sendTilCrm,origins=opts.origins||ORIGINS;
  const limiter=createRateLimiter({windowMs:60000,max:20,besked:'For mange henvendelser. Prøv igen om et øjeblik.'});
  const requests=new Map(),ttl=10*60*1000;
  router.use(PATH,(req,res,next)=>{
    res.set('Cache-Control','no-store');res.vary('Origin');
    const origin=req.get('origin');
    if(!origins.includes(origin))return res.status(403).json({ok:false,crm:false,kode:'forkert_origin'});
    res.set('Access-Control-Allow-Origin',origin);
    if(req.method==='OPTIONS'){
      if(req.get('access-control-request-method')!=='POST'&&req.get('access-control-request-method')!=='GET')return res.sendStatus(405);
      const headers=(req.get('access-control-request-headers')||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
      if(headers.some(h=>h!=='content-type'))return res.sendStatus(403);
      res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.set('Access-Control-Allow-Headers','Content-Type');
      return res.sendStatus(204);
    }
    next();
  });
  router.get(PATH,(_req,res)=>res.json({ready:!!process.env.SMARTPACK_CRM_KEY,schemaVersion:1}));
  router.post(PATH,limiter,async(req,res,next)=>{
    try {
      const b=req.body;
      if(!validateDemo(b))return res.status(400).json({ok:false,crm:false,kode:'ugyldigt_input'});
      if(b._hp)return res.json({ok:true,crm:false});
      const body=demoTilCrm(b);
      if(body.message.length>24000)return res.status(400).json({ok:false,crm:false,kode:'for_stor'});
      const now=Date.now();for(const [id,entry]of requests)if(entry.expires<=now)requests.delete(id);
      const hash=createHash('sha256').update(JSON.stringify(body)).digest('hex');
      let entry=requests.get(b.requestId);
      if(entry&&entry.hash!==hash)return res.status(409).json({ok:false,crm:false,kode:'request_aendret'});
      if(!entry){
        if(requests.size>=500)return res.status(503).json({ok:false,crm:false,kode:'proev_igen'});
        entry={hash,expires:now+ttl,promise:Promise.resolve().then(()=>send(body,crmKontaktUrl()))};requests.set(b.requestId,entry);
      }
      const result=await entry.promise;
      if(!result.ok){requests.delete(b.requestId);return res.status(502).json({ok:false,crm:false,kode:'crm_ikke_modtaget'});}
      return res.json({ok:true,crm:true,requestId:b.requestId});
    }catch(error){if(req.body&&req.body.requestId)requests.delete(req.body.requestId);next(error);}
  });
  return router;
}

module.exports={alyothDemoRouter,validateDemo,demoTilCrm,PATH};
