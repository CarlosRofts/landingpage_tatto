import { gsap } from 'gsap';
import barba from '@barba/core';
import { select } from './utils/selectors/selectors.js';
import getFileName, { isHome } from './utils/url/getFileName.js';
import updateBodyColor from './utils/selectors/updateByColor.js';
import threeScene from './three/scene.js';
import { killTriggers } from './utils/scrollTrigger/triggerFlipOnScroll.js';
import { killElasticGalleryTriggers } from './elasticGallery.js';

let scene;

//──── Barba  ──────────────────────────────────────────────────────────────────────────────────
function pageTransitionIn({ container, loaderInner, loader, loaderMask }) {
	console.log('pageTransitionIn', container);
	// timeline to stretch the loader over the whole screen
	const tl = gsap.timeline({
		defaults: {
			duration: 0.8,
			ease: 'power1.inOut',
			onComplete: () => {
				// if (isHome()) killTriggers();
			},
		},
	});
	tl
		.set(loaderInner, { autoAlpha: 0 })
		.fromTo(loader, { yPercent: -100 }, { yPercent: 0 })
		.fromTo(loaderMask, { yPercent: 80 }, { yPercent: 0 }, 0)
		.to(container, { y: 150 }, 0);

	return tl;
}

function pageTransitionOut({ container, initContent, loader, loaderMask }) {
	// timeline to move loader away down
	console.log('pageTransitionOut', container);
	const tl = gsap.timeline({
		defaults: {
			duration: 0.8,
			ease: 'power1.inOut',
		},
		onStart: () => {
			routeHandler();
		},
		onComplete: () => {
			killTriggers();
			if(isHome())killElasticGalleryTriggers();
			killElasticGalleryTriggers();
			initContent();
			// debugger;
		},
	});
	tl.to(loader, { yPercent: 100 }).to(loaderMask, { yPercent: -80 }, 0).from(container, { y: -150 }, 0);
	return tl;
}

export function initPageTransitions({ loaderInner, loader, loaderMask, initContent, initLoader }) {
	// do something before the transition starts
	barba.hooks.before(() => {
		select('html').classList.add('is-transitioning');
	});
	// do something after the transition finishes
	barba.hooks.after(() => {
		select('html').classList.remove('is-transitioning');
	});

	// scroll to the top of the page
	barba.hooks.enter(() => {
		// window.scrollTo(0, 0);
	});

	barba.init({
		transitions: [
			{
				once() {
					// do something once on the initial page load
					routeHandler();
					initLoader();
				},
				async leave({ current }) {
					// animate loading screen in
					await pageTransitionIn({
						container: current.container,
						initContent,
						loader,
						loaderMask,
						loaderInner,
					});
				},
				enter({ next }) {
					// animate loading screen away
					pageTransitionOut({
						container: next.container,
						loaderInner,
						loader,
						loaderMask,
						initContent,
					});
				},
			},
		],
	});
}

function routeHandler() {
	const fileName = getFileName();
	if (fileName === 'gallery') {
		scene = threeScene();
		updateBodyColor('transparent');
		if (scene) scene.start();
	} else if (isHome()) {
		updateBodyColor('var(--bg-dark-color)');
		if (scene) scene.killScene();
		scene = null;
	}
}
