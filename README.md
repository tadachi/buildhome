buildhome
=========

This is a one-step bash build script with a server that hosts all my web projects and homepage.

#### Debug

In one console window, run this command:

```
npm run dev
```

In another console window, run this command:

```
npm run start
```

*npm run dev* watches our *[es2015/es6]* code in server/src/server.js and outputs it into the the root of the folder: ./server.js  
*npm run start* watches ./server.js. Because of the command above, as soon as you edit the ./server/src/server.js, it will automatically restart the node process at ./server.js  
Thus you can take advantage of *[es2015/es6]* syntax and not have to restart the node server everytime when you make a change!