@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add viden\drift\reverse-supply-chain-recommerce-reparation.html
git commit -m "fix: tilfoej link til inline-cta paa reverse-supply-chain artikel"
git fetch origin main
git rebase origin/main
git push origin main
echo PUSHED
