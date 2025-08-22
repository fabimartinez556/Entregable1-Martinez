/**
 * Renderiza tarjetas de mascotas según tipo
 * @param {Array} lista - Lista de mascotas
 * @param {HTMLElement} contenedor - Contenedor donde se insertan las tarjetas
 * @param {Object} options - Opciones { tipo: "disponibles"|"agregadas"|"solicitudes" }
 */
export function renderTarjetas(lista, contenedor, options = {}) {
  if (typeof contenedor === "string") {
    contenedor = document.getElementById(contenedor);
  }
  if (!contenedor) return;
  contenedor.innerHTML = "";

  lista.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.transition = "all 0.3s ease";
    card.addEventListener(
      "mouseenter",
      () => (card.style.transform = "scale(1.03)")
    );
    card.addEventListener(
      "mouseleave",
      () => (card.style.transform = "scale(1)")
    );

    const imagenSrc = item.imagen || "img/placeholder.png";

    let acciones = "";

    if (options.tipo === "disponibles") {
      acciones += `<button class="btn-adoptar" data-id="${item.id}">Adoptar</button>`;
      acciones += `<button class="btn-eliminar" data-id="${item.id}">Eliminar</button>`;
    } else if (options.tipo === "agregadas") {
      acciones += `<button class="btn-eliminar" data-id="${item.id}">Eliminar</button>`;
    } else if (options.tipo === "solicitudes") {
      if (item.estado === "Pendiente") {
        acciones += `<button class="btn-confirmar" data-id="${item.id}">Confirmar adopción</button>`;
      } else if (item.estado === "Adoptada") {
        acciones += `<button class="btn-reactivar" data-id="${item.id}">Reactivar</button>`;
      }
      acciones += `<button class="btn-eliminar" data-id="${item.id}">Eliminar</button>`;
    }

    let adoptanteHTML = "";
    if (options.tipo === "solicitudes" && item.adoptante) {
      adoptanteHTML = `
      <div class="adoptante">
        <h4>Datos del adoptante</h4>
        <p><strong>👤 Nombre:</strong> ${item.adoptante.nombre || "-"}</p>
        <p><strong>📞 Teléfono:</strong> ${item.adoptante.telefono || "-"}</p>
        <p><strong>📧 Email:</strong> ${item.adoptante.email || "-"}</p>
        <p><strong>🏠 Dirección:</strong> ${item.adoptante.direccion || "-"}</p>
        <p><strong>🆔 DNI:</strong> ${item.adoptante.dni || "-"}</p>
        <p><strong>💬 Motivo:</strong> ${item.adoptante.motivo || "-"}</p>
      </div>`;
    }

    card.innerHTML = `
      <img src="${imagenSrc}" alt="${
      item.nombre
    }" class="img-card" data-full="${imagenSrc}">
      <h3>${item.nombre}</h3>
      <p>Raza: ${item.raza}</p>
      <p>Edad: ${item.edad} años</p>
      ${item.peso ? `<p>Peso: ${item.peso} kg</p>` : ""}
      ${item.observaciones ? `<p><em>${item.observaciones}</em></p>` : ""}
      ${item.sociable ? `<p>🐾 Sociable: ${item.sociable}</p>` : ""}
      ${item.cuidados ? `<p>⚕️ Cuidados: ${item.cuidados}</p>` : ""}
      ${
        item.estado
          ? `<p class="${
              item.estado === "Adoptada" ? "estado-adoptada" : ""
            }">Estado: ${item.estado}</p>`
          : ""
      }
      ${adoptanteHTML}
      <div class="acciones">${acciones}</div>
    `;

    contenedor.appendChild(card);
  });

  // Ampliar imagen con SweetAlert2
  contenedor.querySelectorAll(".img-card").forEach((img) => {
    img.addEventListener("click", () => {
      if (window.Swal) {
        Swal.fire({
          imageUrl: img.dataset.full,
          imageAlt: img.alt || "Imagen ampliada",
          showConfirmButton: false,
          showCloseButton: true,
          width: "600px",
        });
      }
    });
  });
}
