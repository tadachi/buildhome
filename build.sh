#!/bin/bash

clonecmd="git clone "

repo1="https://github.com/tadachi/homepage.git"
directory1="homepage"

if [ -d $directory1 ]; 
then
	printf "Updating '%s'.... " $directory1
	(cd homepage ; git pull);
else
	eval $clonecmd $repo1;
fi

repo2="https://github.com/tadachi/multitwitchchat.git"
directory2="multitwitchchat"

if [ -d $directory2 ]; 
then
	printf "Updating '%s'.... " $directory2
	(cd homepage ; git pull);
else
	eval $clonecmd $repo2;
fi

repo3="https://github.com/tadachi/srlplayer.git"
directory3="srlplayer"

if [ -d $directory3 ]; 
then
	printf "Updating '%s'.... " $directory3
	(cd homepage ; git pull);
else
	eval $clonecmd $repo3;
fi
