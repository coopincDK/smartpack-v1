@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1
git diff --name-only --diff-filter=D 4128165^ 4128165 > _deleted_files.txt
echo FILES: && type _deleted_files.txt | find /c ".html"
echo DONE
