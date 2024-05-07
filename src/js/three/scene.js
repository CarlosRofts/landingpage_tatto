import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fragmentShader from './glsl/fragment.glsl';
import vertexShader from './glsl/vertex.glsl';
import getMouseValues from './getMouseValues';
import getFileName from '../utils/url/getFileName';
import renderCanvas from '../components/Canvas';
const images = ['texture.jpg', 'texture.jpg', 'texture.jpg'];

export default function threeScene() {
	let canvas = null,
		raf,
		scene = null,
		camera = null,
		renderer = null,
		material = null,
		mesh = null,
		plane,
		sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	// const gui = new GUI();

	const fileName = getFileName();
	if (fileName === 'gallery') {
		console.log('three scene');
		renderCanvas();
	}

	/**
	 * Animate
	 */
	const clock = new THREE.Clock();
	const tick = () => {
		const elapsedTime = clock.getElapsedTime();
		// Update shaders
		material.uniforms.uTime.value = elapsedTime;
		// Render
		renderer.render(scene, camera);
		raf = window.requestAnimationFrame(tick);
	};

	function start() {
		// Canvas
		canvas = document.querySelector('canvas.webgl');

		// Scene
		scene = new THREE.Scene();

		// Loaders
		const textureLoader = new THREE.TextureLoader();
		const raycaster = new THREE.Raycaster();
		// const gltfLoader = new GLTFLoader();

		/**
		 * Sizes
		 */
		sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		window.addEventListener('resize', onWindowResize);

		/**
		 * Camera
		 */
		// Base camera
		camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
		//   camera.position.x = 8;
		//   camera.position.y = 10;
		camera.position.z = 10;
		scene.add(camera);

		/**
		 * Renderer
		 */
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		plane = new THREE.PlaneGeometry(10, 10, 10, 10);

		material = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				uTime: new THREE.Uniform(0),
				uTex: { value: null },
				hoverState: { value: 0 },
				hover: { value: new THREE.Vector2(0.5, 0.5) },
				mouseSpeed: { value: new THREE.Vector2(1, 1) },
				//   u_resolution: { value: new THREE.Vector2(0, 0) },
				u_resolution: {
					value: new THREE.Vector2(window.innerWidth, window.innerHeight),
				},
			},
			// side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false,
			// wireframe: true
		});

		// Cargamos la textura
		textureLoader.load(
			'/img/t2.png',
			function (texture) {
				// Asignamos la textura al uniforme del ShaderMaterial
				material.uniforms.uTex.value = texture;
				// Actualizamos el material para que la textura se muestre
				material.needsUpdate = true;
			},
			undefined,
			function (error) {
				console.error('Error al cargar la textura:', error);
			}
		);

		// Mesh
		mesh = new THREE.Mesh(plane, material);
		scene.add(mesh);
		getMouseValues({
			width: sizes.width,
			height: sizes.height,
			scene,
			camera,
			raycaster,
		});
		tick();
	}

	function onWindowResize() {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		camera.aspect = sizes.width / sizes.height;
		camera.updateProjectionMatrix();

		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		material.uniforms.u_resolution.value.x = window.innerWidth;
		material.uniforms.u_resolution.value.y = window.innerHeight;
	}

	function killScene() {
		console.log('scene killed 🔪🗡');
		// Detener la animación
		window.cancelAnimationFrame(raf);

		// Limpiar la escena
		scene.remove(mesh); // Eliminar el mesh de la escena
		renderer.dispose(); // Liberar recursos del renderer

		// Limpiar los listeners de eventos
		window.removeEventListener('resize', onWindowResize);

		// Asignar null a las variables para liberar la memoria
		canvas.parentNode.removeChild(canvas);
		canvas = null;
		scene = null;
		camera = null;
		renderer = null;
		material = null;
		mesh = null;
		getMouseValues(); //cleanning
	}

	return {
		start,
		killScene,
	};
}
