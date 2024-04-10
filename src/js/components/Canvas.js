// Método para insertar un canvas al inicio del body
function renderCanvas() {
	// Crear el elemento canvas
	var canvas = document.createElement('canvas');
	canvas.className = 'webgl';

	// Obtener el body
	var body = document.getElementsByTagName('body')[0];

	// Insertar el canvas al inicio del body
	body.insertBefore(canvas, body.firstChild);
}

// Exportar la función por defecto
export default renderCanvas;