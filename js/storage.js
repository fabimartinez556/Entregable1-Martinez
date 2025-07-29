export function obtenerMascotas() {
  return JSON.parse(localStorage.getItem('mascotas')) || [];
}

export function guardarMascota(mascota) {
  const mascotas = obtenerMascotas();
  mascotas.push(mascota);
  localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

export function eliminarMascota(index) {
  const mascotas = obtenerMascotas();
  mascotas.splice(index, 1);
  localStorage.setItem('mascotas', JSON.stringify(mascotas));
}
