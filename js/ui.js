// ui.js
export function renderTarjetas(lista, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = "";
  lista.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="img-card" data-full="${item.imagen}">
      <h3>${item.nombre}</h3>
      <p>Raza: ${item.raza}</p>
      <p>Edad: ${item.edad} años</p>
      <p>Peso: ${item.peso} kg</p>
      ${item.observaciones ? `<p><em>${item.observaciones}</em></p>` : ""}
      ${item.sociable ? `<p>🐾 Sociable: ${item.sociable}</p>` : ""}
      ${item.cuidados ? `<p>⚕️ Cuidados: ${item.cuidados}</p>` : ""}
      <div class="acciones">
        <button class="btn-adoptar" data-id="${item.id}">Adoptar</button>
        <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(card);
  });

  // Ampliar imagen con SweetAlert2
  contenedor.querySelectorAll(".img-card").forEach(img => {
    img.addEventListener("click", () => {
      if (window.Swal) {
        Swal.fire({
          imageUrl: img.dataset.full,
          imageAlt: "Vista ampliada",
          showConfirmButton: false,
          showCloseButton: true,
          width: "600px"
        });
      }
    });
  });
}
