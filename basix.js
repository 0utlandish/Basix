
// represent a 2D vector
export class vector2 {
   constructor(dx = 0, dy = 0) {
      this.dx = dx;
      this.dy = dy;
   }
   // returns a copy of this vector
   clone() {
      return new vector2(this.dx, this.dy);
   }
   // gets dx & dy from another vector
   scan(vector) {
      this.dx = vector.dx;
      this.dy = vector.dy;
   }
   // set dx & dy
   set(dx, dy) {
      this.dx = dx;
      this.dy = dy;
   }
   // changes the length of the vector to 1 in the same direction
   normalize() {
      const vectorLength = this.len();
      this.dx /= vectorLength;
      this.dy /= vectorLength;
      return this;
   }
   // scale vector (if `ys` is empty first parameter applies to both)
   scale(xs, ys) {
      if (ys !== undefined) {
         this.dx *= xs;
         this.dy *= ys;
      } else {
         this.dx *= xs;
         this.dy *= xs;
      }
   }
   // inverse the vector
   inverse() {
      this.scale(-1);
   }
   // vector + vector
   add(vector) {
      return new vector2(this.dx + vector.dx, this.dy + vector.dy);
   }
   // vector - vector
   subtract(vector) {
      return new vector2(this.dx - vector.dx, this.dy - vector.dy);
   }
   // vector * vector
   multiply(vector) {
      return new vector2(this.dx * vector.dx, this.dy * vector.dy);
   }
   // vector / vector
   divide(vector) {
      return new vector2(this.dx / vector.dx, this.dy / vector.dy);
   }
   // return length of the vector
   len() {
      return (this.dx ** 2 + this.dy ** 2) ** 0.5;
   }
   // return vector angle in radian
   getAngleInRadian() {
      return Math.atan2(this.dy, this.dx);
   }
   // return vector angle in degree
   getAngleInDegree() {
      return this.getAngleInRadian() * (180 / Math.PI);
   }
   // rotate the vector
   rotate(angle) {
      const dx = this.dx * Math.cos(angle) - this.dy * Math.sin(angle);
      const dy = this.dx * Math.sin(angle) + this.dy * Math.cos(angle);
      this.dx = dx;
      this.dy = dy;
   }
   // dot operation
   dot(vector) {
      return this.dx * vector.dx + this.dy * vector.dy;
   }
   // return angle between two vectors
   getAngleBetween(vector) {
      const dot = this.dot(vector);
      const mult = this.len() * vector.len();
      if (mult == 0) {
         return false;
      }
      else {
         const costheta = dot / mult;
         return Math.acos(costheta);
      }
   }
   // normal vector of this
   normal() {
      return new vector2(this.dy, -this.dx);
   }
   // return true if this vector is longer than `vector`
   isLongerThan(vector) {
      return this.len() > vector.len();
   }
   // return string representing this vector
   toString() {
      return `(${this.dx},${this.dy})`;
   }
}

// every thing that is going to be displayed shall exist in a scene
export class scene {
   constructor({
      canvas            = null,
      width             = window.innerWidth,
      height            = window.innerHeight,
      backgroundColor   = "#000",
      origin            = {
         x: 0,
         y: 0
      },
      lighting          = false
   } = {}) {
      // create canvas DOM element if its not passed to constructor
      this.view = canvas || document.createElement("canvas");
      // apply some css to canvas to make it cleaner
      const canvasStylesToApply = {
         "position": "absolute",
         "left": "0",
         "top": "0",
         "background-color": backgroundColor
      }
      for (const style in canvasStylesToApply) {
         this.view.style[style] = canvasStylesToApply[style];
      }
      this.view.setAttribute("width", `${width}px`);
      this.view.setAttribute("height", `${height}px`);
      this.view.setAttribute("oncontextmenu", "return false");
      if (canvas === null)
         document.body.appendChild(this.view);
      // stores all the elements that exists in this scene
      this.storage    = [];
      // store lights
      this.lights     = [];
      this.context    = this.view.getContext('2d');
      this.width      = width;
      this.height     = height;
      this.backgroundColor = backgroundColor;
      this.origin     = {};
      this.origin.x   = origin.x;
      this.origin.y   = origin.y;
      // if lighting is true then this will create a layer of darkness above every thing
      this.lighting = lighting;
      this.darknesh = null;

   }
   // add a new element to the scene in order to display it
   add(newElements) {
      if (!newElements) return;
      if (!Array.isArray(newElements)) {
         newElements = [newElements];
      }
      for (let newElement of newElements) {
         if (this.storage.includes(newElement)) continue;
         if (!newElement.LIGHT)
            this.storage.push(newElement);
         else
            this.lights.push(newElement);
         newElement.scene = this;
         // whenever an element is added to the scene, onSceneAdd event will be called for that element
         ((newElement.onSceneAdd || (e=>{})).bind(newElement))();
      }
      return this;
   }
   // remove an existing elements form scene [UNDONE]
   remove(existingElements) {
      if (!Array.isArray(existingElements)) {
         existingElements = [existingElements];
      }
      for (let existingElement of existingElements) {
         // whenever an element is removed from the scene, onSceneRemove event will be called for that element
         ((existingElement.onSceneRemove || (e=>{})).bind(existingElement))();
         if (!existingElement.LIGHT)
            this.storage = this.storage.filter(element => element !== existingElement);
         else
            this.lights = this.lights.filter(element => element !== existingElement);
      }
   }
   // erase the canvas (aka clear)
   erase() {
      this.context.clearRect(0, 0, this.width, this.height);
      return this;
   }
   // fill canvas with a color
   refill(color = this.backgroundColor) {
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.width, this.height);
      this.context.fill();
      return this;
   }
   // update all visible elements in the storage
   update(camera) {
      if (!camera) return;
      this.context.translate(camera.x + this.origin.x, camera.y + this.origin.y);
      this.context.scale(camera.scale, camera.scale);
      this.context.scale((camera.mirrorx ? -1 : 1), (camera.mirrory ? -1 : 1));
      this.context.rotate(camera.rotation);
      this.storage.sort(function(Element1, Element2) {
         if ((Element1.z === undefined ? 0 : Element1.z) < (Element2.z === undefined ? 0 : Element2.z)) return -1;
         else return 1;
      });
      for (const element of this.storage) {
         if ((element.visible || element.visible == undefined) && element.update)
            element.update(this.context);
      }
      this.context.rotate(-camera.rotation);
      this.context.scale((camera.mirrorx ? -1 : 1), (camera.mirrory ? -1 : 1));
      this.context.scale(1/camera.scale, 1/camera.scale);
      this.context.translate(-camera.x - this.origin.x, -camera.y - this.origin.y);
   }
};

// camera is the offset from which you are looking at the canvas
export class camera {
   constructor({
      x        = 0,
      y        = 0,
      rotation = 0,
      scale    = 1,
      mirrorx  = false,
      mirrory  = false
   } = {}) {
      this.x          = x;
      this.y          = y;
      this.rotation   = rotation;
      this.scale      = scale;
      this.mirrorx    = mirrorx;
      this.mirrory    = mirrory;
   }
   // camera will look at an element with some offset [UNDONE]
   lookAt({
      lookPointX = 0,
      lookPointY = 0
   } = {}) {
      this.x = -lookPointX;
      this.y = -lookPointY;
   }
}