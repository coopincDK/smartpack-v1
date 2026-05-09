@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add cases\muramura.html shadow-linkedin.html viden\realworld\muramura-smartpack-case.html
git commit -m "restore: gendan 3 slettede sider fra git-historik"
git fetch origin main
git rebase origin/main
git push origin main
echo PUSHED
