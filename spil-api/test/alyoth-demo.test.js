'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),express=require('express');
const {alyothDemoRouter,validateDemo,demoTilCrm,PATH}=require('../src/routes/alyothDemo');
function sample(){return {schemaVersion:1,requestId:'alyoth-test-00000001',_hp:'',contact:{name:'Demo Test',email:'demo@example.invalid',phone:'',company:'Test company',message:'Please show the selected setup.'},plan:{systems:{webshop:['Shopify'],erp:['e-conomic'],shipping:['Shipmondo']},decisions:{erp:'keep',shipping:'mixed',warehouse:'alyoth'},modules:['wms','shipping','oms'],labelProvider:'mixed',labelFollow:false,volumes:{orders:10000,labels:12000,returns:100,cases:200,documents:300,aiJobs:400,skus:15000,entities:2,stores:1,clients:5,apiCalls:1100000}},quote:{version:'Draft v6 EUR',draft:true,excludingVat:true,currency:'EUR',fixedCents:10500,usageCents:174000,totalCents:184500,externalLabelCents:5000,lines:[{kind:'fixed',label:'Warehouse',detail:'',quantity:null,amountCents:6500},{kind:'fixed',label:'Orders',detail:'',quantity:null,amountCents:4000},{kind:'usage',label:'Combined order flow',detail:'Warehouse + Orders',quantity:10000,amountCents:143000},{kind:'usage',label:'Alyoth labels',detail:'',quantity:12000,amountCents:31000}]}};}
async function harness(t,send){const app=express();app.use(express.json({limit:'64kb'}));app.use(alyothDemoRouter({send}));app.use((err,req,res,next)=>res.status(500).json({ok:false}));const srv=http.createServer(app);await new Promise(r=>srv.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>srv.close(r)));return {url:'http://127.0.0.1:'+srv.address().port+PATH};}
async function post(h,body,origin='https://coopincdk.github.io'){return fetch(h.url,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});}

test('Alyoth contact context reaches the existing CRM contact-form without omissions',async t=>{
  const calls=[],h=await harness(t,async(body,url)=>{calls.push({body,url});return {ok:true};});
  const b=sample();assert.equal(validateDemo(b),true);
  const r=await post(h,b);assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true,crm:true,requestId:b.requestId});
  const body=calls[0].body;
  assert.match(calls[0].url,/\/api\/v1\/contact-form$/);assert.equal(body.type,'Lead');assert.equal(body.hoert_via,'Alyoth website');
  for(const text of ['Shopify','e-conomic','Shipmondo','wms, shipping, oms','orders: 10000','labels: 12000','returns: 100','apiCalls: 1100000','1845.00 EUR','50.00 EUR','1895.00 EUR','Please show the selected setup.','not an offer'])assert.ok(body.message.includes(text),text);
  assert.equal(body.newsletter,undefined);assert.equal(body.consentText,undefined);assert.equal(body._hp,undefined);
});
test('CORS is limited to the new route and the known Alyoth origin',async t=>{
  let count=0;const h=await harness(t,async()=>{count++;return {ok:true};});
  const preflight=await fetch(h.url,{method:'OPTIONS',headers:{origin:'https://coopincdk.github.io','access-control-request-method':'POST','access-control-request-headers':'content-type'}});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),'https://coopincdk.github.io');assert.equal(preflight.headers.get('access-control-allow-credentials'),null);
  const bad=await post(h,sample(),'https://elsewhere.example');assert.equal(bad.status,403);assert.equal(bad.headers.get('access-control-allow-origin'),null);
  assert.equal((await fetch(h.url,{method:'OPTIONS',headers:{origin:'https://coopincdk.github.io','access-control-request-method':'DELETE'}})).status,405);
  assert.equal(count,0);
});
test('CRM failure and honeypot never produce a receipt confirmation',async t=>{
  let count=0;const h=await harness(t,async()=>{count++;return {ok:false,status:500};});
  const failed=await post(h,sample());assert.equal(failed.status,502);assert.equal((await failed.json()).crm,false);
  const bot=sample();bot._hp='bot';const r=await post(h,bot);assert.equal((await r.json()).crm,false);assert.equal(count,1);
});
test('Repeated and concurrent retries share one CRM request; changed context cannot reuse its ID',async t=>{
  let count=0;const h=await harness(t,async()=>{count++;await new Promise(r=>setTimeout(r,15));return {ok:true};});
  const rs=await Promise.all([post(h,sample()),post(h,sample())]);assert.ok(rs.every(r=>r.status===200));assert.equal(count,1);
  assert.equal((await post(h,sample())).status,200);assert.equal(count,1);
  const changed=sample();changed.contact.message='Changed';assert.equal((await post(h,changed)).status,409);assert.equal(count,1);
});
test('A failed request can be retried with the same ID',async t=>{
  let count=0;const h=await harness(t,async()=>({ok:++count>1}));
  assert.equal((await post(h,sample())).status,502);assert.equal((await post(h,sample())).status,200);assert.equal(count,2);
});
test('Malformed quantities, totals and nested fields are rejected before CRM',async t=>{
  let count=0;const h=await harness(t,async()=>{count++;return {ok:true};});
  const changes=[b=>b.quote.totalCents++,b=>b.quote.lines[0].amountCents++,b=>b.plan.volumes.orders=-1,b=>b.plan.systems.webshop=[{}],b=>b.contact.email='invalid',b=>b.plan.modules.push('unknown'),b=>b.plan.labelProvider='shipmondo',b=>b.quote.draft=false,b=>b.contact.message='x'.repeat(4001)];
  for(const change of changes){const b=sample();change(b);assert.equal((await post(h,b)).status,400);}
  assert.equal(count,0);
});
test('Long valid plans retain all systems rather than the old contact route 2,000-character truncation',()=>{
  const b=sample();b.plan.systems.webshop=Array.from({length:40},(_,n)=>'Webshop '+n+' '+('x'.repeat(80)));
  assert.equal(validateDemo(b),true);assert.match(demoTilCrm(b).message,/Webshop 39/);assert.ok(demoTilCrm(b).message.length>4000);
});

test('Need is forwarded with the current customised plan; old requests remain supported',async t=>{
  const calls=[],h=await harness(t,async body=>{calls.push(body);return {ok:true};});
  const cases=[{id:'operations'},{id:'connected'},...['shipping','wms','oms','returns','finance','pim','support','checkout','insight','ai','tpl'].map(task=>({id:'task',task}))];
  for(const [i,need]of cases.entries()){
    const b=sample();b.requestId='alyoth-need-test-'+String(i).padStart(8,'0');b.plan.need=need;
    assert.equal((await post(h,b)).status,200);assert.match(calls[i].message,/CUSTOMER NEED/);assert.ok(!calls[i].message.includes('undefined'));assert.match(calls[i].message,/may have customised/);assert.match(calls[i].message,/wms, shipping, oms/);
  }
  assert.match(calls[0].message,/Run my warehouse & shipping/);assert.match(calls[1].message,/Connect operations & accounting/);assert.match(calls[5].message,/Handle returns/);
  assert.equal(validateDemo(sample()),true);
  for(const need of [{id:'unknown'},{id:'task',task:'unknown'},'operations',{id:'operations',task:'returns'},{id:'connected',extra:'untrusted'}]){const b=sample();b.plan.need=need;assert.equal((await post(h,b)).status,400);}
  assert.equal(calls.length,cases.length);
});
