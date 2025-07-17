// Lista base si no hay mascotas guardadas
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

const mascotasBase = [...mascotas];

// Cargar desde localStorage
const guardadas = localStorage.getItem("mascotas");
if (guardadas) {
  try {
    mascotas = JSON.parse(guardadas);
  } catch {
    console.warn("Error al parsear mascotas guardadas, se usará la lista base.");
  }
}

function guardarMascotas() {
  localStorage.setItem("mascotas", JSON.stringify(mascotas));
}

function mostrarAvisoConsola(mostrar) {
  const aviso = document.getElementById("abrirConsola");
  if (!aviso) return;
  aviso.style.display = mostrar ? "block" : "none";
}

// opciones válidas
function pedirTexto(mensaje, opcionesValidas = null) {
  while (true) {
    let input = prompt(mensaje);
    if (input === null) {
      cancelarSimulador();
      return null;
    }
    input = input.trim();
    if (!input) continue;

    if (opcionesValidas) {
      const inputLower = input.toLowerCase();
      const opcionesLower = opcionesValidas.map(o => o.toLowerCase());
      if (!opcionesLower.includes(inputLower)) {
        alert(`Por favor, ingresa una opción válida: ${opcionesValidas.join(", ")}`);
        continue;
      }
      return inputLower;
    }

    return input;
  }
}

function solicitarPreferencias() {
  const tipo = pedirTexto("¿Qué tipo de mascota esta buscando adoptar? (perro/gato)", ["perro", "gato"]);
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

function filtrarMascotas({ tipo, tamaño, edadMax }) {
  return mascotas.filter(
    (m) => m.tipo === tipo && m.tamaño === tamaño && m.edad <= edadMax
  );
}

function mostrarResultado(mascotasFiltradas) {
  console.clear();
  console.log("---- RESULTADO DEL SIMULADOR ----");

  if (mascotasFiltradas.length === 0) {
    alert("No encontramos una mascota con esas características.");
    if (confirm("¿Querés intentarlo de nuevo?")) {
      iniciarSimulador();
    } else {
      mostrarAvisoConsola(false);
    }
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

function listarMascotasDetallado() {
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
  mostrarAvisoConsola(true);
}

function agregarMascota() {
  const nombre = pedirTexto("Nombre de la mascota:");
  if (!nombre) return;

  // Evita duplicados
  const duplicado = mascotas.find(m => m.nombre.toLowerCase() === nombre.toLowerCase());
  if (duplicado) {
    alert(`Ya existe una mascota con el nombre "${nombre}". Por favor elegí otro nombre.`);
    return;
  }

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

function resetearMascotas() {
  mascotas = [...mascotasBase];
  guardarMascotas();
  alert("🐾 Se reiniciaron los datos de mascotas a la lista base.");
}

// Buscar mascota por nombre parcial (para usar desde consola o botones)
function buscarMascotaPorNombre(nombre) {
  return mascotas.find(m => m.nombre.toLowerCase().includes(nombre.toLowerCase()));
}

// Filtrado flexible por campo (nombre, raza, tipo, etc.)
function filtrarMascotasAvanzado() {
  const campo = pedirTexto("¿Por qué campo querés filtrar? (nombre/raza/edad/tipo/tamaño)", ["nombre", "raza", "edad", "tipo", "tamaño"]);
  if (!campo) return;

  const valor = pedirTexto(`¿Qué valor querés buscar en ${campo}?`);
  if (!valor) return;

  let resultado;

  if (campo === "edad") {
    const edadBuscada = parseInt(valor);
    if (isNaN(edadBuscada)) {
      alert("La edad debe ser un número.");
      return;
    }
    resultado = mascotas.filter(m => m.edad === edadBuscada);
  } else {
    resultado = mascotas.filter(m => m[campo].toLowerCase().includes(valor.toLowerCase()));
  }

  if (resultado.length === 0) {
    alert("No se encontraron mascotas que coincidan.");
  } else {
    alert(`Se encontraron ${resultado.length} mascota(s). Mirá la consola para los detalles.`);
    console.clear();
    console.log(`---- FILTRO POR ${campo.toUpperCase()} = "${valor}" ----`);
    resultado.forEach((m, i) => {
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
  }
}

function buscarPorNombre() {
  const nombre = prompt("¿Qué nombre querés buscar?");
  if (!nombre) return;
  const mascota = buscarMascotaPorNombre(nombre);
  if (mascota) {
    console.clear();
    console.log("Mascota encontrada:");
    console.log(mascota);
    alert(`Mascota "${mascota.nombre}" encontrada. Mirá la consola para más detalles.`);
  } else {
    alert("No se encontró ninguna mascota con ese nombre.");
  }
}

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

//  no recarga la página
function cancelarSimulador() {
  alert("Simulación cancelada.");
  mostrarAvisoConsola(false);
}