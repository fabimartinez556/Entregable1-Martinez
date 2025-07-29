const contenedorSolicitudes = document.getElementById('solicitudes');
let solicitudes = JSON.parse(localStorage.getItem('solicitudesAdopcion')) || [];
let adoptados = JSON.parse(localStorage.getItem('adoptados')) || [];

// Contenedor para notificaciones (reutilizando el toast del CSS)
let contenedorNotificaciones = document.getElementById('notificaciones');
if (!contenedorNotificaciones) {
  contenedorNotificaciones = document.createElement('div');
  contenedorNotificaciones.id = 'notificaciones';
  document.body.appendChild(contenedorNotificaciones);
}

function mostrarNotificacion(mensaje, tipo = 'exito', duracion = 3000) {
  const notif = document.createElement('div');
  notif.textContent = mensaje;
  notif.className = `toast-mensaje ${tipo}`;
  contenedorNotificaciones.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
  }, duracion - 500);

  setTimeout(() => {
    if (contenedorNotificaciones.contains(notif)) {
      contenedorNotificaciones.removeChild(notif);
    }
  }, duracion);
}

function renderSolicitudes() {
  contenedorSolicitudes.innerHTML = '';

  if (solicitudes.length === 0) {
    contenedorSolicitudes.innerHTML = '<p>No hay mascotas en solicitudes.</p>';
    return;
  }

  solicitudes.forEach((mascota, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${mascota.imagen}" alt="${mascota.nombre}" class="img-card">
      <h3>${mascota.nombre}</h3>
      <p>Raza: ${mascota.raza}</p>
      <p>Edad: ${mascota.edad} años</p>
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    contenedorSolicitudes.appendChild(card);
  });

  // Botón Adoptar
  const btnAdoptar = document.createElement('button');
  btnAdoptar.textContent = 'Adoptar';
  btnAdoptar.className = 'btnAdoptar';
  contenedorSolicitudes.appendChild(btnAdoptar);

  // Eventos eliminar
  contenedorSolicitudes.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      eliminarDeSolicitudes(idx);
    });
  });

  btnAdoptar.addEventListener('click', adoptar);
}

function eliminarDeSolicitudes(index) {
  solicitudes.splice(index, 1);
  localStorage.setItem('solicitudesAdopcion', JSON.stringify(solicitudes));
  mostrarNotificacion('Mascota eliminada de solicitudes', 'error');
  renderSolicitudes();
}

function adoptar() {
  if (solicitudes.length === 0) {
    mostrarNotificacion('No hay solicitudes', 'error');
    return;
  }

  // Agregar las mascotas desde solicitudes a adoptados sin repetir
  solicitudes.forEach(mascota => {
    if (!adoptados.some(a => a.nombre === mascota.nombre && a.raza === mascota.raza)) {
      adoptados.push(mascota);
    }
  });

  localStorage.setItem('adoptados', JSON.stringify(adoptados));

  solicitudes = [];
  localStorage.setItem('solicitudesAdopcion', JSON.stringify(solicitudes));

  mostrarNotificacion('¡Gracias por adoptar! 🎉', 'exito');

  renderSolicitudes();
}

renderSolicitudes();
