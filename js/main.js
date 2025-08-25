import { fetchDisponibles } from "./api.js";
import { simularAdopcion } from "./workflow.js";
import { mostrarToast } from "./notifications.js";
import { leerStorage, guardarEnStorage } from "./storage.js";
import { renderTarjetas } from "./ui.js";

let cacheDisponibles = [];

// ========================== DISPONIBLES ==========================
export async function cargarDisponibles() {
  const contenedor = document.getElementById("listaDisponibles");
  if (!contenedor) return;

  let disponibles = await fetchDisponibles();
  const extras = leerStorage("disponiblesExtra", []) || [];
  const solicitudes = leerStorage("solicitudes", []) || [];

  // Combinar y normalizar
  const todos = [...disponibles, ...extras].map((m) => {
    const solicitud = solicitudes.find((s) => s.id === m.id);
    if (solicitud) {
      m.estado = solicitud.estado === "Pendiente" ? "Pendiente" : "Adoptada";
    } else if (!m.estado) {
      m.estado = "Disponible";
    }
    return m;
  });

  // Evitar duplicados
  const map = new Map();
  todos.forEach((m) => map.set(m.id, m));
  cacheDisponibles = Array.from(map.values());

  // Renderizar tarjetas
  contenedor.innerHTML = "";
  cacheDisponibles.forEach((item) => {
    const card = crearCardDisponible(item);
    contenedor.appendChild(card);
  });

  contenedor.addEventListener("click", manejarClickDisponible);
}

function crearCardDisponible(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = item.id;

  let botonAdoptar = "";
  if (item.estado === "Disponible")
    botonAdoptar = `<button class="btn-adoptar" data-id="${item.id}">Adoptar</button>`;
  else
    botonAdoptar = `<button class="btn-adoptar" disabled>${item.estado}</button>`;

  const botonEliminar =
    item.id > 100000 && item.estado === "Disponible"
      ? `<button class="btn-eliminar" data-id="${item.id}">Eliminar</button>`
      : "";

  card.innerHTML = `
    <img src="${item.imagen}" alt="${
    item.nombre
  }" class="img-card" data-full="${item.imagen}">
    <h3>${item.nombre}</h3>
    <p>Raza: ${item.raza}</p>
    <p>Edad: ${item.edad} años</p>
    ${item.peso ? `<p>Peso: ${item.peso} kg</p>` : ""}
    ${item.observaciones ? `<p><em>${item.observaciones}</em></p>` : ""}
    ${item.sociable ? `<p>🐾 Sociable: ${item.sociable}</p>` : ""}
    ${item.cuidados ? `<p>⚕️ Cuidados: ${item.cuidados}</p>` : ""}
    <p class="${item.estado === "Adoptada" ? "estado-adoptada" : ""}">Estado: ${
    item.estado
  }</p>
    <div class="acciones">
      ${botonAdoptar}
      ${botonEliminar}
    </div>
  `;

  // Ampliar imagen
  const img = card.querySelector(".img-card");
  img.addEventListener("click", () => {
    Swal.fire({
      imageUrl: img.dataset.full,
      showConfirmButton: false,
      showCloseButton: true,
      width: 600,
    });
  });

  return card;
}

async function manejarClickDisponible(e) {
  const btn = e.target;
  const id = Number(btn.dataset.id);
  if (!id) return;

  const contenedor = document.getElementById("listaDisponibles");
  const mascotaIndex = cacheDisponibles.findIndex((m) => m.id === id);
  if (mascotaIndex === -1) return;
  const mascota = cacheDisponibles[mascotaIndex];

  if (
    btn.classList.contains("btn-adoptar") &&
    mascota.estado === "Disponible"
  ) {
    actualizarEstadoDisponible(mascota.id, "Pendiente confirmacion");

    simularAdopcion(mascota).then((ok) => {
      if (!ok) {
        actualizarEstadoDisponible(mascota.id, "Disponible");
        mostrarToast("No se pudo completar la adopción", "error");
      } else {
        actualizarContadorAdoptadas();
      }
    });
  }

  if (btn.classList.contains("btn-eliminar")) {
    let extras = leerStorage("disponiblesExtra", []) || [];
    extras = extras.filter((m) => m.id !== id);
    guardarEnStorage("disponiblesExtra", extras);
    mostrarToast("Mascota eliminada (local)", "info");

    const card = contenedor.querySelector(`.card[data-id="${id}"]`);
    if (card) card.remove();
  }
}

// ========================== AGREGAR ==========================
export function initAgregar() {
  const form = document.getElementById("formAgregar");
  const inputImagen = document.getElementById("imagen");
  const previewContainer = document.getElementById("previewContainer");
  const previewImagen = document.getElementById("previewImagen");
  const listaAgregadas = document.getElementById("listaAgregadas");
  if (!form || !listaAgregadas) return;

  function renderAgregadas() {
    const extras = leerStorage("disponiblesExtra", []) || [];
    renderTarjetas(extras, "listaAgregadas");
  }
  renderAgregadas();

  inputImagen.addEventListener("input", () => {
    const url = inputImagen.value.trim();
    if (url) {
      previewImagen.src = url;
      previewContainer.style.display = "block";
    } else previewContainer.style.display = "none";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevaMascota = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nombre: document.getElementById("nombre").value.trim(),
      raza: document.getElementById("raza").value.trim(),
      edad: Number(document.getElementById("edad").value),
      peso: Number(document.getElementById("peso").value),
      observaciones: document.getElementById("observaciones").value.trim(),
      sociable: document.getElementById("sociable").value,
      cuidados: document.getElementById("cuidados").value.trim(),
      imagen: inputImagen.value.trim(),
      estado: "Disponible",
    };

    let extras = leerStorage("disponiblesExtra", []) || [];
    extras.push(nuevaMascota);
    guardarEnStorage("disponiblesExtra", extras);
    mostrarToast(`La mascota ${nuevaMascota.nombre} fue agregada`, "success");
    form.reset();
    previewContainer.style.display = "none";
    renderAgregadas();

    const contenedor = document.getElementById("listaDisponibles");
    const card = crearCardDisponible(nuevaMascota);
    contenedor.appendChild(card);
    cacheDisponibles.push(nuevaMascota);
  });
}

// ========================== SOLICITUDES ==========================
export function cargarSolicitudes() {
  const contenedor = document.getElementById("listaSolicitudes");
  if (!contenedor) return;

  const solicitudes = leerStorage("solicitudes", []) || [];
  contenedor.innerHTML = "";

  solicitudes.forEach((s) => {
    const card = crearCardSolicitud(s);
    contenedor.appendChild(card);
  });

  contenedor.addEventListener("click", manejarClickSolicitud);
}

function crearCardSolicitud(s) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = s.id;

  let adoptanteHTML = s.adoptante
    ? `<div class="adoptante">
        <h4>Datos del adoptante</h4>
        <p><strong>👤 Nombre:</strong> ${s.adoptante.nombre}</p>
        <p><strong>📞 Teléfono:</strong> ${s.adoptante.telefono}</p>
        <p><strong>📧 Email:</strong> ${s.adoptante.email}</p>
        <p><strong>🏠 Dirección:</strong> ${s.adoptante.direccion}</p>
        <p><strong>🆔 DNI:</strong> ${s.adoptante.dni}</p>
        <p><strong>💬 Motivo:</strong> ${s.adoptante.motivo}</p>
      </div>`
    : "";

  let accionesHTML = "";
  if (s.estado === "Pendiente")
    accionesHTML = `<button class="btn-adoptar" data-id="${s.id}">Aceptar</button>
                    <button class="btn-eliminar" data-id="${s.id}">Cancelar</button>`;
  else if (s.estado === "Adoptada")
    accionesHTML = `<button class="btn-reactivar" data-id="${s.id}">Reactivar</button>`;

  card.innerHTML = `
    <img src="${s.imagen}" alt="${s.nombre}" class="img-card" data-full="${
    s.imagen
  }">
    <h3>${s.nombre}</h3>
    <p>Raza: ${s.raza}</p>
    <p>Edad: ${s.edad} años</p>
    ${s.peso ? `<p>Peso: ${s.peso} kg</p>` : ""}
    ${s.observaciones ? `<p><em>${s.observaciones}</em></p>` : ""}
    ${s.sociable ? `<p>🐾 Sociable: ${s.sociable}</p>` : ""}
    ${s.cuidados ? `<p>⚕️ Cuidados: ${s.cuidados}</p>` : ""}
    <p class="${s.estado === "Adoptada" ? "estado-adoptada" : ""}">Estado: ${
    s.estado
  }</p>
    ${adoptanteHTML}
    <div class="acciones">
      ${accionesHTML}
    </div>
  `;

  const img = card.querySelector(".img-card");
  img.addEventListener("click", () => {
    Swal.fire({
      imageUrl: img.dataset.full,
      showConfirmButton: false,
      showCloseButton: true,
      width: 600,
    });
  });

  return card;
}

function manejarClickSolicitud(e) {
  const btn = e.target;
  const id = Number(btn.dataset.id);
  if (!id) return;

  let solicitudes = leerStorage("solicitudes", []) || [];
  const index = solicitudes.findIndex((s) => s.id === id);
  if (index === -1) return;
  const mascota = solicitudes[index];

  // Aceptar
  if (btn.classList.contains("btn-adoptar")) {
    solicitudes[index].estado = "Adoptada";
    guardarEnStorage("solicitudes", solicitudes);
    actualizarEstadoDisponible(mascota.id, "Adoptada");

    const card = btn.closest(".card");
    if (card)
      card.querySelector(
        ".acciones"
      ).innerHTML = `<button class="btn-reactivar" data-id="${id}">Reactivar</button>`;

    mostrarToast(`${mascota.nombre} fue adoptada`, "success");
    actualizarContadorAdoptadas();
    return;
  }

  // Cancelar
  if (btn.classList.contains("btn-eliminar")) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Cancelar la solicitud de ${mascota.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        solicitudes.splice(index, 1);
        guardarEnStorage("solicitudes", solicitudes);

        let extras = leerStorage("disponiblesExtra", []) || [];
        if (!extras.some((m) => m.id === mascota.id))
          extras.push({ ...mascota, estado: "Disponible" });
        guardarEnStorage("disponiblesExtra", extras);

        actualizarEstadoDisponible(mascota.id, "Disponible");
        mostrarToast(`${mascota.nombre} volvió a estar disponible`, "info");

        const card = btn.closest(".card");
        if (card) card.remove();
      }
    });
    return;
  }

  // Reactivar
  if (btn.classList.contains("btn-reactivar")) {
    Swal.fire({
      title: "¿Reactivar mascota?",
      text: `Si confirmás, ${mascota.nombre} volverá a estar disponible`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reactivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        solicitudes.splice(index, 1);
        guardarEnStorage("solicitudes", solicitudes);

        actualizarEstadoDisponible(mascota.id, "Disponible");

        let extras = leerStorage("disponiblesExtra", []) || [];
        if (!extras.some((m) => m.id === mascota.id))
          extras.push({ ...mascota, estado: "Disponible" });
        guardarEnStorage("disponiblesExtra", extras);

        mostrarToast(
          `${mascota.nombre} fue reactivada y está disponible`,
          "success"
        );

        const card = btn.closest(".card");
        if (card) card.remove();
      }
    });
  }
}

// ========================== UTIL ==========================
function actualizarEstadoDisponible(id, estado) {
  cacheDisponibles = cacheDisponibles.map((m) =>
    m.id === id ? { ...m, estado } : m
  );
  const card = document.querySelector(
    `#listaDisponibles .card[data-id="${id}"]`
  );
  if (!card) return;

  const botonAdoptar = card.querySelector(".btn-adoptar");
  if (botonAdoptar) {
    botonAdoptar.textContent = estado === "Disponible" ? "Adoptar" : estado;
    botonAdoptar.disabled = estado !== "Disponible";
  }

  const botonEliminar = card.querySelector(".btn-eliminar");
  if (botonEliminar)
    botonEliminar.style.display =
      estado === "Disponible" ? "inline-block" : "none";
}

// ========================== CONTADOR ADOPTADAS ==========================
function actualizarContadorAdoptadas() {
  const numSpan = document.getElementById("numAdoptadas");
  if (!numSpan) return;

  const solicitudes = leerStorage("solicitudes", []) || [];
  const adoptadas = solicitudes.filter((s) => s.estado === "Adoptada").length;

  // Si no hay adoptadas, mostrar 0 y salir
  if (adoptadas === 0) {
    numSpan.textContent = "0";
    return;
  }

  let current = 0;
  const duracionTotal = 4000;
  const intervalTime = duracionTotal / adoptadas;

  const contador = setInterval(() => {
    current++;
    numSpan.textContent = current;
    numSpan.classList.add("latido");

    setTimeout(() => {
      numSpan.classList.remove("latido");
    }, 200);

    if (current >= adoptadas) {
      clearInterval(contador);
      numSpan.classList.add("destacado");
      setTimeout(() => numSpan.classList.remove("destacado"), 2500);
      lanzarConfeti();
    }
  }, intervalTime);
}

function lanzarConfeti() {
  const confetiContainer = document.createElement("div");
  confetiContainer.className = "confeti";

  for (let i = 0; i < 30; i++) {
    const span = document.createElement("span");

    // Posición horizontal aleatoria dentro del viewport
    span.style.left = Math.random() * window.innerWidth + "px";

    // Duración aleatoria entre 4s y 10s
    const duracion = (4 + Math.random() * 6).toFixed(2) + "s";
    span.style.setProperty("--duracion", duracion);

    // Delay aleatorio hasta 2s
    const delay = (Math.random() * 2).toFixed(2) + "s";
    span.style.setProperty("--delay", delay);

    confetiContainer.appendChild(span);

    // Borrar cada confeti al terminar animación
    span.addEventListener("animationend", () => span.remove());
  }

  document.body.appendChild(confetiContainer);

  // Eliminar contenedor completo un poco después
  setTimeout(() => confetiContainer.remove(), 12000);
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorAdoptadas();
});

// ========================== DOM READY ==========================
document.addEventListener("DOMContentLoaded", () => {
  cargarDisponibles();
  cargarSolicitudes();
  initAgregar();
  actualizarContadorAdoptadas();
});
