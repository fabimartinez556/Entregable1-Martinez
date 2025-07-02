// Lista base ampliada por si no hay mascotas guardadas
let mascotas = [
  { nombre: "Luna", tipo: "perro", tamaño: "mediano", edad: 2, raza: "Mestiza", descripcion: "Muy cariñosa, ideal para familias con niños. Le encanta jugar." },
  { nombre: "Milo", tipo: "gato", tamaño: "pequeño", edad: 1, raza: "Siames", descripcion: "Tranquilo y curioso. Perfecto para departamentos pequeños." },
  { nombre: "Rocky", tipo: "perro", tamaño: "grande", edad: 4, raza: "Labrador", descripcion: "Fiel compañero, enérgico y obediente. Necesita espacio para correr." },
  { nombre: "Lola", tipo: "gato", tamaño: "mediano", edad: 3, raza: "Mestiza", descripcion: "Independiente, pero muy dulce con quienes conoce bien." },
  { nombre: "Toby", tipo: "perro", tamaño: "pequeño", edad: 1, raza: "Caniche", descripcion: "Súper juguetón y sociable. Le encanta estar acompañado." },
  { nombre: "Nina", tipo: "gato", tamaño: "pequeño", edad: 5, raza: "Persa", descripcion: "Muy tranquila y cariñosa, ideal para hogares tranquilos." },
  { nombre: "Max", tipo: "perro", tamaño: "grande", edad: 6, raza: "Pastor Alemán", descripcion: "Protector y leal, necesita entrenamiento constante." },
  { nombre: "Simba", tipo: "gato", tamaño: "mediano", edad: 2, raza: "Bengalí", descripcion: "Activo y juguetón, con mucho carácter." },
  { nombre: "Bella", tipo: "perro", tamaño: "mediano", edad: 3, raza: "Bulldog", descripcion: "Calma y dulce, perfecta para departamentos." },
  { nombre: "Coco", tipo: "gato", tamaño: "pequeño", edad: 4, raza: "Mestizo", descripcion: "Amigable y curioso, le encanta explorar." },
];

// Cargar desde localStorage (si existe)
const guardadas = localStorage.getItem("mascotas");
if (guardadas) {
  try {
    mascotas = JSON.parse(guardadas);
  } catch {
    console.warn("Error al parsear mascotas guardadas, se usará la lista base.");
  }
}

// Guardar en localStorage
function guardarMascotas() {
  localStorage.setItem("mascotas", JSON.stringify(mascotas));
}

// Función para pedir texto con control de cancelación y validación simple
function pedirTexto(mensaje, opcionesValidas = null) {
  while (true) {
    let input = prompt(mensaje);
    if (input === null) {
      cancelarSimulador();
      return null;
    }
    input = input.trim().toLowerCase();
    if (!input) continue;

    if (opcionesValidas && !opcionesValidas.includes(input)) {
      alert(`Por favor, ingresa una opción válida: ${opcionesValidas.join(", ")}`);
      continue;
    }

    return input;
  }
}

// Mostrar u ocultar aviso para abrir consola
function mostrarAvisoConsola(mostrar) {
  const aviso = document.getElementById("abrirConsola");
  if (!aviso) return;
  aviso.style.display = mostrar ? "block" : "none";
}

// Función para solicitar las preferencias del usuario con validaciones
function solicitarPreferencias() {
  const tipo = pedirTexto("¿Qué tipo de mascota preferís adoptar? (perro/gato)", ["perro", "gato"]);
  if (!tipo) return null;

  const tamaño = pedirTexto("¿Qué tamaño preferís? (pequeño/mediano/grande)", ["pequeño", "mediano", "grande"]);
  if (!tamaño) return null;

  let edadMax;
  while (true) {
    const entrada = prompt("¿Cuál es la edad máxima que aceptarías? (en años)");
    if (entrada === null) {
      cancelarSimulador();
      return null;
    }
    edadMax = parseInt(entrada);
    if (!isNaN(edadMax) && edadMax >= 0) break;
    alert("Por favor, ingresa un número válido para la edad.");
  }

  return { tipo, tamaño, edadMax };
}

// Función que filtra mascotas según preferencias
function filtrarMascotas({ tipo, tamaño, edadMax }) {
  return mascotas.filter(
    (m) => m.tipo === tipo && m.tamaño === tamaño && m.edad <= edadMax
  );
}

// Mostrar resultado en consola y pedir si quiere adoptar
function mostrarResultado(mascotasFiltradas) {
  console.clear();
  console.log("---- RESULTADO DEL SIMULADOR ----");

  if (mascotasFiltradas.length === 0) {
    alert("No encontramos una mascota con esas características.");
    mostrarAvisoConsola(false);
    return;
  }

  alert("¡Tenemos mascotas para vos! Mirá la consola para ver las fichas.");

  mascotasFiltradas.forEach((m, i) => {
    console.log(
      `🐾 Mascota #${i + 1}:\n` +
      `Nombre: ${m.nombre}\n` +
      `Tipo: ${m.tipo}\n` +
      `Tamaño: ${m.tamaño}\n` +
      `Edad: ${m.edad} años\n` +
      `Raza: ${m.raza}\n` +
      `Descripción: ${m.descripcion}\n` +
      `------------------------------`
    );
  });

  mostrarAvisoConsola(false);

  if (confirm("¿Querés adoptar alguna de estas mascotas?")) {
    const nombreAdoptado = pedirTexto("Escribí el nombre de la mascota que querés adoptar:");
    if (nombreAdoptado) eliminarMascota(nombreAdoptado);
  } else {
    alert("No hay problema, podés volver a intentarlo más tarde.");
  }
}

// Listar todas las mascotas
function listarMascotas() {
  console.clear();
  if (mascotas.length === 0) {
    alert("No hay mascotas en el sistema.");
    return;
  }
  console.log("---- LISTADO COMPLETO DE MASCOTAS ----");
  mascotas.forEach((m, i) => {
    console.log(
      `🐾 Mascota #${i + 1}:\n` +
      `Nombre: ${m.nombre}\n` +
      `Tipo: ${m.tipo}\n` +
      `Tamaño: ${m.tamaño}\n` +
      `Edad: ${m.edad} años\n` +
      `Raza: ${m.raza}\n` +
      `Descripción: ${m.descripcion}\n` +
      `-----------------------------`
    );
  });
  mostrarAvisoConsola(true); // Muestra aviso para abrir consola si lo tenés
}

// Agregar nueva mascota al sistema
function agregarMascota() {
  const nombre = pedirTexto("Nombre de la mascota:");
  if (!nombre) return;

  const tipo = pedirTexto("Tipo (perro/gato):", ["perro", "gato"]);
  if (!tipo) return;

  const tamaño = pedirTexto("Tamaño (pequeño/mediano/grande):", ["pequeño", "mediano", "grande"]);
  if (!tamaño) return;

  let edad;
  while (true) {
    const entrada = prompt("Edad (en años):");
    if (entrada === null) {
      cancelarSimulador();
      return;
    }
    edad = parseInt(entrada);
    if (!isNaN(edad) && edad >= 0) break;
    alert("Por favor, ingresa una edad válida.");
  }

  const raza = pedirTexto("Raza:");
  if (!raza) return;

  const descripcion = pedirTexto("Descripción:");
  if (!descripcion) return;

  mascotas.push({ nombre, tipo, tamaño, edad, raza, descripcion });
  guardarMascotas();
  alert(`✅ Mascota ${nombre} agregada exitosamente.`);
  console.log("Mascota agregada:", mascotas[mascotas.length - 1]);
}

// Eliminar mascota por nombre (insensible a mayúsculas/minúsculas)
function eliminarMascota(nombre) {
  const index = mascotas.findIndex(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (index !== -1) {
    const eliminada = mascotas.splice(index, 1);
    guardarMascotas();
    alert(`🎉 Adoptaste a ${eliminada[0].nombre}. Fue eliminada del sistema.`);
  } else {
    alert("⚠️ No se encontró una mascota con ese nombre.");
  }
}

// Listar todas las mascotas (útil para depuración o mostrar todo)
function listarMascotas() {
  console.clear();
  console.log("---- LISTA DE MASCOTAS ----");
  mascotas.forEach((m, i) => {
    console.log(
      `#${i + 1}: ${m.nombre} (${m.tipo}, ${m.tamaño}, ${m.edad} años) - ${m.raza}`
    );
  });
  mostrarAvisoConsola(false);
}

// Resetear base de datos de mascotas (borrar localStorage)
function resetearMascotas() {
  localStorage.removeItem("mascotas");
  alert("🐾 Se reiniciaron los datos de mascotas a la lista base.");
  mascotas = [...mascotasBase]; // O recargar la página para resetear
}

// Iniciar simulador principal
function iniciarSimulador() {
  mostrarAvisoConsola(true);

  if (confirm("¿Querés agregar una mascota nueva al sistema?")) {
    agregarMascota();
  }

  const preferencias = solicitarPreferencias();
  if (!preferencias) return;

  const resultados = filtrarMascotas(preferencias);
  mostrarResultado(resultados);
}

// Cancelar simulador y volver a inicio
function cancelarSimulador() {
  alert("Simulación cancelada. Volviendo al inicio...");
  window.location.href = "index.html";
}
