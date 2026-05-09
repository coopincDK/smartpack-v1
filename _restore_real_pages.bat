@echo off
cd /d C:\Users\MartinMortensen\Desktop\SmartPack_v1

rem 1. Gendan cases/muramura.html
if exist cases\muramura.html (
    echo muramura.html: allerede OK
) else (
    git show fd61574:cases/muramura.html > cases\muramura.html 2>nul
    if exist cases\muramura.html (echo RESTORED: cases/muramura.html) else (echo FEJL: muramura)
)

rem 2. Tjek shadow-linkedin.html
git log --oneline -- shadow-linkedin.html > _tmp.txt 2>nul
for /f "tokens=1" %%c in (_tmp.txt) do (
    if exist shadow-linkedin.html (
        echo shadow-linkedin.html: OK paa disk
    ) else (
        git show %%c:shadow-linkedin.html > shadow-linkedin.html 2>nul
        if exist shadow-linkedin.html (echo RESTORED: shadow-linkedin.html fra %%c) else (echo FEJL: shadow-linkedin)
    )
    goto :done_shadow
)
:done_shadow

rem 3. Tjek viden/realworld/muramura-smartpack-case.html
git log --oneline -- viden/realworld/muramura-smartpack-case.html > _tmp.txt 2>nul
for /f "tokens=1" %%c in (_tmp.txt) do (
    if exist viden\realworld\muramura-smartpack-case.html (
        echo muramura-smartpack-case.html: OK paa disk
    ) else (
        git show %%c:viden/realworld/muramura-smartpack-case.html > viden\realworld\muramura-smartpack-case.html 2>nul
        if exist viden\realworld\muramura-smartpack-case.html (echo RESTORED: muramura-smartpack-case.html fra %%c) else (echo FEJL eller aldrig skrevet)
    )
    goto :done_case
)
:done_case

rem 4. Vis alle cases der mangler vs git-historik
echo.
echo === Cases i git-historik men ikke paa disk ===
git log --all --pretty=format:"" --name-only -- "cases/*.html" > _case_history.txt 2>nul
sort /unique _case_history.txt > _case_unique.txt
for /f %%f in (_case_unique.txt) do (
    if not exist %%f echo MANGLER: %%f
)

del _tmp.txt _case_history.txt _case_unique.txt 2>nul
echo.
echo DONE
