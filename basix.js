
// these function set will be used inside basix and will not be exposed
const toolset = {
	'is-point-inside-triangle': (trianle, point) => {
		const v0 = [trianle[2].x - trianle[0].x, trianle[2].y - trianle[0].y];
		const v1 = [trianle[1].x - trianle[0].x, trianle[1].y - trianle[0].y];
		const v2 = [point.x - trianle[0].x,point.y - trianle[0].y];
		const dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
		const dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
		const dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
		const dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
		const dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);
		const invDenom = 1/ (dot00 * dot11 - dot01 * dot01);
		const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return ((u >= 0) && (v >= 0) && (u + v < 1));
	}
}

// draw x & y axis 
export class axis {
	constructor() {
		this.z = -Infinity;
	}
	update(context) {
		context.lineWidth 	= 0.5;
		context.strokeStyle 	= '#eee';
		context.beginPath();
		context.moveTo(0, -this.scene.origin.y);
		context.lineTo(0, window.innerHeight - this.scene.origin.y);
		context.moveTo(-this.scene.origin.x, 0);
		context.lineTo(window.innerWidth - this.scene.origin.x, 0);
		context.stroke();
	}
}

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

// [TODO] set x & y
// polygon shape, consists of several points (< 2) that are connected sequentially
export class polygon {
	constructor({
		points 		= [],
		color 		= '#aaa',
		wireframe 	= false,
		lineWidth 	= 1,
		angle 		= 0,
		x 				= 0,
		y 				= 0
	} = {}) {
		this.points 		= points;
		this.color 			= color;
		this.wireframe 	= wireframe;
		this.lineWidth 	= lineWidth;
		this.angle 			= angle;
		this.x 				= x;
		this.y 				= y;
		// stores the anchor point of the polygon
		this.anchor = {x: 0, y: 0};
		for (let point of this.points) {
			this.anchor.x += point.x;
			this.anchor.y += point.y;
		}
		this.anchor.x /= this.points.length;
		this.anchor.y /= this.points.length;
	}
	update(context) {
		let { points, anchor } 	= this;
		context.strokeStyle 		= this.color;
		context.lineWidth 		= this.lineWidth;
		context.translate(anchor.x, anchor.y);
		context.rotate(this.angle);
		context.beginPath();
		context.moveTo(points[0].x - anchor.x, points[0].y - anchor.y);
		points.slice(1).forEach(point => {
			context.lineTo(point.x - anchor.x, point.y - anchor.y);
		});
		context.lineTo(points[0].x - anchor.x, points[0].y - anchor.y);
		context.stroke();
		if (this.wireframe) {
			points.forEach(point => {
				context.beginPath();
				context.moveTo(anchor.x - anchor.x, anchor.y - anchor.y);
				context.lineTo(point.x - anchor.x, point.y - anchor.y);
				context.stroke();
			});
		}
		context.beginPath();
		context.arc(0, 0, 2, 0, Math.PI * 2);
		context.stroke();
		context.rotate(-this.angle);
		context.translate(-anchor.x, -anchor.y);
	}
}

// an easier way to generate polygons
polygon.generate = (x, y, numberOfVertices, rules, options = {}) => {
	const points = [];
	for (let index = 0;index < numberOfVertices;index++) {
		let vertex = {x: 0, y: 0};
		for (const rule of rules) {
			if (rule.if(index, numberOfVertices, (index > 0 ? points[index - 1] : {x, y}))) {
				(rule.then.bind(vertex))(index, numberOfVertices, (index > 0 ? points[index - 1] : {x, y}));
			}
		}
		points.push(vertex);
	}
	return new polygon({...options, points });
}

// regular polygon
polygon.regular = (x, y, numberOfSides, numberOfSegmentsForEachSide, length, options) => {
	return polygon.generate(x, y, numberOfSides * numberOfSegmentsForEachSide, [
		{
			if: i => true,
			then: function(i, t, p) {
				this.x = p.x + Math.cos(Math.floor(i / numberOfSegmentsForEachSide) * Math.PI / (t / (2 * numberOfSegmentsForEachSide))) * (length / numberOfSegmentsForEachSide);
				this.y = p.y + Math.sin(Math.floor(i / numberOfSegmentsForEachSide) * Math.PI / (t / (2 * numberOfSegmentsForEachSide))) * (length / numberOfSegmentsForEachSide);
			}
		}
	], options);
}

// every thing that is going to be displayed shall exist in a scene
export class scene {
	constructor({
		canvas 				= null,
		width 				= window.innerWidth,
		height 				= window.innerHeight,
		backgroundColor 	= "#000",
		origin 				= {
			x: 0,
			y: 0
		},
		lighting 			= false
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
		this.storage 	= [];
		// store lights
		this.lights 	= [];
		this.context 	= this.view.getContext('2d');
		this.width 		= width;
		this.height 	= height;
		this.backgroundColor = backgroundColor;
		this.origin 	= {};
		this.origin.x 	= origin.x;
		this.origin.y 	= origin.y;
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
		x 			= 0,
		y 			= 0,
		rotation = 0,
		scale 	= 1,
		mirrorx 	= false,
		mirrory 	= false
	} = {}) {
		this.x 			= x;
		this.y 			= y;
		this.rotation 	= rotation;
		this.scale 		= scale;
		this.mirrorx 	= mirrorx;
		this.mirrory 	= mirrory;
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