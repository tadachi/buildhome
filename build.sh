#!/bin/bash

# CHANGE HERE!
repo[0]='https://github.com/tadachi/homepage.git'
repo[1]='https://github.com/tadachi/multi-twitch-chat.git'
#repo[2]='https://github.com/tadachi/srlplayer.git'
repo[2]='https://github.com/tadachi/srlplayer2.git'
repo[3]='https://github.com/tadachi/html-error-pages.git'
repo[4]='https://github.com/tadachi/match-follows-for-twitch.git'
repo[5]='https://github.com/tadachi/manga-front.git'
repo[6]='https://github.com/tadachi/streamy.git'

# HERE!
directory[0]='homepage'
directory[1]='multi-twitch-chat'
directory[2]='srlplayer2'
directory[3]='html-error-pages'
directory[4]='match-follows-for-twitch'
directory[5]='manga-front'
directory[6]='streamy'

for i in {0..6} # AND HERE!
do
	if [ -d ${directory[$i]} ]; # -d checks if directory is empty
	then
		printf "Updating '%s'.... " ${directory[$i]}
		(cd ${directory[$i]} ; git pull); # git pull the latest version.
	else
		eval git clone ${repo[$i]}; # clone the latest version.
	fi
done
