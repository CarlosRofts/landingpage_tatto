// const base = document.createElement('base');
// base.href = import.meta.env.BASE_URL;
// document.head.insertBefore(base, document.head.firstChild);

import '../css/normalize.css';
import '../css/main.css';
import '../css/app.css';
import '../css/landing_scroll_gallery.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Scrollbar from 'smooth-scrollbar';
import imagesLoaded from 'imagesloaded';
import { initPageTransitions } from './barbaHandler.js';
import { selectAll, select } from './utils/selectors/selectors.js';
import { renderLoader } from './components/Barbaloader.js';
import renderNavbar from './components/Navbar.js';
import { Flip } from 'gsap/Flip';
import inittriggerFlipOnScroll from './utils/scrollTrigger/triggerFlipOnScroll.js';
// import { initSmoothScrolling, triggerFlipOnScroll } from './utils/scrollTrigger/triggerFlipOnScroll.js'; // Asegúrate de tener la ruta correcta a tu módulo de smooth scrolling
import { CustomEase } from 'gsap/CustomEase';
import { EaselPlugin } from 'gsap/EaselPlugin';
import getFileName, { isHome } from './utils/url/getFileName.js';
import initElasticGallery from './elasticGallery.js';

renderLoader(); // 🔨 hacer que retorne las variables

let allLinks = gsap.utils.toArray('.portfolio__categories a');
let pageBackground = document.querySelector('.fill-background');
let largeImage = document.querySelector('.portfolio__image--l');
let smallImage = document.querySelector('.portfolio__image--s');
let lInside = document.querySelector('.portfolio__image--l .image_inside');
let sInside = document.querySelector('.portfolio__image--s .image_inside');

const loader = select('.loader'); // loader container
const loaderInner = select('.loader .inner');
const progressBar = select('.loader .progress');
const loaderMask = select('.loader__mask');

gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin, EaselPlugin, CustomEase);

let arrayOfLinks = gsap.utils.toArray('.main-nav a');
let arrayOfLinksRev = gsap.utils.toArray('.main-nav a').reverse();
let bodyScrollBar;

console.log('main.js');

//──── M6 Loader ──────────────────────────────────────────────────────────────────────────────────

init();
function init() {
	gsap.set(loader, { autoAlpha: 1 });

	gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: 'bottom' });

	// make a tween that scales the loader
	const progressTween = gsap.to(progressBar, {
		paused: true,
		scaleX: 0,
		ease: 'none',
		transformOrigin: 'right',
	});

	// setup variables
	let loadedImageCount = 0,
		imageCount;
	const container = select('#main');
	// console.log('container', container);
	// setup Images loaded
	const imgLoad = imagesLoaded(container);
	imageCount = imgLoad.images.length;

	// set the initial progress to 0
	updateProgress(0);

	// triggered after each item is loaded
	imgLoad.on('progress', function () {
		// increase the number of loaded images
		loadedImageCount++;
		// update progress
		updateProgress(loadedImageCount);
	});

	// update the progress of our progressBar tween
	function updateProgress(value) {
		// console.log('progress', value / imageCount);
		// tween progress bar tween to the right value
		gsap.to(progressTween, {
			progress: value / imageCount,
			duration: 0.3,
			ease: 'power1.out',
		});
	}

	// do whatever you want when all images are loaded
	imgLoad.on('done', function (instance) {
		// we will simply init our loader animation onComplete
		gsap.set(progressBar, {
			autoAlpha: 0,
			onComplete: () => {
				initPageTransitions({
					loaderInner,
					loader,
					loaderMask,
					initContent: () => initContent(),
					initLoader,
				});
			},
		});
	});
}

//──── m6 loader  ──────────────────────────────────────────────────────────────────────────────────
function initLoader() {
	const tlLoaderIn = gsap.timeline({
		id: 'tlLoaderIn',
		defaults: {
			duration: 1.1,
			ease: 'Power2.out',
		},
		onComplete: () => initContent(),
	});
	const image = select('.loader__image img');
	const mask = select('.loader__image--mask');
	const line1 = select('.loader__title--mask:nth-child(1) span'); // title 1
	const line2 = select('.loader__title--mask:nth-child(2) span'); // title 2
	const lines = selectAll('.loader__title--mask'); // mask of titles
	const loaderContent = select('.loader__content'); // loader content

	tlLoaderIn
		.set([loader, loaderContent], { autoAlpha: 1 })
		.to(loaderInner, {
			scaleY: 1,
			transformOrigin: 'bottom',
			ease: 'power1.inOut',
		})
		.addLabel('revealImage')
		.from(mask, { yPercent: 100 }, 'revealImage -=0.6')
		.from(image, { yPercent: -50 }, 'revealImage -=0.6') // add paralaxx
		.from([line1, line2], { yPercent: 100, stagger: 0.1 }, 'revealImage-=0.4');

	const tlLoaderOut = gsap.timeline({
		id: 'tlLoaderOut',
		defaults: {
			duration: 1.2,
			ease: 'power2.inOut',
		},
		delay: 1,
		onComplete: () => {
			loaderContent.style.display = 'none';
		},
	});
	tlLoaderOut.to(lines, { yPercent: -500, stagger: 0.2 }, 0).to([loader, loaderContent], { yPercent: -100 }, 0.2); //
	// tlLoaderOut.from('#main', { y: 150 }, 0); // bug scrollTrigger

	const tlLoader = gsap.timeline();
	tlLoader.add(tlLoaderIn).add(tlLoaderOut);

	// GSDevTools.create({ paused: false });
}

function initContent() {
	const filename = getFileName();

	select('body').classList.remove('is-loading');
	initSmoothScrollbar();
	if (filename === 'gallery') {
		console.log('gallery');
		initElasticGallery({ ScrollTrigger, bodyScrollBar });
	}
	if (isHome()) {
		mediaquery();
		initHeaderTilt();
		initPortfolioHover();
		initImageParallax();
		inittriggerFlipOnScroll({
			bodyScrollBar,
			Flip,
			ScrollTrigger,
		});
	}
	renderNavbar();
	initScrollTo();
	animateNavigation();
}

function mediaquery() {
	// mediaqueries
	const mq = window.matchMedia('(min-width: 768px)');
	//   mq.addListener(handleWidthChange);
	mq.removeEventListener('change', handleWidthChange);
	mq.addEventListener('change', () => {
		handleWidthChange(mq);
	});
	handleWidthChange(mq);
	function handleWidthChange(mq) {
		console.log('handleWidthChange', mq);
		if (mq.matches) {
			// desktop
			console.log('desktop');
			initHoverReveal();
		} else {
			// mobile
			console.log('mobile');
			sections.forEach((section) => {
				section.removeEventListener('mouseenter', createHoverReveal);
				section.removeEventListener('mouseleave', createHoverReveal);
				const { imgBlock, mask, text, textCopy, textMask, text_p, image } = section;
				resetProps([imgBlock, mask, text, textCopy, textMask, text_p, image]);
			});
		}
	}
}

//──── links & Header M1 ──────────────────────────────────────────────────────────────────────────────────
function animateNavigation() {
	arrayOfLinks = gsap.utils.toArray('.main-nav a');
	arrayOfLinksRev = gsap.utils.toArray('.main-nav a').reverse();

	if (arrayOfLinks)
		arrayOfLinks.forEach((link) => {
			link.addEventListener('mouseleave', () => {
				link.classList.add('animate-out');
				setTimeout(() => {
					link.classList.remove('animate-out');
				}, 300);
			});
		});

	//──── onScroll stagger fade links ──────────────────────────────────────────────────────────────────────────────────
	let isNotPlay = true;
	function navAnimation(direction) {
		const scrollingDown = direction === 1;
		const links = scrollingDown ? arrayOfLinks : arrayOfLinksRev;

		return gsap.to(links, {
			duration: 0.5,
			stagger: 0.2,
			autoAlpha: () => (scrollingDown ? 0 : 1),
			y: () => (scrollingDown ? 20 : 0),
			onStart: () => (isNotPlay = true),
			onComplete: () => (isNotPlay = true),
			onUpdate: () => (isNotPlay = false),
			easing: 'Powe4.out',
		});
	}

	//──── Hamburger transition on scroll.. ──────────────────────────────────────────────────
	ScrollTrigger.create({
		start: 100,
		end: 'bottom bottom-=20',
		toggleClass: {
			targets: 'body',
			className: 'has-scrolled',
		},
		onEnter: ({ direction }) => navAnimation(direction),
		onLeaveBack: ({ direction }) => navAnimation(direction),
		// markers: true,
	});
}
function initHeaderTilt() {
	const header = document.querySelector('#hero-header');
	if (header) {
		header.removeEventListener('mousemove', moveImages);
		header.addEventListener('mousemove', moveImages);
	}
	function moveImages(e) {
		const { offsetX, offsetY, target } = e;
		const { clientWidth, clientHeight } = target;
		// get 0 0 in the center
		const xPos = offsetX / clientWidth - 0.5;
		const yPos = offsetY / clientHeight - 0.5;

		const leftImages = gsap.utils.toArray('.hg__left .hg__image');
		const rightImages = gsap.utils.toArray('.hg__right .hg__image');
		const modifier = (i) => i * 1.2 + 0.5;

		leftImages.forEach((img, i) => {
			gsap.to(img, {
				duration: 1.2,
				x: xPos * 20 * modifier(i),
				y: yPos * 30 * modifier(i),
				rotationY: xPos * 60,
				rotationX: yPos * -15,
			});
		});
		rightImages.forEach((img, i) => {
			gsap.to(img, {
				duration: 1.2,
				x: xPos * 20 * modifier(i),
				y: -yPos * 30 * modifier(i),
				rotationY: xPos * 60,
				rotationX: yPos * -15,
			});
		});

		gsap.to('.decor__circle', {
			duration: 1.7,
			x: 100 * xPos,
			y: 120 * yPos,
			ease: 'Power4.out',
		});
	}
}
//──── Galerry  ──────────────────────────────────────────────────────────────────────────────────
let sections = document.querySelectorAll('.rg__column');
function initHoverReveal() {
	sections = document.querySelectorAll('.rg__column');

	if (sections.length) {
		// console.log('initHoverReveal', sections);
		sections.forEach((section) => {
			section.imgBlock = section.querySelectorAll('.rg__image');
			section.image = section.querySelectorAll('.rg__image img');
			section.mask = section.querySelectorAll('.rg__image--mask');
			section.text = section.querySelectorAll('.rg__text');
			section.textCopy = section.querySelector('.rg__text--copy');
			section.textMask = section.querySelector('.rg__text--mask');
			section.text_p = section.querySelector('.rg__text--mask p');

			gsap.set([section.imgBlock, section.textMask], { yPercent: -101 });
			gsap.set([section.mask, section.text_p], { yPercent: 100 });
			gsap.set([section.image], { scale: 1.2 });

			section.removeEventListener('mouseenter', createHoverReveal);
			section.removeEventListener('mouseleave', createHoverReveal);
			section.addEventListener('mouseenter', createHoverReveal);
			section.addEventListener('mouseleave', createHoverReveal);
		});
	}
}
function getTextHeight(textCopy) {
	return textCopy.clientHeight;
}
function createHoverReveal(e) {
	console.log('createHoverReveal event', e.type);
	const { imgBlock, mask, text, textCopy, textMask, text_p, image } = e.target;
	const tl = gsap.timeline({ defaults: { duration: 0.7, ease: 'Power4.out' } });

	if (e.type === 'mouseenter') {
		console.log('mouse enter');
		tl
			.to([mask, imgBlock, textMask, text_p], { yPercent: 0 }, 0) //
			.to(text, { y: -getTextHeight(textCopy) / 2 }, 0)
			.to(image, { duration: 1.1, scale: 1 }, 0);
	} else if (e.type === 'mouseleave') {
		console.log('mouseleave');
		tl
			.to([mask, text_p], { yPercent: 100 })
			.to([imgBlock, textMask], { yPercent: -101 }, 0) // positioning to 0 seconds in timeline, star equals
			.to(text, { y: 0 }, 0)
			.to(image, { duration: 1.1, scale: 1.2 }, 0);
		// .to(text_p, { y: 100 })
		// .to(textMask, { yPercent: -101 }, 0); // positioning to 0 seconds in timeline, star equals
	}
	return tl;
}

function resetProps(elements) {
	// gsap.killTweensOf('*'); // *  stop all tween and reset params
	if (elements.length > 0) {
		elements.forEach((el) => {
			el && gsap.set(el, { clearProps: 'all' });
		});
	}
}

//──── Portfolio ──────────────────────────────────────────────────────────────────────────────────

function initPortfolioHover() {
	// update variables
	allLinks = gsap.utils.toArray('.portfolio__categories a');
	lInside = document.querySelector('.portfolio__image--l .image_inside');
	sInside = document.querySelector('.portfolio__image--s .image_inside');
	largeImage = document.querySelector('.portfolio__image--l');
	smallImage = document.querySelector('.portfolio__image--s');
	// events
	allLinks.forEach((link) => {
		link.addEventListener('mouseenter', createPortfolioHover);
		link.addEventListener('mouseleave', createPortfolioHover);
		link.addEventListener('mousemove', createPortfolioMove);
		// link.addEventListener('mouseenter', createPortfolioMove);
	});
}

function createPortfolioHover(e) {
	if (e.type === 'mouseenter') {
		// createPortfolioMove(e);
		console.log('createPortfolioHover - mouseenter');
		const { color, imagelarge, imagesmall } = e.target.dataset;
		const allSiblings = allLinks.filter((item) => item !== e.target);
		const tl = gsap.timeline();
		// console.log('data set', e.target.dataset);
		// console.log('color', color);
		// console.log('imagelarge', imagelarge);
		// console.log('imagesmall', imagesmall);

		tl
			.set(lInside, { backgroundImage: `url(${imagelarge})` })
			.set(sInside, { backgroundImage: `url(${imagesmall})` })
			.to([largeImage, smallImage], { autoAlpha: 1 })
			.to(allSiblings, { color: '#fff', autoAlpha: 0.2 }, 0)
			.to(e.target, { color: '#fff', autoAlpha: 1 }, 0);
		// .to(pageBackground, { backgroundColor: "color", ease: 'none' }, 0);
	}
	if (e.type === 'mouseleave') {
		console.log('createPortfolioHover - mouseleave');

		const tl = gsap.timeline({
			// onStart: () => updateBodyColor('#ACB7AE')
		});
		tl.to([largeImage, smallImage], { autoAlpha: 0 }).to(allLinks, { color: '#000000', autoAlpha: 1 }, 0);
		// .to(pageBackground, { backgroundColor: '#acb7ae', ease: 'none' }, 0);
	}
}
function createPortfolioMove(e) {
	const { clientY } = e;
	//   console.log('clientY: ', clientY);
	gsap.to(largeImage, {
		duration: 1.2,
		y: getPortfolioOffset(clientY) / 6,
		ease: 'Power3.out',
	});
	gsap.to(smallImage, {
		duration: 1.5,
		y: getPortfolioOffset(clientY) / 3,
		ease: 'Power3.out',
	});
}

//──── image Parallax ──────────────────────────────────────────────────────────────────────────────────

function initImageParallax() {
	gsap.utils.toArray('.with-parallax').forEach((section) => {
		const image = section.querySelector('img');
		// console.log('parallax element', image);

		gsap.to(image, {
			yPercent: 20, // move the image in %
			ease: 'none',
			scrollTrigger: {
				trigger: section,
				start: 'top bottom',
				scrub: true, // retoma el pin en segundos. u onScroll
				// markers: true,
			},
		});
	});
}

//──── smooth scrolling ──────────────────────────────────────────────────────────────────────────────────
function initScrollTo() {
	// find all links and animate to the right position
	gsap.utils.toArray('.fixed-nav a').forEach((link) => {
		const target = link.getAttribute('href');

		link.addEventListener('click', (e) => {
			e.preventDefault();
			// whit smoothScroll Lib
			bodyScrollBar.scrollIntoView(document.querySelector(target), {
				damping: 0.07,
				offsetTop: 100,
			});
		});
	});
}

function initSmoothScrollbar() {
	bodyScrollBar = Scrollbar.init(document.querySelector('#viewport'));

	// remove horizontal scrollbar
	bodyScrollBar.track.xAxis.element.remove();

	// Keep ScrollTrigger in sync with Smooth Scrollbar
	ScrollTrigger.scrollerProxy(document.body, {
		scrollTop(value) {
			if (arguments.length) {
				bodyScrollBar.scrollTop = value; // setter
			}
			return bodyScrollBar.scrollTop; // getter
		},
	});
	// when the smooth scroller updates, tell ScrollTrigger to update() too:
	bodyScrollBar.addListener(ScrollTrigger.update);
}

//──── Render ──────────────────────────────────────────────────────────────────────────────────
function getPortfolioOffset(clientY) {
	return -(document.querySelector('.portfolio__categories').clientHeight - clientY);
}
