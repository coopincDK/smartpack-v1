@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add -A
git commit -m "fix: max-height:520px tilfojet 16 billeder uden hoejde-begraensning"
git fetch origin main
git rebase origin/main
git push origin main
echo PUSHED
