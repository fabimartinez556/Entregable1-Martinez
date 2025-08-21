// validators.js
export function validarNombre(nombre) {
  return typeof nombre === "string" && nombre.trim().length >= 2;
}
export function validarEdad(edad) {
  return Number.isFinite(edad) && edad >= 0 && edad <= 20;
}
export function validarPeso(peso) {
  return Number.isFinite(peso) && peso >= 0.5 && peso <= 80;
}
