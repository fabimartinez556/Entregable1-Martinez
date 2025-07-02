// Lista de mascotas disponibles (más detalladas)
const mascotas = [
  {
    nombre: "Luna",
    tipo: "perro",
    tamaño: "mediano",
    edad: 2,
    raza: "Mestiza",
    descripcion:
      "Muy cariñosa, ideal para familias con niños. Le encanta jugar.",
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
    descripcion:
      "Fiel compañero, enérgico y obediente. Necesita espacio para correr.",
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
  {
    nombre: "Dina",
    tipo: "perro",
    tamaño: "mediano",
    edad: 6,
    raza: "Mestiza",
    descripcion:
      "Muy cariñosa, ideal para familias con niños. Le encanta jugar.",
  },
  {
    nombre: "Sansa",
    tipo: "perro",
    tamaño: "grande",
    edad: 8,
    raza: "Mestiza",
    descripcion: "Tranquila y curiosa. Perfecto para departamentos pequeños.",
  },
  {
    nombre: "Balto",
    tipo: "perro",
    tamaño: "mediano",
    edad: 4,
    raza: "Pitbull",
    descripcion:
      "Fiel compañero, enérgico y obediente. Necesita espacio para correr.",
  },
  {
    nombre: "Lola",
    tipo: "gato",
    tamaño: "mediano",
    edad: 6,
    raza: "Mestiza",
    descripcion: "Independiente, pero muy dulce con quienes conoce bien.",
  },
  {
    nombre: "roco",
    tipo: "perro",
    tamaño: "pequeño",
    edad: 1,
    raza: "Caniche",
    descripcion: "Súper juguetón y sociable. Le encanta estar acompañado.",
  },
];

// Función 1: Solicitar preferencias
function solicitarPreferencias() {
  const tipo = prompt(
    "¿Qué tipo de mascota preferís? (perro/gato)"
  ).toLowerCase();
  const tamaño = prompt(
    "¿Qué tamaño preferís? (pequeño/mediano/grande)"
  ).toLowerCase();
  const edadMax = parseInt(
    prompt("¿Cuál es la edad máxima que aceptarías? (en años)")
  );
  return { tipo, tamaño, edadMax };
}

// Función 2: Filtrar mascotas
function filtrarMascotas(preferencias) {
  return mascotas.filter(
    (m) =>
      m.tipo === preferencias.tipo &&
      m.tamaño === preferencias.tamaño &&
      m.edad <= preferencias.edadMax
  );
}

// Función 3: Mostrar resultados
function mostrarResultado(mascotasFiltradas) {
  console.clear();
  console.log("---- RESULTADO DEL SIMULADOR ----");
  if (mascotasFiltradas.length > 0) {
    alert("¡Tenemos mascotas para vos! Mirá la consola para ver las fichas.");
    mascotasFiltradas.forEach((m) => {
      console.log(
        `🐾 Nombre: ${m.nombre}\nTipo: ${m.tipo}\nTamaño: ${m.tamaño}\nEdad: ${m.edad} años\nRaza: ${m.raza}\nDescripción: ${m.descripcion}\n------------------`
      );
    });
    const adoptar = confirm("¿Querés adoptar alguna de estas mascotas?");
    if (adoptar) {
      alert(
        "¡Gracias por adoptar! Un voluntario se pondrá en contacto con vos 🐶🐱"
      );
    } else {
      alert("No hay problema, podés volver a intentarlo más tarde.");
    }
  } else {
    alert(
      "No encontramos una mascota con esas características. Probá con otros filtros."
    );
  }
}

// Función principal
function iniciarSimulador() {
  const preferencias = solicitarPreferencias();
  const resultados = filtrarMascotas(preferencias);
  mostrarResultado(resultados);
}

// Ejecutar
iniciarSimulador();
