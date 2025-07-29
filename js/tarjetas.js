import { elementos } from "./dom.js";
import { eliminarMascota, obtenerMascotas, actualizarMascota, obtenerAdoptados, guardarAdoptados } from "./storage.js";

export function crearTarjeta(mascota, index) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${mascota.imagen}" alt="${mascota.nombre}">
    <h3>${mascota.nombre} (${mascota.tipo})</h3>
    <p><strong>Edad:</strong> ${mascota.edad} años</p>
    <p><strong>Raza:</strong> ${mascota.raza}</p>
    <p><strong>Peso:</strong> ${mascota.peso} kg</p>
    <p><strong>Sociable:</strong> ${mascota.sociable}</p>
    <p><strong>Estado de salud:</strong> ${mascota.salud}</p>
    ${mascota.cuidados ? `<p><strong>Cuidados:</strong> ${mascota.cuidados}</p>` : ""}
    ${mascota.comentario ? `<p><strong>Comentario:</strong> ${mascota.comentario}</p>` : ""}
    <div class="acciones"></div>
  `;

  const acciones = div.querySelector(".acciones");

  const adoptados = obtenerAdoptados();
  const estaAdoptada = adoptados.some(
    (a) => a.nombre === mascota.nombre && a.raza === mascota.raza
  );

  if (estaAdoptada) {
    const btnRevertir = document.createElement("button");
    btnRevertir.className = "btn-revertir";
    btnRevertir.textContent = "Volver a poner en adopción";
    btnRevertir.addEventListener("click", () => {
      // Eliminar de adoptados
      const nuevosAdoptados = adoptados.filter(
        (a) => !(a.nombre === mascota.nombre && a.raza === mascota.raza)
      );
      guardarAdoptados(nuevosAdoptados);

      // Actualizar el array principal mascotas: marcar adoptada = false
      const mascotas = obtenerMascotas();
      const idx = mascotas.findIndex(
        (m) => m.nombre === mascota.nombre && m.raza === mascota.raza
      );
      if (idx !== -1) {
        mascotas[idx].adoptada = false;
        localStorage.setItem("mascotas", JSON.stringify(mascotas));
      }

      renderAgregadas();
    });
    acciones.appendChild(btnRevertir);
  } else {
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", () => {
      mostrarConfirmacionEliminar(div, acciones, index);
    });

    acciones.appendChild(btnEliminar);
  }

  return div;
}

function mostrarConfirmacionEliminar(div, acciones, index) {
  acciones.innerHTML = `
    <span>¿Confirmar?</span>
    <button class="btn-si">Sí</button>
    <button class="btn-no">Cancelar</button>
  `;

  acciones.querySelector(".btn-si").addEventListener("click", () => {
    div.classList.add("fade-out");
    setTimeout(() => {
      eliminarMascota(index);
      renderAgregadas();
    }, 400);
  });

  acciones.querySelector(".btn-no").addEventListener("click", () => {
    renderAgregadas();
  });
}

export function renderAgregadas() {
  const mascotas = obtenerMascotas() || [];
  elementos.listaAgregadas.innerHTML = "";

  if (mascotas.length === 0) {
    elementos.listaAgregadas.innerHTML = "<p>No hay mascotas agregadas aún.</p>";
    return;
  }

  mascotas.forEach((mascota, index) => {
    elementos.listaAgregadas.appendChild(crearTarjeta(mascota, index));
  });
}
