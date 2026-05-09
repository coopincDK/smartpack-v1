@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
powershell -NoProfile -ExecutionPolicy Bypass -File _fix_danish_chars.ps1
git add -A
git commit -m "feat: ny artikel(er) fra agent-batch"
git fetch origin main
git rebase origin/main
git push origin main
echo DONE
