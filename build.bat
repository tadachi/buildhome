@echo off

REM Allows the use of !var[%%x]! ! for expansion of variable.
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

// CHANGE HERE!
set repo[1]=https://github.com/tadachi/homepage.git
set repo[2]=https://github.com/tadachi/multi-twitch-chat.git
set repo[3]=https://github.com/tadachi/srlplayer2.git
set repo[4]=https://github.com/tadachi/html-error-pages.git
set repo[5]=https://github.com/tadachi/match-follows-for-twitch.git
set repo[6]=https://github.com/tadachi/manga-front.git
set repo[7]=https://github.com/tadachi/streamy.git

// HERE!
set directory[1]=homepage
set directory[2]=multi-twitch-chat
set directory[3]=srlplayer2
set directory[4]=html-error-pages
set directory[5]=match-follows-for-twitch
set directory[6]=manga-front
set directory[7]=streamy

REM full path to current directory including drive.
REM set mypath=%~dp0

for /l %%i in (1, 1, 7) do ( // AND HERE!
    if exist !directory[%%i]! (
        echo Updating !directory[%%i]!....
        cd !directory[%%i]! & git pull & cd ..
    ) else (
        call git clone !repo[%%i]!
    )
)

REM Don't persist setlocals.
endlocal
