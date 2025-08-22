/**
 * Guarda un valor en localStorage (serializado a JSON).
 * @param {string} clave
 * @param {any} valor
 */
export function guardarEnStorage(clave, valor) {
  try {
    if (valor === undefined) return;
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    console.error("Error guardando en storage:", e);
  }
}

/**
 * Lee un valor de localStorage (parseado desde JSON).
 * @param {string} clave
 * @param {any} porDefecto Valor que se retorna si no existe o hay error
 * @returns {any}
 */
export function leerStorage(clave, porDefecto = null) {
  try {
    const txt = localStorage.getItem(clave);
    if (!txt) return porDefecto;
    return JSON.parse(txt);
  } catch (e) {
    console.warn("Error leyendo storage:", e);
    return porDefecto;
  }
}
