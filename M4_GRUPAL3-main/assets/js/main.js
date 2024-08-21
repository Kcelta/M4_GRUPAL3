//Data Table
$(document).ready( function () {
  $("#myTable").DataTable();
} );

class Empresa {
  #idRegistro;
  #nombre;
  #rut;
  #tamano;
  #importaciones;

  constructor(idRegistro, nombre, rut, tamano) {
      this.#idRegistro = idRegistro;
      this.#nombre = nombre;
      this.#rut = rut;
      this.#tamano = tamano;
      this.#importaciones = [];
  }

  agregarImportacion(importacion) {
      this.#importaciones.push(importacion);
  }

  mostrarInformacion() {
      return `IdRegistro: ${this.#idRegistro}, Nombre: ${this.#nombre}, RUT: ${this.#rut}, Tamaño: ${this.#tamano}`;
  }

  getNombre() {
      return this.#nombre;
  }

  getIdRegistro() {
      return this.#idRegistro;
  }

  getRut() {
      return this.#rut;
  }

  getTamano() {
      return this.#tamano;
  }

  getImportaciones() {
      return this.#importaciones;
  }
}

class Importacion {
  #idImportacion;
  #producto;
  #numeroProductos;
  #precioUnitario;
  #rubro;
  #visacion;
  #prohibicion;

  constructor(idImportacion, producto, numeroProductos, precioUnitario, rubro) {
      this.#idImportacion = idImportacion;
      this.#producto = producto;
      this.#numeroProductos = numeroProductos;
      this.#precioUnitario = precioUnitario;
      this.#rubro = rubro;
      this.#visacion = [
          "Cereales y productos de cereales",
          "Frutas, verduras y frutos secos",
          "Productos de panadería y confitería",
          "Bebidas alcohólicas y no alcohólicas",
          "Productos químicos y farmacéuticos"
      ].includes(rubro) ? "A la espera de aprobación" : "Aprobado";
      this.#prohibicion = [
          "Cereales y productos de cereales",
          "Frutas, verduras y frutos secos",
          "Productos de panadería y confitería",
          "Bebidas alcohólicas y no alcohólicas",
          "Maquinaria y equipos mecánicos",
          "Aparatos eléctricos y electrónicos",
          "Vehículos y partes de vehículos",
          "Productos químicos y farmacéuticos",
          "Minerales metálicos y no metálicos",
          "Productos de extracción minera",
          "Plásticos en formas primarias",
          "Productos de caucho y sus derivados",
          "Juguetes y artículos de recreo",
          "Instrumentos musicales",
          "Artículos de oficina y papelería"
      ].includes(rubro) ? "A la espera de revisión en oficinas de aduanas" : "Aprobado";
  }
  
  mostrarInformacion() {
      return `IdImportacion: ${this.#idImportacion}, Producto: ${this.#producto}, Número de Productos: ${this.#numeroProductos}, Precio Unitario: ${this.#precioUnitario}, Rubro: ${this.#rubro}, Visación: ${this.#visacion}, Prohibición: ${this.#prohibicion}`;
  }

  getIdImportacion() {
      return this.#idImportacion;
  }

  getProducto() {
      return this.#producto;
  }

  getNumeroProductos() {
      return this.#numeroProductos;
  }

  getPrecioUnitario() {
      return this.#precioUnitario;
  }

  getRubro() {
      return this.#rubro;
  }

  getVisacion() {
      return this.#visacion;
  }

  getProhibicion() {
      return this.#prohibicion;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // Agregar Empresa
  document.getElementById("btnAgregarEmpresa").addEventListener("click", agregarEmpresa);

  // Agregar Importación
  document.getElementById("btnAgregarImportacion").addEventListener("click", addImportacion);

  // Para los botones que se crean dinámicamente (como los de Mostrar Totales)
  document.addEventListener("click", function(event) {
    if (event.target && event.target.matches(".btn-mostrar-totales")) {
      const nombreEmpresa = event.target.getAttribute("data-empresa");
      calcularTotales(nombreEmpresa);
    }
  });
});

let empresas = [];

function agregarEmpresa() {
  const idRegistro = document.getElementById("idRegistro").value;
  const nombre = document.getElementById("nombre").value;
  const rut = document.getElementById("rut").value;
  const tamano = document.getElementById("tamanoEmpresa").value;

  if (!idRegistro || !nombre || !rut || !tamano) {
      alert("Debes completar todos los campos para agregar una empresa.");
      return;
  }

  const empresa = new Empresa(idRegistro, nombre, rut, tamano);
  empresas.push(empresa);
  alert("Empresa creada: " + empresa.mostrarInformacion());

  mostrarEmpresas();
  actualizarSelectEmpresas();
  document.getElementById("idRegistro").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("rut").value = "";
  document.getElementById("tamanoEmpresa").value = "";
}

function mostrarEmpresas() {
  const seccionEmpresas = document.getElementById("sectionEmpresas");

  // Agrega solo la nueva empresa al final, sin borrar el contenido anterior
  const empresa = empresas[empresas.length - 1]; // Última empresa agregada
  const newDiv = document.createElement('div');
  newDiv.classList.add('mb-4');
  newDiv.innerHTML = `
    <div class="border p-3 rounded">
      <h2>${empresa.getNombre()}</h2>
      <p>ID Registro: ${empresa.getIdRegistro()}</p>
      <p>RUT: ${empresa.getRut()}</p>
      <p>Tamaño: ${empresa.getTamano()}</p>
      <div class="table-responsive">
      <table class="table table-secondary table-hover cell-border compact stripe" id="myTable">
        <thead>
          <tr>
            <th>ID Importación</th>
            <th>Producto</th>
            <th>Número de Productos</th>
            <th>Precio Unitario</th>
            <th>Rubro</th>
            <th>Visación</th>
            <th>Prohibición</th>
          </tr>
        </thead>
        <tbody id="importaciones-${empresa.getNombre()}">
        </tbody>
        <tfoot id="totales-${empresa.getNombre()}">
        </tfoot>
      </table>
      </div>
      <button class="btn btn-primary btn-mostrar-totales" data-empresa="${empresa.getNombre()}">Mostrar Totales</button>
    </div>`;

  seccionEmpresas.appendChild(newDiv);
}

function addImportacion() {
  const idImportacion = document.getElementById("idImportacion").value;
  const producto = document.getElementById("producto").value;
  const numeroProductos = document.getElementById("numeroProductos").value;
  const precioUnitario = document.getElementById("precioUnitario").value;
  const nombreEmpresa = document.getElementById("nombreEmpresa").value.trim();
  const rubro = document.getElementById("rubro").value;

  if (!idImportacion || !producto || !numeroProductos || !precioUnitario || !nombreEmpresa || !rubro) {
      alert("Debes completar todos los campos para agregar una importación.");
      return;
  }

  const empresa = empresas.find(empresa => empresa.getNombre() === nombreEmpresa);

  if (!empresa) {
      alert("No se encontró ninguna empresa con ese nombre.");
      return;
  }

  const importacion = new Importacion(idImportacion, producto, numeroProductos, precioUnitario, rubro);
  empresa.agregarImportacion(importacion);
  alert("Importación agregada a la empresa " + nombreEmpresa + ": " + importacion.mostrarInformacion());

  mostrarImportaciones(empresa);
  document.getElementById("idImportacion").value = "";
  document.getElementById("producto").value = "";
  document.getElementById("numeroProductos").value = "";
  document.getElementById("precioUnitario").value = "";
  document.getElementById("nombreEmpresa").value = "";
  document.getElementById("rubro").value = "";
}

function mostrarImportaciones(empresa) {
  const tbody = document.getElementById(`importaciones-${empresa.getNombre()}`);
  tbody.innerHTML = "";

  empresa.getImportaciones().forEach((importacion) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${importacion.getIdImportacion()}</td>
        <td>${importacion.getProducto()}</td>
        <td>${importacion.getNumeroProductos()}</td>
        <td>${importacion.getPrecioUnitario()}</td>
        <td>${importacion.getRubro()}</td>
        <td>${importacion.getVisacion()}</td>
        <td>${importacion.getProhibicion()}</td>`;
      tbody.appendChild(row);
  });

  // Limpiar el pie de tabla antes de agregar los nuevos totales
  const tfoot = document.getElementById(`totales-${empresa.getNombre()}`);
  tfoot.innerHTML = "";
}

function calcularTotales(nombreEmpresa) {
  const empresa = empresas.find(empresa => empresa.getNombre() === nombreEmpresa);
  if (!empresa) {
      alert("No se encontró ninguna empresa con ese nombre.");
      return;
  }

  const importaciones = empresa.getImportaciones();
  let totalProductos = 0;
  let sumaTotal = 0;

  importaciones.forEach(importacion => {
      totalProductos += parseInt(importacion.getNumeroProductos(), 10);
      sumaTotal += parseInt(importacion.getNumeroProductos(), 10) * parseFloat(importacion.getPrecioUnitario());
  });

  const tfoot = document.getElementById(`totales-${nombreEmpresa}`);
  tfoot.innerHTML = `
      <tr>
        <td colspan="2"><strong>Total Número de Productos:</strong></td>
        <td>${totalProductos}</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="2"><strong>Suma Total de Importaciones:</strong></td>
        <td>${sumaTotal.toFixed(2)}</td>
        <td></td>
      </tr>`;
}

function actualizarSelectEmpresas() {
  const select = document.getElementById("nombreEmpresa");
  select.innerHTML = '<option value="">Seleccione una empresa</option>'; // Resetea el menú desplegable

  empresas.forEach(empresa => {
      const option = document.createElement("option");
      option.value = empresa.getNombre();
      option.textContent = empresa.getNombre();
      select.appendChild(option);
  });
}
