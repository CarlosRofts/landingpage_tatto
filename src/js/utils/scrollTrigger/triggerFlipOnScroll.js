import gsap from 'gsap';

let state = { tl: null };

export default function inittriggerFlipOnScroll({ Flip, ScrollTrigger, bodyScrollBar }) {
	state.Flip = Flip;
	state.ScrollTrigger = ScrollTrigger;
	state.bodyScrollBar = bodyScrollBar;
	scroll();
	// killTriggers();
}

export function killTriggers() {
	const { ScrollTrigger } = state;
	// ScrollTrigger.kill();

	if (ScrollTrigger) {
		let flip_trigger = ScrollTrigger.getById('Flip_trigger');
		let galleryItemsInner_trigger = ScrollTrigger.getById('galleryItemsInner_trigger');
		//(on just that instance):
		if (flip_trigger) flip_trigger.kill();
		if (galleryItemsInner_trigger) galleryItemsInner_trigger.kill();

		// or cause ALL ScrollTrigger instances to refresh using the static method:
		ScrollTrigger.refresh();
	}

	// Elimina los ScrollTriggers asociados a los elementos de la galería
	// ScrollTrigger.getAll().forEach((trigger) => {
	// 	if (trigger.trigger.parentNode.classList.contains('gallery')) {
	// 		trigger.kill(); // Detiene y elimina el ScrollTrigger
	// 	}
	// });
}

// Función para activar animaciones Flip al desplazarse
const triggerFlipOnScroll = (galleryEl, options) => {
	let { tl } = state;
	// debugger;

	if (galleryEl) {
		const { Flip, ScrollTrigger, bodyScrollBar } = state;
		// Configuraciones predeterminadas para Flip
		let settings = {
			flip: {
				absoluteOnLeave: false,
				absolute: false,
				scale: true,
				simple: true,
				//...
			},
			// scrollTrigger: {
			//   start: 'top top',
			//   end: '+=300%',
			// },
			stagger: 0,
		};

		// Fusiona las configuraciones predeterminadas con las opciones proporcionadas al llamar a la función
		settings = { ...settings, ...options };
		// console.log('settings', settings);

		// Selecciona elementos dentro de la galería que se animarán
		const galleryCaption = galleryEl.querySelector('.caption');
		const galleryItems = Array.from(galleryEl.querySelectorAll('.gallery__item'));
		const galleryItemsInner = galleryItems.flatMap((item) => Array.from(item.children));

		// Temporalmente añade la clase final para capturar el estado final
		galleryEl.classList.add('gallery--switch');
		const flipstate = Flip.getState([galleryItems, galleryCaption], { props: 'filter, opacity' });

		// Elimina la clase final para revertir al estado inicial
		galleryEl.classList.remove('gallery--switch');

		// Crea la animación Flip
		tl = Flip.to(flipstate, {
			ease: 'none',
			absoluteOnLeave: settings.flip.absoluteOnLeave,
			absolute: settings.flip.absolute,
			scale: settings.flip.scale,
			simple: settings.flip.simple,
			stagger: settings.stagger,
			scrollTrigger: {
				trigger: galleryEl.parentNode,
				triggerHook: 0,
				start: 'center center',
				end: '+=300%',
				scrub: true,
				// pin: galleryEl.parentNode,
				pin: true,
				pinReparent: true,
				pinSpacing: true,
				anticipatePin: 1,
				container: '.scroll-content',
				id: 'Flip_trigger',
				// markers:true,
			},
		});

		// console.log('galleryEl.parentNode', galleryEl.parentNode);

		// Si hay elementos internos en los elementos de la galería, también anímalos
		if (galleryItemsInner.length) {
			tl.fromTo(
				galleryItemsInner,
				{
					scale: 2,
				},
				{
					scale: 1,
					scrollTrigger: {
						trigger: galleryEl,
						triggerHook: 0,
						start: 'top top',
						end: '+=300%',
						scrub: true,
						pinReparent: true,
						id: 'galleryItemsInner_trigger',
					},
				}
			);
		}

		// gsap.set('.pin-spacer', { paddingTop: '-0px' });
		// gsap.set('.pin-spacer', { margin: '100px 0px' });

		// bodyScrollBar.update();
		// ScrollTrigger.update();

		// Crea un ScrollTrigger para la galería
		// ScrollTrigger.create({
		//   trigger: galleryEl,
		//   start: 'top top',
		//   end: '+=300%', // Desactiva la animación cuando la parte inferior de la galería alcanza el centro del viewport
		//   animation: tl, // Usa la animación Flip como animación del ScrollTrigger
		//   // pin: galleryEl.parentNode,
		//   pin: galleryEl.parentNode,
		//   scrub: true, // Activa el modo de fregado para una transición suave
		//   pinReparent: true, // fix pin // moves to documentElement during pin // bug, send the element to the root html whit z-index:0
		//   // markers: true,

		// });
	}
};

// Función para aplicar animaciones desencadenadas por desplazamiento a varias galerías
const scroll = () => {
	const galleries = [{ id: '#gallery-1' }, { id: '#gallery-2', options: { flip: { absoluteOnLeave: true, scale: false } } }];

	// Recorre las galerías y aplica las animaciones desencadenadas por desplazamiento
	galleries.forEach((gallery) => {
		const galleryElement = document.querySelector(gallery.id);
		triggerFlipOnScroll(galleryElement, gallery.options);
	});
};
