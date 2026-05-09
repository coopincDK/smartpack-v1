@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add 3pl.html integrationer.html
git commit -m "fix: ret billedehojder paa 3pl og integrationer"
git fetch origin main
git rebase origin/main
git push origin main
echo DONE
