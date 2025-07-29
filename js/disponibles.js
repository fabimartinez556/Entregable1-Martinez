const lista = document.getElementById("listaMascotas");
let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
let carrito = JSON.parse(localStorage.getItem("carritoAdopcion")) || [];
let adoptados = JSON.parse(localStorage.getItem("adoptados")) || [];

// notificacion
const contenedorNotificaciones = document.getElementById('toast');

function mostrarNotificacion(mensaje, tipo = 'exito', duracion = 3000) {
  contenedorNotificaciones.textContent = mensaje;
  contenedorNotificaciones.className = `toast-mensaje ${tipo}`;
  contenedorNotificaciones.classList.remove('oculto');

  setTimeout(() => {
    contenedorNotificaciones.classList.add('oculto');
  }, duracion);
}

function renderMascotas() {
  lista.innerHTML = "";
  mascotas.forEach((mascota, index) => {
    const estaAdoptada = adoptados.some(
      (a) => a.nombre === mascota.nombre && a.raza === mascota.raza
    );
    const enCarrito = carrito.some(
      (c) => c.nombre === mascota.nombre && c.raza === mascota.raza
    );
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${mascota.imagen}" alt="${mascota.nombre}" class="img-card">
      <h3>${mascota.nombre} (${mascota.tipo})</h3>
      <p><strong>Raza:</strong> ${mascota.raza}</p>
      <p><strong>Edad:</strong> ${mascota.edad} años</p>
      <p><strong>Peso:</strong> ${mascota.peso} kg</p>
      <p><strong>Sociable:</strong> ${mascota.sociable}</p>
      <p><strong>Salud:</strong> ${mascota.salud}</p>
      ${
        mascota.salud === "Requiere cuidados"
          ? `<p><strong>Cuidados:</strong> ${mascota.cuidados}</p>`
          : ""
      }
      ${
        mascota.comentario
          ? `<p><strong>Comentario:</strong> ${mascota.comentario}</p>`
          : ""
      }
      <button
        ${estaAdoptada ? "disabled style='background:#95a5a6; cursor:not-allowed;'" : ""}
        ${enCarrito ? "disabled style='background:#3182ce; cursor:not-allowed;'" : ""}
        onclick="agregarAlCarrito(${index})"
      >
        ${
          estaAdoptada
            ? "Adoptado"
            : enCarrito
            ? "En carrito"
            : "Agregar al carrito"
        }
      </button>
    `;
    lista.appendChild(card);
  });
}

function agregarAlCarrito(index) {
  const mascota = mascotas[index];

  if (adoptados.some((a) => a.nombre === mascota.nombre && a.raza === mascota.raza)) {
    mostrarNotificacion("Esta mascota ya fue adoptada.", "error");
    return;
  }

  if (carrito.some((c) => c.nombre === mascota.nombre && c.raza === mascota.raza)) {
    mostrarNotificacion("La mascota ya está en el carrito.", "error");
    return;
  }

  carrito.push(mascota);
  localStorage.setItem("carritoAdopcion", JSON.stringify(carrito));
  mostrarNotificacion(`Agregaste a ${mascota.nombre} al carrito.`, "exito");
  renderMascotas();
}

renderMascotas();
