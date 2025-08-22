import { validarNombre, validarEdad, validarPeso } from "./validators.js";
import { guardarEnStorage, leerStorage } from "./storage.js";
import { mostrarToast } from "./notifications.js";

/**
 * Abre modal, valida, registra adoptante y mueve mascota a "solicitudes".
 * Devuelve Promise<boolean> que resuelve true si se inició el proceso de adopción.
 */
export function simularAdopcion(mascota) {
  return new Promise((resolve) => {
    Swal.fire({
      title: `Adopción de ${mascota.nombre}`,
      html: `
        <input type="text" id="adoptanteNombre" class="swal2-input" placeholder="Nombre y Apellido">
        <input type="tel" id="adoptanteTelefono" class="swal2-input" placeholder="Teléfono / WhatsApp">
        <input type="email" id="adoptanteEmail" class="swal2-input" placeholder="Email">
        <input type="text" id="adoptanteDireccion" class="swal2-input" placeholder="Dirección">
        <input type="text" id="adoptanteDni" class="swal2-input" placeholder="DNI">
        <textarea id="adoptanteMotivo" class="swal2-textarea" placeholder="¿Por qué querés adoptar?"></textarea>
      `,
      confirmButtonText: "Enviar Solicitud",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("adoptanteNombre").value.trim();
        const telefono = document
          .getElementById("adoptanteTelefono")
          .value.trim();
        const email = document.getElementById("adoptanteEmail").value.trim();
        const direccion = document
          .getElementById("adoptanteDireccion")
          .value.trim();
        const dni = document.getElementById("adoptanteDni").value.trim();
        const motivo = document.getElementById("adoptanteMotivo").value.trim();

        if (!nombre || !telefono || !email || !direccion || !dni || !motivo) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        return { nombre, telefono, email, direccion, dni, motivo };
      },
    }).then((result) => {
      if (!result.isConfirmed) return resolve(false);

      if (
        !validarNombre(mascota.nombre) ||
        !validarEdad(mascota.edad) ||
        !validarPeso(mascota.peso)
      ) {
        mostrarToast("Datos de la mascota inválidos", "error");
        return resolve(false);
      }

      let solicitudes = leerStorage("solicitudes", []) || [];
      const yaSolicitada = solicitudes.some((s) => s.id === mascota.id);
      if (yaSolicitada) {
        Swal.fire(
          "Ya registrada",
          `${mascota.nombre} ya tiene una solicitud activa.`,
          "info"
        );
        return resolve(false);
      }

      // 🔹 Ahora se guarda como Pendiente, no adoptada directamente
      const nuevaSolicitud = {
        ...mascota,
        estado: "Pendiente",
        adoptante: result.value,
      };
      solicitudes.push(nuevaSolicitud);
      guardarEnStorage("solicitudes", solicitudes);

      // Remover de disponiblesExtra si estaba allí
      let extras = leerStorage("disponiblesExtra", []) || [];
      extras = extras.filter((m) => m.id !== mascota.id);
      guardarEnStorage("disponiblesExtra", extras);

      Swal.fire(
        "Solicitud enviada",
        `${mascota.nombre} está en proceso de adopción 🐾`,
        "success"
      );
      resolve(true);
    });
  });
}

/**
 * Reactiva una mascota adoptada → vuelve a disponibles.
 */
export function reactivarMascota(mascotaId) {
  let solicitudes = leerStorage("solicitudes", []) || [];
  const mascota = solicitudes.find((m) => m.id == mascotaId);

  if (mascota) {
    // Eliminar de solicitudes
    solicitudes = solicitudes.filter((m) => m.id != mascotaId);
    guardarEnStorage("solicitudes", solicitudes);

    // Reactivar en disponiblesExtra, evitando duplicados
    let extras = leerStorage("disponiblesExtra", []) || [];
    const yaExiste = extras.some((m) => m.id == mascota.id);
    if (!yaExiste) {
      extras.push({ ...mascota, estado: "Disponible" });
      guardarEnStorage("disponiblesExtra", extras);
    }

    mostrarToast(`${mascota.nombre} fue reactivado y está disponible`, "info");
  }
}
