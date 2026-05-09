@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add -A
git diff --staged --quiet && echo NOTHING TO COMMIT || git commit -m "fix: aeoeaa sweep + cleanup pending changes"
git fetch origin main
git rebase origin/main
git push origin main
echo DONE
