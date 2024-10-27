class Usuario {
  constructor(nombre, pathImg) {
    this.nombre = nombre;
    this.gastos = [];
    this.pathImg = pathImg;
  }

  agregarGasto(gasto) {
    this.gastos.push(gasto);
  }

  obtenerTotalGastos() {
    return this.gastos.reduce((total, gasto) => total + gasto.monto, 0);
  }
}

class Gasto {
  constructor(titulo, monto, fecha) {
    this.titulo = titulo;
    this.monto = monto;
    this.fecha = fecha;
  }
}
const usuarios = [
  new Usuario("Ana", "img/usuarios/avatar_b.png"),
  new Usuario("Juan", "img/usuarios/avatar_a.png"),
  new Usuario("Pedro", "img/usuarios/avatar_c.png"),
];

document.addEventListener("DOMContentLoaded", function () {
  let inputTitulo = document.getElementById("titulo");
  let inputImporte = document.getElementById("importe");
  let inputFecha = document.getElementById("fecha");
  let selectUsuario = document.getElementById("usuario");
  let resumenContenedor = document.querySelector("#collapseOne .accordion-body");

  
  //Funcion para agregar un gasto
  function agregarGasto() {
    let usuarioSeleccionado = usuarios.find(
      (u) => u.nombre === selectUsuario.value
    );
    let nuevoGasto = new Gasto(
      inputTitulo.value,
      parseFloat(inputImporte.value),
      inputFecha.value
    );
    usuarioSeleccionado.agregarGasto(nuevoGasto);
    agregarGastoAlResumen(usuarioSeleccionado, nuevoGasto);
    actualizarCuentas();
  }
  //Funcion para agregar un gasto al resumen
  function agregarGastoAlResumen(usuario, gasto) {
    // Crear nuevo elemento para el gasto
    let nuevoGasto = document.createElement("div");
    nuevoGasto.className = "card mb-12 espacio";
    nuevoGasto.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${usuario.pathImg}" class="img-fluid rounded-start">
                    </div>
                    <div class="col-md-10">
                        <div class="card-body">
                            <h5 class="card-title">${usuario.nombre}</h5>
                            <p class="card-text">Pagó ${gasto.monto}€ el ${gasto.fecha}.</p>
                        </div>
                    </div>
                </div>
            `;
    resumenContenedor.appendChild(nuevoGasto);
  }
  //Funcion para validar los campos
  function todosLosCamposValidos() {
    return (
      inputTitulo.classList.contains("is-valid") &&
      inputImporte.classList.contains("is-valid") &&
      inputFecha.classList.contains("is-valid") &&
      selectUsuario.value !== ""
    
    );
  }
 
  let formulario = document.getElementById("gastoForm");
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    if (todosLosCamposValidos()) {
      agregarGasto();
      resetearFormulario();
    }
  });

  function checkTitulo(element) {
    let regex = /^[a-zA-Z0-9\s]{1,20}$/;
    validarCampo(element, regex);
  }

  function checkImporte(element) {
    let regex = /^(0|[1-9]\d{0,2})(\.\d{2})$|^1000\.00$/;
    validarCampo(element, regex);
  }

  function checkFecha(element) {
    let regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(200[0-9]|20[1-9][0-9])$/;
    if (regex.test(element.value)) {
        let partes = element.value.split('/');
        let dia = parseInt(partes[0], 10);
        let mes = parseInt(partes[1], 10) - 1; // Ajustar mes para Date (0-11)
        let anio = parseInt(partes[2], 10);

        let fechaObjeto = new Date(anio, mes, dia);
        if (
            fechaObjeto.getFullYear() === anio &&
            fechaObjeto.getMonth() === mes &&
            fechaObjeto.getDate() === dia
        ) {
            element.classList.add("is-valid");
            element.classList.remove("is-invalid");
            return true;
        } else {
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");
            return false;
        }
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        return false;
    }
}

  function validarCampo(element, regex) {
    if (regex.test(element.value)) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
      return true;
    } else {
      element.classList.add("is-invalid");
      element.classList.remove("is-valid");
      return false;
    }
  }
  inputTitulo.addEventListener("blur", (event) => checkTitulo(event.target));
  inputImporte.addEventListener("blur", (event) => checkImporte(event.target));
  inputFecha.addEventListener("blur", (event) => checkFecha(event.target));

  function resetearFormulario() {
    inputTitulo.value = "";
    inputImporte.value = "";
    inputFecha.value = "";
    inputTitulo.classList.remove("is-valid", "is-invalid");
    inputImporte.classList.remove("is-valid", "is-invalid");
    inputFecha.classList.remove("is-valid", "is-invalid");
    selectUsuario.value = "";
  }
});

function actualizarCuentas() {
  let cuentaContenedor = document.getElementById("cuentaUsuarios");

  usuarios.forEach((usuario) => {
    let totalPagado = usuario.obtenerTotalGastos();
    let totalPorUsuario = totalPagado / usuarios.length;
    let debe = totalPorUsuario * (usuarios.length - 1) - totalPagado;

    let divUsuario = document.createElement("div");
    divUsuario.className = "card mb-12 espacio";
    divUsuario.innerHTML = `
      <div class="row g-0">
        <div class="col-md-2">
          <img src="${usuario.pathImg}" class="img-fluid rounded-start">
        </div>
        <div class="col-md-10">
          <div class="card-body">
            <h5 class="card-title">${usuario.nombre}</h5>
            <p class="card-text">Total pagado: ${totalPagado.toFixed(2)}€</p>
            <p class="card-text">Debe: ${Math.abs(debe).toFixed(2)}€</p>
          </div>
        </div>
      </div>
    `;
    cuentaContenedor.appendChild(divUsuario);

  });
}

function agregarGasto() {
  let usuarioSeleccionado = usuarios.find(
    (u) => u.nombre === selectUsuario.value
  );
  let nuevoGasto = new Gasto(
    inputTitulo.value,
    parseFloat(inputImporte.value),
    inputFecha.value
  );
  usuarioSeleccionado.agregarGasto(nuevoGasto);
  agregarGastoAlResumen(usuarioSeleccionado, nuevoGasto);
}


