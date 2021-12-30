// Document ready
$(document).ready(function() {
  $("#avisoSinProductos").hide()
  
});


// Nav
$("#botonUl").click(function(){
    $("#ulNav").toggle("fast","linear");
  });


// Aviso sin productos
$("#cerrarAvisoSinProductos").click(() => $("#avisoSinProductos").hide())


/*
-----------------
--Local Storage--
-----------------*/
// Obtener items del carrito
let productosDelLocalStorage = JSON.parse(localStorage.getItem("productoLocalStorage"))
// Obtener el precio total del carrito
let precioDelLocalStorage = JSON.parse(localStorage.getItem("precioTotal"))
// Variable para el precio del carrito por si se eliminan productos
let precioTotalDelCarrito


/*
------------------------
-Información Del pedido-
------------------------*/
// Coste total del pedido
let costeTotalDelPedido = document.querySelector("#totalPedido")
costeTotalDelPedido > 0 ? costeTotalDelPedido.innerHTML += `Total: $${precioDelLocalStorage.toLocaleString('en-US')}` : null
// Botón finalizar compra
let finalizarCompra = document.querySelector("#botonFinalizarCompra").addEventListener('click', () =>{
  if(precioTotalDelCarrito > 0) {
    let pago = document.querySelector("#pago")
    pago.scrollIntoView()
  } else {
    $("#avisoSinProductos").fadeIn(500).delay(3000).fadeOut(500)
  }
})


/*
-----------------------------
-Funciones con los productos-
-----------------------------*/
// div donde se muestran los productos
let tablaProductos = document.querySelector("#productosTabla");
// Creamos una nueva tabla
let cuerpoTabla = document.createElement("tbody");
cuerpoTabla.id="productos";
// Agregamos la nueva tabla al div
tablaProductos.appendChild(cuerpoTabla);
// Función para mostrar todos los productos
function imprimirProductos(){
  if(productosDelLocalStorage != null){
  productosDelLocalStorage.forEach(producto =>{

    let fila = document.createElement("tr")
    fila.id=`div${producto.id}`

    let td = document.createElement("td") 
    td.innerHTML = `<img src="../imagenes/${producto.id}.png" alt="Imagen de Producto">`;
    fila.appendChild(td)

    td = document.createElement("td") 
    td.innerText = producto.nombre
    fila.appendChild(td)

    td = document.createElement("td") 
    td.innerText = `$${producto.precio.toLocaleString('en-US')}`
    fila.appendChild(td)

    td = document.createElement("td") 
    td.innerText = producto.cantidad
    fila.appendChild(td)

    td = document.createElement("td") 
    td.innerHTML = `<button class="eliminarProducto" id="${producto.id}">Eliminar</button>`;
    fila.appendChild(td)

    cuerpoTabla.appendChild(fila)
  })
}
} imprimirProductos()
// Función para actualizar la información del pedido
function actualizarInformacionDelPedido(){
  let totalPedido = document.querySelector("#totalPedido")
  totalPedido.innerHTML=""
  precioTotalDelCarrito = 0
  precioTotalDelProducto = 0
  if(productosDelLocalStorage != null) {
    productosDelLocalStorage.forEach (producto => {
    precioTotalDelProducto = producto.cantidad * producto.precio
    precioTotalDelCarrito += precioTotalDelProducto
    precioTotalDelCarrito > 0 ? totalPedido.innerHTML=`Total: $${precioTotalDelCarrito.toLocaleString('en-US')}` : totalPedido.innerHTML=""
  })
  }
} actualizarInformacionDelPedido()
// Función para eliminar productos
function eliminarProductos(){
  let botonEliminarProducto = document.getElementsByClassName("eliminarProducto")
  
  for (botones of botonEliminarProducto) {botones.addEventListener('click', function(e) {
    // Detectar el id del producto y buscarlo en el carrito
    let targetProductoEliminado = e.target
    let productoParaEliminar = productosDelLocalStorage.find(productos => productos.id === targetProductoEliminado.id)
    
    // If según la cantidad
    if (productoParaEliminar.cantidad >= 1){
        // Restar la cantidad
        productoParaEliminar.cantidad -- 
        $("#productos").empty()
        imprimirProductos()
        eliminarProductos()
        actualizarInformacionDelPedido()
        }
    if (productoParaEliminar.cantidad == 0){
        // Eliminar el producto del carrito
        let divProducto = document.getElementById("div" + productoParaEliminar.id)
        divProducto.parentNode.removeChild(divProducto)
        // Eliminar el producto del array
        let productoEnElArray = productosDelLocalStorage.indexOf(productoParaEliminar);
        productosDelLocalStorage.splice(productoEnElArray, 1);
        // Agregarle cantidad de 1 nuevamente
        productoParaEliminar.cantidad = 1
        actualizarInformacionDelPedido()
    }
  })}
} eliminarProductos()


/*
-------------------
--Sección de pago--
-------------------*/
// Botón de realizar pago
let botonRealizarPago = document.getElementById("botonRealizarPago").addEventListener('click', () =>{
  if(precioTotalDelCarrito > 0) {
    // Scroll hacia la sección
    let seccionDePago = document.getElementById("pago")
    seccionDePago.scrollIntoView()
    // Datos del comprador
    let email = document.getElementById("email").value
    let nombre = document.getElementById("nombre").value
    $("#pago").empty();
    // Creamos un saldo aleatorio de la tarjeta
    let saldoTarjeta = Math.floor(Math.random () * 1000000)
    // If según el saldo de la tarjeta
    if (saldoTarjeta >= precioTotalDelCarrito){
      // Creamos un número de pedido
      let numeroPedido = Math.floor(Math.random () * 10000000)
      $("#pago").append(`
      <div class="pagoRealizado">
      <i class="fas fa-check fa-3x" id="exito"></i>
      <h2>¡Gracias ${nombre} por elegirnos!</h2>
      <p>Pago realizado con éxito, número de pedido: <b>#${numeroPedido}</b></p>
      <p>Pagaste: $${precioTotalDelCarrito.toLocaleString('en-US')}</p>
      <p>Te enviamos toda la información del pedido a tu email: <b class="email">${email}</b></p>
      </div>
      `)
    } else {
      $("#pago").append(`
      <div class="pagoRealizado">
      <i class="fas fa-times fa-3x" id="rechazado"></i>
      <h2>Lo sentimos</h2>
      <p>Su tarjeta no cuenta con el saldo suficiente.</p>
      <p>Por favor intente de nuevo con otra tarjeta.</p>
      </div>
      `)
    }   
  } else {
      $("#avisoSinProductos").fadeIn(500).delay(3000).fadeOut(500)
  } 
})