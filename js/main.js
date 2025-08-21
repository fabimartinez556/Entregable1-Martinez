// main.js
import { fetchDisponibles } from "./api.js";
import { renderTarjetas } from "./ui.js";
import { simularAdopcion, reactivarMascota } from "./workflow.js";
import { mostrarToast } from "./notifications.js";
import { leerStorage, guardarEnStorage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // ======= DISPONIBLES =======
  if (path.includes("disponibles.html")) {
    const contenedor = document.getElementById("listaDisponibles");

    async function cargarDisponibles() {
      let disponibles = await fetchDisponibles();
      const extras = leerStorage("disponiblesExtra", []) || [];
      const solicitudes = leerStorage("solicitudes", []) || [];

      // fusionar remotos + extras
      let todos = [...disponibles, ...extras];

      // ocultar los que ya están adoptados (por id)
      const idsAdoptados = new Set(solicitudes.map((s) => s.id));
      todos = todos.filter((m) => !idsAdoptados.has(m.id));

      renderTarjetas(todos, "listaDisponibles");
      return todos;
    }

    let cache = [];
    cargarDisponibles().then((data) => (cache = data));

    contenedor.addEventListener("click", async (e) => {
      const btn = e.target;
      if (btn.classList.contains("btn-adoptar")) {
        const id = Number(btn.dataset.id);
        const seleccionado = cache.find((d) => d.id === id);
        if (!seleccionado) return;

        // Confirmación antes del formulario
        const conf = await Swal.fire({
          title: "Confirmar adopción",
          text: `¿Querés iniciar adopción de ${seleccionado.nombre}?`,
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });
        if (!conf.isConfirmed) return;

        const ok = await simularAdopcion(seleccionado);
        if (ok) {
          cache = await cargarDisponibles(); // refresca la lista
        }
      }

      if (btn.classList.contains("btn-eliminar")) {
        const id = Number(btn.dataset.id);
        // Si la mascota estaba en extras, la removemos del storage
        let extras = leerStorage("disponiblesExtra", []) || [];
        const antes = extras.length;
        extras = extras.filter((m) => m.id !== id);
        guardarEnStorage("disponiblesExtra", extras);

        btn.closest(".card").remove();
        mostrarToast(
          antes !== extras.length
            ? "Mascota eliminada (local)"
            : "Mascota eliminada",
          "info"
        );
      }
    });
  }

  // ======= AGREGAR =======
  if (path.includes("agregar.html")) {
    const form = document.getElementById("formAgregar");
    const inputImagen = document.getElementById("imagen");
    const previewContainer = document.getElementById("previewContainer");
    const previewImagen = document.getElementById("previewImagen");
    const listaAgregadas = document.getElementById("listaAgregadas");

    function renderAgregadas() {
      const extras = leerStorage("disponiblesExtra", []) || [];
      if (!listaAgregadas) return;
      listaAgregadas.innerHTML = "";
      extras.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${item.imagen}" alt="${
          item.nombre
        }" class="img-card" data-full="${item.imagen}">
          <h3>${item.nombre}</h3>
          <p>Raza: ${item.raza}</p>
          <p>Edad: ${item.edad} años</p>
          <p>Peso: ${item.peso} kg</p>
          ${item.observaciones ? `<p><em>${item.observaciones}</em></p>` : ""}
          ${item.sociable ? `<p>🐾 Sociable: ${item.sociable}</p>` : ""}
          ${item.cuidados ? `<p>⚕️ Cuidados: ${item.cuidados}</p>` : ""}
          <div class="acciones">
            <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
          </div>
        `;
        listaAgregadas.appendChild(card);
      });

      // ampliar imagen
      listaAgregadas.querySelectorAll(".img-card").forEach((img) => {
        img.addEventListener("click", () => {
          Swal.fire({
            imageUrl: img.dataset.full,
            showConfirmButton: false,
            showCloseButton: true,
            width: "600px",
          });
        });
      });
    }
    renderAgregadas();

    // Preview
    inputImagen.addEventListener("input", () => {
      const url = inputImagen.value.trim();
      if (url) {
        previewImagen.src = url;
        previewContainer.style.display = "block";
      } else {
        previewContainer.style.display = "none";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nuevaMascota = {
        id: Date.now(),
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

      // Duplicado por misma imagen + mismas características base
      const existe = extras.some(
        (m) =>
          m.nombre.toLowerCase() === nuevaMascota.nombre.toLowerCase() &&
          m.raza.toLowerCase() === nuevaMascota.raza.toLowerCase() &&
          m.edad === nuevaMascota.edad &&
          m.peso === nuevaMascota.peso &&
          m.imagen === nuevaMascota.imagen
      );

      if (existe) {
        Swal.fire(
          "Duplicado",
          "Ya existe una mascota con esas características y foto.",
          "warning"
        );
        return;
      }

      extras.push(nuevaMascota);
      guardarEnStorage("disponiblesExtra", extras);

      Swal.fire(
        "Agregada",
        `La mascota ${nuevaMascota.nombre} fue añadida.`,
        "success"
      );
      form.reset();
      previewContainer.style.display = "none";
      renderAgregadas();
    });

    // Eliminar agregadas locales
    listaAgregadas.addEventListener("click", (e) => {
      const btn = e.target;
      if (btn.classList.contains("btn-eliminar")) {
        const id = Number(btn.dataset.id);
        let extras = leerStorage("disponiblesExtra", []) || [];
        extras = extras.filter((m) => m.id !== id);
        guardarEnStorage("disponiblesExtra", extras);
        btn.closest(".card").remove();
        mostrarToast("Mascota eliminada de agregadas", "info");
      }
    });
  }

  // ======= SOLICITUDES =======
  if (path.includes("solicitudes.html")) {
    const contenedor = document.getElementById("listaSolicitudes");

    function renderSolicitudes() {
      const solicitudes = leerStorage("solicitudes", []) || [];
      contenedor.innerHTML = "";
      solicitudes.forEach((s) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${s.imagen}" alt="${
          s.nombre
        }" class="img-card" data-full="${s.imagen}">
          <h3>${s.nombre}</h3>
          <p>Raza: ${s.raza}</p>
          <p>Edad: ${s.edad} años</p>
          <p class="${
            s.estado === "Adoptada" ? "estado-adoptada" : ""
          }">Estado: ${s.estado}</p>
          <div class="adoptante">
            <h4>Datos del adoptante</h4>
            <p><strong>👤 Nombre:</strong> ${s.adoptante?.nombre || "-"}</p>
            <p><strong>📞 Teléfono:</strong> ${s.adoptante?.telefono || "-"}</p>
            <p><strong>📧 Email:</strong> ${s.adoptante?.email || "-"}</p>
            <p><strong>🏠 Dirección:</strong> ${
              s.adoptante?.direccion || "-"
            }</p>
            <p><strong>🆔 DNI:</strong> ${s.adoptante?.dni || "-"}</p>
            <p><strong>💬 Motivo:</strong> ${s.adoptante?.motivo || "-"}</p>
          </div>
          <div class="acciones">
            <button class="btn-eliminar" data-id="${s.id}">Eliminar</button>
            ${
              s.estado === "Adoptada"
                ? `<button class="btn-reactivar" data-id="${s.id}">Reactivar</button>`
                : ""
            }
          </div>
        `;
        contenedor.appendChild(card);
      });

      // ampliar imagen
      contenedor.querySelectorAll(".img-card").forEach((img) => {
        img.addEventListener("click", () => {
          Swal.fire({
            imageUrl: img.dataset.full,
            showConfirmButton: false,
            showCloseButton: true,
            width: "600px",
          });
        });
      });
    }

    renderSolicitudes();

    contenedor.addEventListener("click", (e) => {
      const btn = e.target;
      const id = Number(btn.dataset.id);
      if (btn.classList.contains("btn-eliminar")) {
        let solicitudes = leerStorage("solicitudes", []) || [];
        solicitudes = solicitudes.filter((m) => m.id !== id);
        guardarEnStorage("solicitudes", solicitudes);
        btn.closest(".card").remove();
        mostrarToast("Solicitud eliminada", "info");
      }
      if (btn.classList.contains("btn-reactivar")) {
        reactivarMascota(id);
        renderSolicitudes();
      }
    });
  }
});
