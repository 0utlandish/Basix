
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

	scene.add(new BASIX.axis());

	const mouse = {
		x: null,
		y: null
	}

	document.onmousemove = e => {
		mouse.x = e.clientX - (scene.origin.x);
		mouse.y = (scene.origin.y) - e.clientY;
	}

	let p1 = BASIX.polygon.regular(0, 0, 4, 1, 100, {
		color: '#4FC3F7'
	});

	scene.add([p1])

	// console.log(scene.storage)

	let cache = 0;
	const animate = (elapsed) => {
		requestAnimationFrame(animate);
		const delta = elapsed - cache;
		cache = elapsed;
		p1.x += 0.01;
		// camera.y += 1;
		scene.refill('#111').update(camera);
	}; animate();
}; main();