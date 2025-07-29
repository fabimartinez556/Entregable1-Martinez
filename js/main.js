import { elementos } from './dom.js';
import { guardarMascota } from './storage.js';
import { validarMascota } from './validaciones.js';
import { renderAgregadas } from './tarjetas.js';

function toggleOtroTipo() {
  const mostrar = elementos.tipo.value === 'Otro';
  elementos.otroTipo.style.display = mostrar ? 'block' : 'none';
  if (mostrar) elementos.otroTipo.focus();
  else elementos.otroTipo.value = '';
}

function toggleCuidados() {
  const mostrar = elementos.salud.value === 'Requiere cuidados';
  elementos.cuidados.style.display = mostrar ? 'block' : 'none';
  if (mostrar) elementos.cuidados.focus();
  else elementos.cuidados.value = '';
}

function manejarSubmit(e) {
  e.preventDefault();

  let tipo = elementos.tipo.value;
  if (tipo === 'Otro') tipo = elementos.otroTipo.value.trim();

  const mascota = {
    nombre: elementos.nombre.value.trim(),
    raza: elementos.raza.value.trim(),
    edad: parseInt(elementos.edad.value),
    peso: parseFloat(elementos.peso.value),
    tipo,
    sociable: elementos.sociable.value,
    salud: elementos.salud.value,
    comentario: elementos.comentario.value.trim(),
    imagen: elementos.imagen.value.trim(),
    cuidados: elementos.salud.value === 'Requiere cuidados' ? elementos.cuidados.value.trim() : ''
  };

  const errores = validarMascota(mascota);
  if (errores.length > 0) {
    mostrarToast(errores.join('\n'), 'error');
    return;
  }

  guardarMascota(mascota);
  elementos.form.reset();
  toggleOtroTipo();
  toggleCuidados();
  renderAgregadas();
  mostrarToast("¡Mascota agregada correctamente!", "exito");
}


// Toast reutilizable

function mostrarToast(mensaje, tipo = 'exito') {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.className = `toast-mensaje ${tipo}`;
  toast.classList.remove('oculto');

  setTimeout(() => {
    toast.classList.add('oculto');
  }, 3000);
}

// Inicialización
elementos.tipo.addEventListener('change', toggleOtroTipo);
elementos.salud.addEventListener('change', toggleCuidados);
elementos.form.addEventListener('submit', manejarSubmit);
renderAgregadas();
