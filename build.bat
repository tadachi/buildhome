@echo off

REM Allows the use of !var[%%x]! ! for expansion of variable.
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

set repo[1]=https://github.com/tadachi/homepage.git
set repo[2]=https://github.com/tadachi/multitwitchchat.git
REM set repo[3]=https://github.com/tadachi/srlplayer.git
set repo[3]=https://github.com/tadachi/srlplayer2.git
set repo[4]=https://github.com/tadachi/html-error-pages.git

set directory[1]=homepage
set directory[2]=multitwitchchat
set directory[3]=srlplayer2
set directory[4]=html-error-pages

REM full path to current directory including drive.
REM set mypath=%~dp0

for /l %%i in (1, 1, 2) do (
    if exist !directory[%%i]! (
        echo Updating !directory[%%i]!....
        cd !directory[%%i]! & git pull & cd ..
    ) else (
        call git clone !repo[%%i]!
    )
)

REM Don't persist setlocals.
endlocal
