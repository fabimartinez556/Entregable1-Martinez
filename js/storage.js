// storage.js
export function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
export function leerStorage(clave, porDefecto = null) {
  const txt = localStorage.getItem(clave);
  if (!txt) return porDefecto;
  try { return JSON.parse(txt); } catch { return porDefecto; }
}
