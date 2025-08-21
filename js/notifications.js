// notifications.js
export function mostrarToast(titulo, icono = "info") {
  if (!window.Swal) return;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true
  });
  Toast.fire({ icon: icono, title: titulo });
}
