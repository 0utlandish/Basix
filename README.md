#### Introduction
Basix is small and easy to use 2d graphic engine that is using html5 canvas [CanvasRenderingContext2D] &amp; js to illustrate objects.

#### Getting Started
it's very easey to insatll and get started with the Basix engine, download `basix.js` file and insert it to your project folder and import it like this :
``` js
  // if you want all the features
  import * as BASXI from 'path_to_basix';
  // or if you want some specific ones
  import { scene, camera, util } from 'path_to_basix';
```

#### Loops
there are two loops in the Basix structure, internal loop and external loop.
##### Internal Loop
this is is built in the source code and you can not access it, it mostly handles easing functions and provide time measurements like `delta` and `now`[global: `util.now`] for the external loop (uses requestAnimationFrame).
##### External Loop
this loop is for user to render the application in, you can access this loop from `util` object : 
``` js
  import { util } from 'basix.js';
  util.loop = (delta, elapsed) => {
    // draw your objects here
  }
```
#### Scene
scene is the container that holds your objects in it, for objects to be displayed, they should exist inside a scene, you can create a scene using BASIX.scene constructor: 
``` js 
  import { util, scene } from 'basix.js';
  const _scene = new scene({options})
  util.loop = (delta, elapsed) => {
    // draw your objects here
  }
```
