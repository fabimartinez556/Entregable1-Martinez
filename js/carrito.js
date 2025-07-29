const contenedorCarrito = document.getElementById('carrito');
let carrito = JSON.parse(localStorage.getItem('carritoAdopcion')) || [];
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

function renderCarrito() {
  contenedorCarrito.innerHTML = '';

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = '<p>No hay mascotas en el carrito.</p>';
    return;
  }

  carrito.forEach((mascota, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${mascota.imagen}" alt="${mascota.nombre}" class="img-card">
      <h3>${mascota.nombre}</h3>
      <p>Raza: ${mascota.raza}</p>
      <p>Edad: ${mascota.edad} años</p>
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    contenedorCarrito.appendChild(card);
  });

  // Botón Adoptar
  const btnAdoptar = document.createElement('button');
  btnAdoptar.textContent = 'Adoptar';
  btnAdoptar.className = 'btnAdoptar';
  contenedorCarrito.appendChild(btnAdoptar);

  // Eventos eliminar
  contenedorCarrito.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      eliminarDelCarrito(idx);
    });
  });

  btnAdoptar.addEventListener('click', adoptar);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carritoAdopcion', JSON.stringify(carrito));
  mostrarNotificacion('Mascota eliminada del carrito', 'error');
  renderCarrito();
}

function adoptar() {
  if (carrito.length === 0) {
    mostrarNotificacion('El carrito está vacío', 'error');
    return;
  }

  // Agregar las mascotas del carrito a adoptados sin repetir
  carrito.forEach(mascota => {
    if (!adoptados.some(a => a.nombre === mascota.nombre && a.raza === mascota.raza)) {
      adoptados.push(mascota);
    }
  });

  localStorage.setItem('adoptados', JSON.stringify(adoptados));

  carrito = [];
  localStorage.setItem('carritoAdopcion', JSON.stringify(carrito));

  mostrarNotificacion('¡Gracias por adoptar! 🎉', 'exito');

  renderCarrito();
}

renderCarrito();
