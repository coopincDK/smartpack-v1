@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git add vilkaar.html
git commit -m "feat: tilfoej 17.3 pakkeberegning og afregningsgrundlag til vilkaar"
git fetch origin main
git rebase origin/main
git push origin main
echo PUSHED
