// menu.js

import getFileName from '../utils/url/getFileName';

console.log('menu');

function renderNavbar() {
	// const body = document.querySelector('.nav-');
	const wrapper = document.querySelector('.nav-wrapper');
	const fileName = getFileName();
	// console.log('El nombre del archivo HTML actual es:', fileName);

	if (fileName === 'gallery') {
		wrapper.innerHTML = `
    <a href="../index.html">
      <div class="logo pointer-events-auto" style="z-index: 100">
      <span class="logo__img"></span>
      <span class="logo__text"></span>
        </div>
    </a>
    `;
	} else {
		if (wrapper) {
			wrapper.innerHTML = `
      <div class="logo">
        <span class="logo__img"></span>
        <span class="logo__text"></span>
      </div>
      
      <nav class="main-nav">
        <ul>
          <li><a href="pages/gallery.html">Gallery</a></li>
          <!-- <li><a href="#0">Blog</a></li>
          <li><a href="#0">How We Work</a></li>
          <li><a href="#0">Contact</a></li> -->
        </ul>
      </nav>
    
  `;
		}
	}
}

export default renderNavbar;
//           <li><a href="/index.html">home</a></li>
