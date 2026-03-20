const calendario = document.getElementById("calendario");
const tituloMes = document.getElementById("tituloMes");
const mesAnterior = document.getElementById("mesAnterior");
const mesSiguiente = document.getElementById("mesSiguiente");
const limpiarMes = document.getElementById("limpiarMes");
const exportarTexto = document.getElementById("exportarTexto");
const salidaTexto = document.getElementById("salidaTexto");

const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let fechaActual = new Date();
let mes = fechaActual.getMonth();
let anio = fechaActual.getFullYear();

function claveMes(anio, mes) {
  return `turnos-${anio}-${mes}`;
}

function obtenerDatosMes(anio, mes) {
  const datos = localStorage.getItem(claveMes(anio, mes));
  return datos ? JSON.parse(datos) : {};
}

function guardarDatosMes(anio, mes, datos) {
  localStorage.setItem(claveMes(anio, mes), JSON.stringify(datos));
}

function renderizarCalendario() {
  calendario.innerHTML = "";
  tituloMes.textContent = `${nombresMeses[mes]} ${anio}`;

  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);

  let diaSemanaInicio = primerDia.getDay();
  diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

  const totalDias = ultimoDia.getDate();
  const datosMes = obtenerDatosMes(anio, mes);

  for (let i = 0; i < diaSemanaInicio; i++) {
    const celdaVacia = document.createElement("div");
    celdaVacia.className = "dia inactivo";
    calendario.appendChild(celdaVacia);
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const celda = document.createElement("div");
    const estado = datosMes[dia] || "vacio";

    celda.className = `dia ${estado}`;

    const numero = document.createElement("div");
    numero.className = "numero";
    numero.textContent = dia;

    const textoEstado = document.createElement("div");
    textoEstado.className = "estado";
    textoEstado.textContent =
      estado === "trabajo" ? "Trabajo" :
      estado === "libre" ? "Libre" : "Sin marcar";

    celda.appendChild(numero);
    celda.appendChild(textoEstado);

    celda.addEventListener("click", () => {
      let nuevoEstado;

      if (estado === "vacio") {
        nuevoEstado = "trabajo";
      } else if (estado === "trabajo") {
        nuevoEstado = "libre";
      } else {
        nuevoEstado = "vacio";
      }

      if (nuevoEstado === "vacio") {
        delete datosMes[dia];
      } else {
        datosMes[dia] = nuevoEstado;
      }

      guardarDatosMes(anio, mes, datosMes);
      renderizarCalendario();
    });

    calendario.appendChild(celda);
  }
}

mesAnterior.addEventListener("click", () => {
  mes--;
  if (mes < 0) {
    mes = 11;
    anio--;
  }
  renderizarCalendario();
});

mesSiguiente.addEventListener("click", () => {
  mes++;
  if (mes > 11) {
    mes = 0;
    anio++;
  }
  renderizarCalendario();
});

limpiarMes.addEventListener("click", () => {
  localStorage.removeItem(claveMes(anio, mes));
  salidaTexto.value = "";
  renderizarCalendario();
});

exportarTexto.addEventListener("click", () => {
  const datosMes = obtenerDatosMes(anio, mes);
  const ultimoDia = new Date(anio, mes + 1, 0).getDate();

  let texto = `${nombresMeses[mes]} ${anio}\n\n`;

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const estado = datosMes[dia] || "sin marcar";
    let textoEstado = "";

    if (estado === "trabajo") {
      textoEstado = "Trabajo";
    } else if (estado === "libre") {
      textoEstado = "Libre";
    } else {
      textoEstado = "Sin marcar";
    }

    texto += `${dia}: ${textoEstado}\n`;
  }

  salidaTexto.value = texto;
});

renderizarCalendario();
