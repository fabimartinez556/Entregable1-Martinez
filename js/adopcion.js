// Lista base por si no hay mascotas guardadas
let mascotas = [
  {
    nombre: "Luna",
    tipo: "perro",
    tamaño: "mediano",
    edad: 2,
    raza: "Mestiza",
    descripcion: "Muy cariñosa, ideal para familias con niños. Le encanta jugar.",
  },
  {
    nombre: "Milo",
    tipo: "gato",
    tamaño: "pequeño",
    edad: 1,
    raza: "Siames",
    descripcion: "Tranquilo y curioso. Perfecto para departamentos pequeños.",
  },
  {
    nombre: "Rocky",
    tipo: "perro",
    tamaño: "grande",
    edad: 4,
    raza: "Labrador",
    descripcion: "Fiel compañero, enérgico y obediente. Necesita espacio para correr.",
  },
  {
    nombre: "Lola",
    tipo: "gato",
    tamaño: "mediano",
    edad: 3,
    raza: "Mestiza",
    descripcion: "Independiente, pero muy dulce con quienes conoce bien.",
  },
  {
    nombre: "Toby",
    tipo: "perro",
    tamaño: "pequeño",
    edad: 1,
    raza: "Caniche",
    descripcion: "Súper juguetón y sociable. Le encanta estar acompañado.",
  },
];

// Cargar desde localStorage
const guardadas = localStorage.getItem("mascotas");
if (guardadas) mascotas = JSON.parse(guardadas);

// Guardar en localStorage
function guardarMascotas() {
  localStorage.setItem("mascotas", JSON.stringify(mascotas));
}

// Validar texto no vacío
function pedirTexto(mensaje) {
  let input;
  do {
    input = prompt(mensaje)?.trim();
  } while (!input);
  return input;
}

// Solicitar preferencias del usuario
function solicitarPreferencias() {
  const tipo = pedirTexto("¿Qué tipo de mascota preferís adoptar? (perro/gato)").toLowerCase();
  const tamaño = pedirTexto("¿Qué tamaño preferís? (pequeño/mediano/grande)").toLowerCase();

  let edadMax;
  do {
    edadMax = parseInt(prompt("¿Cuál es la edad máxima que aceptarías? (en años)"));
  } while (isNaN(edadMax) || edadMax < 0);

  return { tipo, tamaño, edadMax };
}

// Filtrar mascotas disponibles
function filtrarMascotas({ tipo, tamaño, edadMax }) {
  return mascotas.filter(
    m => m.tipo === tipo && m.tamaño === tamaño && m.edad <= edadMax
  );
}

// Mostrar resultado al usuario
function mostrarResultado(mascotasFiltradas) {
  console.clear();
  console.log("---- RESULTADO DEL SIMULADOR ----");

  if (mascotasFiltradas.length === 0) {
    alert("No encontramos una mascota con esas características.");
    return;
  }

  alert("¡Tenemos mascotas para vos! Mirá la consola para ver las fichas.");

  mascotasFiltradas.forEach(m => {
    console.log(
      `🐾 Nombre: ${m.nombre}\nTipo: ${m.tipo}\nTamaño: ${m.tamaño}\nEdad: ${m.edad} años\nRaza: ${m.raza}\nDescripción: ${m.descripcion}\n------------------`
    );
  });

  if (confirm("¿Querés adoptar alguna de estas mascotas?")) {
    const nombreAdoptado = pedirTexto("Escribí el nombre de la mascota que querés adoptar:");
    eliminarMascota(nombreAdoptado);
  } else {
    alert("No hay problema, podés volver a intentarlo más tarde.");
  }
}

// Agregar nueva mascota
function agregarMascota() {
  const nombre = pedirTexto("Nombre de la mascota:");
  const tipo = pedirTexto("Tipo (perro/gato):").toLowerCase();
  const tamaño = pedirTexto("Tamaño (pequeño/mediano/grande):").toLowerCase();
  let edad;
  do {
    edad = parseInt(prompt("Edad (en años):"));
  } while (isNaN(edad) || edad < 0);

  const raza = pedirTexto("Raza:");
  const descripcion = pedirTexto("Descripción:");

  mascotas.push({ nombre, tipo, tamaño, edad, raza, descripcion });
  guardarMascotas();
  alert(`✅ Mascota ${nombre} agregada exitosamente.`);
  console.log("Mascota agregada:", mascotas[mascotas.length - 1]);
}

// Eliminar mascota por nombre
function eliminarMascota(nombre) {
  const index = mascotas.findIndex(m => m.nombre.toLowerCase() === nombre.toLowerCase());
  if (index !== -1) {
    const eliminada = mascotas.splice(index, 1);
    guardarMascotas();
    alert(`🎉 Adoptaste a ${eliminada[0].nombre}. Fue eliminada del sistema.`);
  } else {
    alert("⚠️ No se encontró una mascota con ese nombre.");
  }
}

// Resetear base de datos
function resetearMascotas() {
  localStorage.removeItem("mascotas");
  alert("🐾 Se reiniciaron los datos de mascotas.");
}

// Iniciar simulador
function iniciarSimulador() {
  if (confirm("¿Querés agregar una mascota nueva al sistema?")) agregarMascota();

  const preferencias = solicitarPreferencias();
  const resultados = filtrarMascotas(preferencias);
  mostrarResultado(resultados);
}

// Ejecutar
iniciarSimulador();
