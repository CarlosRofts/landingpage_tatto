// Importa el módulo necesario para pre-cargar imágenes
// import { preloadImages } from '../preload/preloadImages';
import SmoothScrollbar from 'smooth-scrollbar';
import { gsap } from 'gsap';
// Define una variable que almacenará el objeto de SmoothScrollbar

let state = {};
export default function inittriggerFlipOnScroll({ Flip, Scrollbar }) {
  // body
  state.Flip = Flip;
  state.Scrollbar = Scrollbar;
  scroll();
}

// Función para activar animaciones Flip al desplazarse
const triggerFlipOnScroll = (galleryEl, options) => {
  const { Flip } = state;
  // Configuraciones predeterminadas para Flip y ScrollTrigger
  let settings = {
    flip: {
      absoluteOnLeave: false,
      absolute: false,
      scale: true,
      simple: true,
      //...
    },
    scrollTrigger: {
      start: 'center center',
      end: '+=300%',
    },
    stagger: 0,
  };

  // Fusiona las configuraciones predeterminadas con las opciones proporcionadas al llamar a la función
  settings = Object.assign({}, settings, options);

  // Selecciona elementos dentro de la galería que se animarán
  const galleryCaption = galleryEl.querySelector('.caption');
  const galleryItems = galleryEl.querySelectorAll('.gallery__item'); // Convertir a una matriz plana
  const galleryItemsInner = [...galleryItems].flatMap((item) => Array.from(item.children));

  // Agrega temporalmente la clase final para capturar el estado final
  galleryEl.classList.add('gallery--switch');
  //   console.log('galleryItems, galleryCaption', galleryItems, galleryCaption);
  const flipstate = Flip.getState([galleryItems, galleryCaption], { props: 'filter, opacity' });

  // Elimina la clase final para revertir al estado inicial
  galleryEl.classList.remove('gallery--switch');

  // Crea la línea de tiempo de animación Flip
  const tl = Flip.to(flipstate, {
    ease: 'none',
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
      //   markers:true,
    },
    stagger: settings.stagger,
    onUpdate: () => {
      console.log('update flip');
    },
  });
  console.log('settings', settings);

  // Si hay elementos internos en los elementos de la galería, también anímalos
  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      {
        scale: 2,
        ease: 'none',
      },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
          ease: 'none',
        },
      },
      0
    );
  }
};

// Función para aplicar animaciones desencadenadas por desplazamiento a varias galerías
const scroll = () => {
  // Define los ID de las galerías y sus opciones
  const galleries = [{ id: '#gallery-2' }];

  // Recorre las galerías y aplica las animaciones desencadenadas por desplazamiento
  galleries.forEach((gallery) => {
    const galleryElement = document.querySelector(gallery.id);
    triggerFlipOnScroll(galleryElement, gallery.options);
  });
};
