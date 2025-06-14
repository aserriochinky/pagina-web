// Agregar al carrito desde productos.html
function agregarAlCarrito(nombre, precio, idInput ) {
  let cantidad = 1;
  if (idInput) {
    cantidad = parseInt(document.getElementById(idInput).value);
  }

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let index = carrito.findIndex(p => p.nombre === nombre);
  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito");

}

// Mostrar carrito y acciones en tienda.html
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarCarrito() {
  const contenedor = document.getElementById("carrito");
  const totalSpan = document.getElementById("total");
  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
      <p>
        ${item.nombre} -
        <button onclick="cambiarCantidad(${index}, -1)">-</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${index}, 1)">+</button>
        x $${item.precio} = $${subtotal}
        <button onclick="eliminarProducto(${index})">Eliminar</button>
      </p>
    `;
    contenedor.appendChild(itemDiv);
  });

  totalSpan.innerText = total.toFixed(2);
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function irAPago() {
  const resumen = document.getElementById("resumen");
  resumen.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const linea = document.createElement("p");
    linea.textContent = `${item.nombre} - ${item.cantidad} x $${item.precio} = $${subtotal}`;
    resumen.appendChild(linea);
  });

  resumen.innerHTML += `<p><strong>Total: $${total}</strong></p>`;

  document.getElementById("seccion-pago").scrollIntoView({ behavior: "smooth" });
}

// Ejecutar en tienda.html
if (document.getElementById("carrito")) {
  window.onload = mostrarCarrito;
}
// Renderizar tarjetas de productos estáticos
const productos = [
  { nombre: 'Roble', imagen: 'imagenes/roble.jpg', descripcion: 'Resistente y de veta pronunciada.' },
  { nombre: 'Cedro', imagen: 'imagenes/cedro.jpg', descripcion: 'Aromático, liviano, excelente para muebles.' },
  { nombre: 'Almendro', imagen: 'imagenes/almendro.jpg', descripcion: 'Madera dura ideal para exteriores.' }
];
productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

const contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
if (contenedorTarjetas) {
  contenedorTarjetas.innerHTML = '';
  productos.forEach(p => {
    contenedorTarjetas.innerHTML += `
      <div class="tarjeta">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
      </div>
    `;
  });
}

// Actualiza el monto a pagar en centavos antes de enviar a Wompi
function actualizarMontoPago() {
  const total = document.getElementById('total').textContent;
  const montoCentavos = parseInt(parseFloat(total) * 100);
  document.getElementById('montoPago').value = montoCentavos;
}

const formWompi = document.querySelector('.btn-wompi form');
if (formWompi) {
  formWompi.addEventListener('submit', actualizarMontoPago);
}

// Cargar productos desde backend y mostrarlos en #lista-productos
fetch('/api/productos')
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById('lista-productos');
    if (contenedor) {
      contenedor.innerHTML = '';
      productos.forEach(p => {
        contenedor.innerHTML += `
          <div class="producto">
            <h3>${p.nombre}</h3>
            <p>Precio: $${p.precio}</p>
            <p>Disponible: ${p.cantidad || 'N/A'}</p>
            <input type="number" id="cant_${p.nombre}" value="1" min="1" />
            <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, 'cant_${p.nombre}')">Comprar</button>
          </div>
        `;
      });
    }
  })
  .catch(error => console.error('Error al cargar productos:', error));
