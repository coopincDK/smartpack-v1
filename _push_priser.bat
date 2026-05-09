@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add priser.html
git commit -m "fix: tilfoej produktionsordrer til betingelsestekst paa priser"
git fetch origin main
git rebase origin/main
git push origin main
echo PUSHED
