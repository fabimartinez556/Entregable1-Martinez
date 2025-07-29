const otroTipo = document.getElementById('otroTipo');
const cuidados = document.getElementById('cuidados');
const listaAgregadas = document.getElementById('listaAgregadas');
const tipoSelect = document.getElementById('tipo');
const saludSelect = document.getElementById('salud');

tipoSelect.addEventListener('change', function () {
  if (this.value === 'Otro') {
    otroTipo.style.display = 'block';
    otroTipo.focus();
  } else {
    otroTipo.style.display = 'none';
    otroTipo.value = '';
  }
});

saludSelect.addEventListener('change', function () {
  if (this.value === 'Requiere cuidados') {
    cuidados.style.display = 'block';
    cuidados.focus();
  } else {
    cuidados.style.display = 'none';
    cuidados.value = '';
  }
});

function renderAgregadas() {
  const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
  listaAgregadas.innerHTML = '';

  if (mascotas.length === 0) {
    listaAgregadas.innerHTML = '<p>No hay mascotas agregadas aún.</p>';
    return;
  }

  mascotas.forEach((mascota, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${mascota.imagen}" alt="${mascota.nombre}">
      <h3>${mascota.nombre} (${mascota.tipo})</h3>
      <p><strong>Edad:</strong> ${mascota.edad} años</p>
      <p><strong>Raza:</strong> ${mascota.raza}</p>
      <p><strong>Peso:</strong> ${mascota.peso} kg</p>
      <p><strong>Sociable:</strong> ${mascota.sociable}</p>
      <p><strong>Estado de salud:</strong> ${mascota.salud}</p>
      ${mascota.cuidados ? `<p><strong>Cuidados:</strong> ${mascota.cuidados}</p>` : ''}
      ${mascota.comentario ? `<p><strong>Comentario:</strong> ${mascota.comentario}</p>` : ''}
      <button class="btn-eliminar" style="background:#e74c3c; margin-top: 10px;">Eliminar</button>
    `;

    card.querySelector('button.btn-eliminar').addEventListener('click', () => {
      if (confirm(`¿Querés eliminar a ${mascota.nombre}?`)) {
        eliminarMascota(index);
      }
    });

    listaAgregadas.appendChild(card);
  });
}

function eliminarMascota(index) {
  const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
  mascotas.splice(index, 1);
  localStorage.setItem('mascotas', JSON.stringify(mascotas));
  renderAgregadas();
}

document.getElementById('formAgregar').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const raza = document.getElementById('raza').value.trim();
  const edad = parseInt(document.getElementById('edad').value);
  const peso = parseFloat(document.getElementById('peso').value);
  let tipo = tipoSelect.value;
  if (tipo === 'Otro') tipo = otroTipo.value.trim();
  const sociable = document.getElementById('sociable').value;
  const salud = saludSelect.value;
  const comentario = document.getElementById('comentario').value.trim();
  const imagen = document.getElementById('imagen').value.trim();
  const reqCuidados = salud === 'Requiere cuidados' ? cuidados.value.trim() : '';

  // Validaciones
  if (!nombre || !raza || !tipo || !imagen) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }
  if (isNaN(edad) || edad < 0 || edad > 20) {
    alert('La edad debe ser un número entre 0 y 20.');
    return;
  }
  if (isNaN(peso) || peso < 0.5 || peso > 80) {
    alert('El peso debe estar entre 0.5 kg y 80 kg.');
    return;
  }
  if (salud === 'Requiere cuidados' && !reqCuidados) {
    alert('Por favor especifica los cuidados requeridos.');
    return;
  }
  if (!isValidURL(imagen)) {
    alert('Por favor ingresa una URL válida para la imagen.');
    return;
  }

  const mascota = {
    nombre,
    raza,
    edad,
    peso,
    tipo,
    sociable,
    salud,
    cuidados: reqCuidados,
    comentario,
    imagen,
  };

  const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
  mascotas.push(mascota);
  localStorage.setItem('mascotas', JSON.stringify(mascotas));

  this.reset();
  otroTipo.style.display = 'none';
  cuidados.style.display = 'none';

  renderAgregadas();
});

// Función simple para validar URL (imagen)
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

renderAgregadas();
