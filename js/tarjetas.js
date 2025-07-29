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
    <div class="acciones">
      <button class="btn-eliminar">Eliminar</button>
    </div>
  `;

  const acciones = div.querySelector('.acciones');
  const btnEliminar = acciones.querySelector('.btn-eliminar');

  btnEliminar.addEventListener('click', () => {
    acciones.innerHTML = `
      <span>¿Confirmar?</span>
      <button class="btn-si">Sí</button>
      <button class="btn-no">Cancelar</button>
    `;

    acciones.querySelector('.btn-si').addEventListener('click', () => {
      div.classList.add('fade-out');
      setTimeout(() => {
        eliminarMascota(index);
        renderAgregadas();
      }, 400);
    });

    acciones.querySelector('.btn-no').addEventListener('click', () => {
      acciones.innerHTML = `<button class="btn-eliminar">Eliminar</button>`;
      acciones.querySelector('.btn-eliminar').addEventListener('click', () => btnEliminar.click());
    });
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
