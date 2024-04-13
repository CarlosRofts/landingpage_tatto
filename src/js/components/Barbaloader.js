export function renderLoader() {
	const body = document.querySelector('[data-barba="wrapper"]');
	body.innerHTML += `
	<div class="loader loader_of_pages">
		<div class="loader__mask">
			<div class="inner">
				<div class="progress"></div>
				<h1></h1>
			</div>
			<!-- this will scale up -->
		</div>
	</div>
	
	<div class="loader__content ">
		<div class="inner">
			<!-- this will be animated on top of the dark background -->
			<div class="loader__title">
				<div class="loader__title--mask"><span>Transforma</span></div>
				<div class="loader__title--mask"><span>Tu cuerpo</span></div>
			</div>
			<div class="loader__image">
				<div class="loader__image--mask">
					<img src="/img/img_landscape-01-large.jpg" />
				</div>
			</div>
		</div>
	</div>
    
`;
	body.style.opacity = 1;
}
