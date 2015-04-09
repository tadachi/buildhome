#!/bin/bash

repo[0]='https://github.com/tadachi/homepage.git'
repo[1]='https://github.com/tadachi/multi-twitch-chat.git'
#repo[2]='https://github.com/tadachi/srlplayer.git'
repo[2]='https://github.com/tadachi/srlplayer2.git'
repo[3]='https://github.com/tadachi/html-error-pages.git'

directory[0]='homepage'
directory[1]='multi-twitch-chat'
directory[2]='srlplayer2'
directory[3]='html-error-pages'

for i in {0..3}
do
	if [ -d ${directory[$i]} ]; # -d checks if directory is empty
	then
		printf "Updating '%s'.... " ${directory[$i]}
		(cd ${directory[$i]} ; git pull); # git pull the latest version.
	else
		eval git clone ${repo[$i]}; # clone the latest version.
	fi
done
