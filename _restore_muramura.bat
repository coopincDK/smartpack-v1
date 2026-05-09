@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
if not exist cases mkdir cases
git show fd61574:cases/muramura.html > cases\muramura.html
echo RESTORED: %errorlevel%
