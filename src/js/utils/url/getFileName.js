// getFileName.js

export default function getFileName() {
	// Obtener el pathname actual
	const pathName = typeof window !== 'undefined' ? window.location.pathname : '';
	// Extraer el nombre del archivo de la ruta
	let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
	// Eliminar la extensión .html si existe
	fileName = fileName.replace('.html', '');
	return fileName;
}

export function isHome() {
	if (getFileName() === 'index.html' || getFileName() === '' || getFileName() === 'index') return true;
}
