// getFileName.js

export default function getFileName() {
  // Obtener el pathname actual
  const pathName = typeof window !== 'undefined' ? window.location.pathname : '';

  // Extraer el nombre del archivo de la ruta
  const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

  return fileName;
}
