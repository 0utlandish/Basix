
import * as BASIX from "../basix.js";
async function main() {
	const scene = new BASIX.scene({
		origin: {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		}
	});
	const camera = new BASIX.camera({
		mirrory: true,
	});

	const rect1 = {
		x: 0, y: 0, size: 100,
		update: context => {
			context.fillStyle = 'red';
			context.fillRect(rect1.x, rect1.y, rect1.size, rect1.size);
		}
	}
	const rect2 = {
		x: 50, y: 50, size: 100,
		update: context => {
			context.fillStyle = 'blue';
			context.fillRect(rect2.x, rect2.y, rect2.size, rect2.size);
		}
	}

	const light = {
		LIGHT: true,
		radius: 1000,
		x: 0, y: 0,
		size: 10,
		color: '#ffffff'
	}

	scene.add([light, rect1, rect2]);

	const mouse = {
		x: null,
		y: null
	}

	document.onmousemove = e => {
		mouse.x = e.clientX - (scene.origin.x);
		mouse.y = (scene.origin.y) - e.clientY;
	}

	console.log({scene, BASIX});

	BASIX.util.loop = delta => {
		scene.erase().update(camera);
		// console.log(rect1.x)
	}

	let x = BASIX.util.ease(rect1, 'size', 300, 2000, 'easeInOutQuint', () => {
		console.log('callback')
	});

}; main();