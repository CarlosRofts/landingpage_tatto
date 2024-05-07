import gsap from 'gsap';
import '../css/elasticGallery.css';

let state = { tl: null };

export default function initElasticGallery({ ScrollTrigger, bodyScrollBar }) {
	console.log('init gallery');

	state.items = document.querySelectorAll('.elastic-gallery  .item');
	bodyScrollBar.damping = 0.4; // Controla la velocidad de desaceleración
	bodyScrollBar.thumbMinSize = 40; // Tamaño mínimo de la manija de la barra de desplazamiento
	bodyScrollBar.renderByPixels = true; // Renderizar en píxeles enteros
	bodyScrollBar.alwaysShowTracks = false; // Mostrar pistas solo cuando sea necesario
	bodyScrollBar.continuousScrolling = true; // Habilitar desplazamiento continuo
	state.ScrollTrigger = ScrollTrigger;
	state.bodyScrollBar = bodyScrollBar;

	init();
}
function init() {
	const { ScrollTrigger, items, bodyScrollBar } = state;
	items.forEach((item, i) => {
		const originalHeight = item.offsetHeight; // Guardamos la altura original del elemento
		const maxHeight = window.innerHeight * 0.8;
		let isHeightIncreased = false; // Variable para rastrear si la altura ya ha sido aumentada
		state.elasticTrigger = ScrollTrigger.create({
			id:'elasticGallery',
			trigger: item,
			start: () => {
				if (i === 0 || i === 1) return `top-=${150}px center`;
				return `top-=${200}px center`;
			},
			end: () => {
				// Calculamos una posición fija para `end` basada en la altura máxima
				return `top+=${maxHeight * 0.1}px top`;
			},
			// markers: true,
			toggleClass: 'active',
			anticipatePin: 1,
			scrub: 1,
			// refreshPriority: 1, // influence refresh order
			// invalidateOnRefresh: true, // clears start values on refresh
			// snap: {
			// 	snapTo: 1 / 10, // progress increment
			// 	// or "labels" or function or Array
			duration: 0.5,
			// 	directional: true,
			// ease: 'power3',
			// 	// onComplete: callback,
			// 	// other callbacks: onStart, onInterrupt
			// },
			onUpdate: (self) => {
				let scrollProgress = self.progress; // Obtener el progreso del desplazamiento 0 to 1
				console.log('scrollProgress', scrollProgress);
				const targetHeight = originalHeight + scrollProgress * maxHeight; // Calcular la altura objetivo en función del progreso del desplazamiento
				gsap.to(item, {
					height: targetHeight,
					// height: maxHeight,
					duration: 0.55,
				});
				gsap.from(item.querySelectorAll('img'), { ease: 'elastic.inOut(1,.5)', duration: 0.5 });
			},
			onLeave: () => {
				console.log('leave', item);
				gsap.to(item, {
					// height: originalHeight,
					height: maxHeight,
					duration: 0.55,
				});
				isHeightIncreased = false;
				ScrollTrigger.refresh();
			},
			// onEnter: () => {
			// 	console.log('enter', item);
			// 	// ScrollTrigger.refresh();
			// },
			// onEnterBack: () => {
			// 	console.log('onEnterBack');
			// 	// ScrollTrigger.refresh();
			// },
			// onLeaveBack: () => {
			// 	console.log('onLeaveBack');
			// 	// ScrollTrigger.refresh();
			// },
			// onToggle: () => {
			// 	console.log('onToggle');
			// },
			// onRefresh: () => {
			// 	console.log('onRefresh');
			// },
			// onRefreshInit: () => {
			// 	console.log('onRefreshInit');
			// },
			// onScrubComplete: () => {
			// 	console.log('onScrubComplete');
			// },
		});
	});
}

export function killElasticGalleryTriggers() {
	const { ScrollTrigger ,elasticTrigger} = state;
	console.log('kill elasticGallery');
	// ScrollTrigger.kill();

	if (ScrollTrigger) {
		// let trigger = ScrollTrigger.getById('elasticGallery');
		// if (trigger) trigger.kill();
		// elasticTrigger.kill();
		// ScrollTrigger.refresh();

		let triggers = ScrollTrigger.getAll();
		triggers.forEach( trigger => {			
			trigger.kill();
		});
	}

	
}
