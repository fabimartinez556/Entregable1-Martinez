export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validarMascota(m) {
  const errores = [];
  if (!m.nombre || !m.raza || !m.tipo || !m.imagen) errores.push('Completa todos los campos obligatorios.');
  if (isNaN(m.edad) || m.edad < 0 || m.edad > 20) errores.push('Edad debe ser entre 0 y 20.');
  if (isNaN(m.peso) || m.peso < 0.5 || m.peso > 80) errores.push('Peso entre 0.5kg y 80kg.');
  if (m.salud === 'Requiere cuidados' && !m.cuidados) errores.push('Especifica los cuidados requeridos.');
  if (!isValidURL(m.imagen)) errores.push('La imagen debe ser una URL válida.');
  return errores;
}
