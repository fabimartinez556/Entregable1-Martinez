const contenedorSolicitudes = document.getElementById("solicitudes");
let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
let solicitudes = JSON.parse(localStorage.getItem("solicitudesAdopcion")) || [];
let adoptados = JSON.parse(localStorage.getItem("adoptados")) || [];

// Contenedor para notificaciones (reutilizando el toast del CSS)
let contenedorNotificaciones = document.getElementById("notificaciones");
if (!contenedorNotificaciones) {
  contenedorNotificaciones = document.createElement("div");
  contenedorNotificaciones.id = "notificaciones";
  document.body.appendChild(contenedorNotificaciones);
}

function mostrarNotificacion(mensaje, tipo = "exito", duracion = 3000) {
  const notif = document.createElement("div");
  notif.textContent = mensaje;
  notif.className = `toast-mensaje ${tipo}`;
  contenedorNotificaciones.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(100%)";
  }, duracion - 500);

  setTimeout(() => {
    if (contenedorNotificaciones.contains(notif)) {
      contenedorNotificaciones.removeChild(notif);
    }
  }, duracion);
}

function renderSolicitudes() {
  solicitudes = JSON.parse(localStorage.getItem("solicitudesAdopcion")) || [];
  adoptados = JSON.parse(localStorage.getItem("adoptados")) || [];

  contenedorSolicitudes.innerHTML = "";

  if (solicitudes.length === 0) {
    contenedorSolicitudes.innerHTML = "<p>No hay mascotas en solicitudes.</p>";
    return;
  }

  solicitudes.forEach((mascota, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${mascota.imagen}" alt="${mascota.nombre}">
      <h3>${mascota.nombre} (${mascota.tipo})</h3>
      <p><strong>Edad:</strong> ${mascota.edad} años</p>
      <p><strong>Raza:</strong> ${mascota.raza}</p>
      <p><strong>Peso:</strong> ${mascota.peso} kg</p>
      <p><strong>Sociable:</strong> ${mascota.sociable}</p>
      <p><strong>Estado de salud:</strong> ${mascota.salud}</p>
      ${
        mascota.cuidados
          ? `<p><strong>Cuidados:</strong> ${mascota.cuidados}</p>`
          : ""
      }
      ${
        mascota.comentario
          ? `<p><strong>Comentario:</strong> ${mascota.comentario}</p>`
          : ""
      }
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    contenedorSolicitudes.appendChild(card);
  });

  // 🔧 Botón adoptar en contenedor con clase
  const contenedorBoton = document.createElement("div");
  contenedorBoton.className = "contenedor-boton";

  const btnAdoptar = document.createElement("button");
  btnAdoptar.textContent = "Adoptar";
  btnAdoptar.className = "btn-adoptar";

  contenedorBoton.appendChild(btnAdoptar);
  contenedorSolicitudes.appendChild(contenedorBoton);

  // Eventos eliminar
  contenedorSolicitudes.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      eliminarDeSolicitudes(idx);
    });
  });

  btnAdoptar.addEventListener("click", adoptar);
}

function eliminarDeSolicitudes(index) {
  const mascotaEliminada = solicitudes[index];

  // 1. Eliminar de solicitudes
  solicitudes.splice(index, 1);
  localStorage.setItem("solicitudesAdopcion", JSON.stringify(solicitudes));

  // 2. Volver a marcar como no adoptada en el array global de mascotas
  const idxMascota = mascotas.findIndex(
    (m) =>
      m.nombre === mascotaEliminada.nombre && m.raza === mascotaEliminada.raza
  );
  if (idxMascota !== -1) {
    mascotas[idxMascota].adoptada = false;
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
  }

  // 3. Notificación y render
  mostrarNotificacion(
    "Mascota eliminada del carrito y disponible nuevamente",
    "error"
  );
  renderSolicitudes();

  // 4. Si querés que se actualice en pantalla automáticamente en "disponibles"
  if (typeof renderMascotasDisponibles === "function") {
    renderMascotasDisponibles(); // Solo si está en el mismo JS
  }
}

function adoptar() {
  if (solicitudes.length === 0) {
    mostrarNotificacion("No hay mascotas para adoptar", "error");
    return;
  }

  const modal = document.getElementById("modalConfirmacion");
  const btnConfirmar = document.getElementById("confirmarAdopcion");
  const btnCancelar = document.getElementById("cancelarAdopcion");

  modal.classList.remove("oculto");

  btnConfirmar.onclick = () => {
    solicitudes.forEach((solicitada) => {
      if (
        !adoptados.some(
          (a) => a.nombre === solicitada.nombre && a.raza === solicitada.raza
        )
      ) {
        adoptados.push(solicitada);
      }
      const idx = mascotas.findIndex(
        (m) => m.nombre === solicitada.nombre && m.raza === solicitada.raza
      );
      if (idx !== -1) {
        mascotas[idx].adoptada = true;
      }
    });

    localStorage.setItem("adoptados", JSON.stringify(adoptados));
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    solicitudes = [];
    localStorage.setItem("solicitudesAdopcion", JSON.stringify(solicitudes));

    modal.classList.add("oculto");
    mostrarNotificacion(
      "¡Felicidades! 🐾 Has adoptado con éxito ❤️",
      "exito",
      5000
    );
    renderSolicitudes();
  };

  btnCancelar.onclick = () => {
    modal.classList.add("oculto");
  };
}

// Inicializar la primera renderización
renderSolicitudes();
