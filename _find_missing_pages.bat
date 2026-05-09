@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1

rem Tjek om muramura er gendannet
if exist cases\muramura.html (
    echo muramura.html: OK
) else (
    echo muramura.html: MANGLER - gendanner...
    git show fd61574:cases/muramura.html > cases\muramura.html
    echo Gendannet fra fd61574
)

rem Find alle .html filer der fandtes i git historik men ikke paa disk nu
rem Hent liste af alle tracked filer fra HEAD
git ls-tree -r HEAD --name-only > _current_tracked.txt

rem Hent liste af alle filer der nogensinde eksisterede
git log --all --pretty=format:"" --name-only --diff-filter=D > _ever_deleted.txt

echo.
echo === Manglende ikke-viden sider ===
for /f %%f in (_ever_deleted.txt) do (
    if not exist %%f (
        echo %%f | findstr /v "viden\\" | findstr ".html" > nul && echo MANGLER: %%f
    )
)

echo.
echo DONE
