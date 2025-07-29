import { elementos } from './dom.js';
import { eliminarMascota, obtenerMascotas } from './storage.js';

export function crearTarjeta(mascota, index) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${mascota.imagen}" alt="${mascota.nombre}">
    <h3>${mascota.nombre} (${mascota.tipo})</h3>
    <p><strong>Edad:</strong> ${mascota.edad} años</p>
    <p><strong>Raza:</strong> ${mascota.raza}</p>
    <p><strong>Peso:</strong> ${mascota.peso} kg</p>
    <p><strong>Sociable:</strong> ${mascota.sociable}</p>
    <p><strong>Estado de salud:</strong> ${mascota.salud}</p>
    ${mascota.cuidados ? `<p><strong>Cuidados:</strong> ${mascota.cuidados}</p>` : ''}
    ${mascota.comentario ? `<p><strong>Comentario:</strong> ${mascota.comentario}</p>` : ''}
    <button class="btn-eliminar">Eliminar</button>
  `;
  div.querySelector('.btn-eliminar').addEventListener('click', () => {
    if (confirm(`¿Querés eliminar a ${mascota.nombre}?`)) {
      eliminarMascota(index);
      renderAgregadas();
    }
  });
  return div;
}

export function renderAgregadas() {
  const mascotas = obtenerMascotas();
  elementos.listaAgregadas.innerHTML = '';

  if (mascotas.length === 0) {
    elementos.listaAgregadas.innerHTML = '<p>No hay mascotas agregadas aún.</p>';
    return;
  }

  mascotas.forEach((mascota, index) => {
    elementos.listaAgregadas.appendChild(crearTarjeta(mascota, index));
  });
}
