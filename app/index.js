// Función para imprimir el producto en el HTML
function imprimirProductos(producto) {
    $("#divProductos").append(`
    <div class="producto">
        <img src="../imagenes/${producto.id}.png" alt="Imagen de Producto">
        <div class="informacionPrincipalProducto">
        <h3>${producto.nombre}</h3>
            <div class="informacionSecundariaProducto">
                <p class="precioProducto">$${producto.precio.toLocaleString('en-US')}</p>
                <button class="botonParaAgregarProducto" id="${producto.id}">Agregar</button>
            </div>
        </div> 
    </div>
    `)
}
// Función para imprimir el producto en el carrito
function imprimirEnCarrito(){
    for (const producto of carritoDeCompras) {
        $("#productosCarrito").append(`
        <div class="productoCarrito" id="div${producto.id}">
            <div class="imagenCarrito">
                <img src="../imagenes/${producto.id}.png" alt="Imagen de Producto">
            </div>
            <div class="tituloProductoCarrito">
                <h3 class="nombreProducto">${producto.nombre}</h3>
                <div class="precioYCantidadProducto">
                    <p id="cantidadProductoCarrito ${producto.id}">${producto.cantidad}x </p>
                    <p class="precioProducto">$${producto.precio.toLocaleString('en-US')}</p>
                </div>                    
            </div>
            <div class="botonCarrito">
                <i class="fas fa-times botonParaEliminarProducto" id="${producto.id}"></i>
            </div>
        </div>
        `);
    }
}
// Función para actualizar el precio del carrito
function actualizarTotal(){
    let precioTotalDeCadaProducto = 0
    let precioTotalDelCarrito = 0
    carritoDeCompras.forEach (producto => {
    precioTotalDeCadaProducto = producto.cantidad * producto.precio;
    precioTotalDelCarrito += precioTotalDeCadaProducto;
    let textoDePrecioTotal = document.querySelector("#totalCarrito");
    textoDePrecioTotal.innerHTML=`Total: $${precioTotalDelCarrito.toLocaleString('en-US')}`;
    localStorage.setItem('precioTotal', JSON.stringify(precioTotalDelCarrito));
    });
}
// Función para eliminar productos del carrito
function eliminarProductosDelCarrito(){
        // Botón para eliminar producto
        let botonParaEliminarProducto = document.getElementsByClassName("botonParaEliminarProducto")
        // Recorrer todos lo botones
        for (const botones of botonParaEliminarProducto) {botones.addEventListener('click', function(e){
            // Detectar el id del producto y buscar el producto en el carrito 
            let targetDelProductoEliminado = e.target
            let productoParaEliminar = carritoDeCompras.find(productos => productos.id === targetDelProductoEliminado.id)
    
            // If según la cantidad
            if (productoParaEliminar.cantidad >= 1){
                // Restar la cantidad
                productoParaEliminar.cantidad --
                $("#productosCarrito").empty()
                imprimirEnCarrito()
                actualizarTotal()
                eliminarProductosDelCarrito()
            } 
            if (productoParaEliminar.cantidad == 0){
                // Eliminar el producto del carrito
                let divDelProducto = document.getElementById("div" + productoParaEliminar.id)
                divDelProducto.parentNode.removeChild(divDelProducto)
                // Eliminar el producto del array
                let productoEnElArray = carritoDeCompras.indexOf(productoParaEliminar);
                carritoDeCompras.splice(productoEnElArray, 1);
                // Agregarle cantidad de 1 nuevamente
                productoParaEliminar.cantidad = 1
            }
        })}
}
// Función agregar productos al carrito
function agregarProductosAlCarrito(){
    // Boton para agregar al carrito
    let botonParaAgregarProducto = document.getElementsByClassName("botonParaAgregarProducto");
    
    // Recorrer los botones para detectar producto
    for (const botones of botonParaAgregarProducto) {botones.addEventListener('click', function(e){
        // Aviso "Producto agregado al carrito"
        $("#avisoAgregadoCarrito").fadeIn(500).delay(4000).fadeOut(500);
        // Texto dentro del carrito "Agrega productos"
        $("#agregaProductos").hide();
    
        // Detectar producto   
        let targetDelProducto = e.target
        let productoParaElCarrito = productos.find(producto => producto.id === targetDelProducto.id)
        const existe = carritoDeCompras.includes(productoParaElCarrito)
    
        // Detectar si ya existe en el carrito
        if (existe == true){
            productoParaElCarrito.cantidad ++
            $("#productosCarrito").empty()
            imprimirEnCarrito()
            actualizarTotal()
            eliminarProductosDelCarrito()
            } else{
            carritoDeCompras.push(productoParaElCarrito)
            $("#productosCarrito").empty()
            imprimirEnCarrito()
            actualizarTotal()
            eliminarProductosDelCarrito()
        }   
    })}
}
// Función para mostrar los productos filtrados
function mostrarProductosFiltrados(filtro, array, mensaje) {
    console.log(array)
    $(filtro).click((e) => {
        let main = document.getElementById("main")
        main.scrollIntoView()
        e.preventDefault()
        $("#divProductos").empty()
        array.sort(function(a, b){return a.precio - b.precio});
        for (const producto of array) {imprimirProductos(producto)}
        $(".filtro").hide()
        $(".filtros").append(`
        <div id="avisoFiltros">
            <p>Viendo sólo ${mensaje}</p>
            <button id="limpiarFiltro"><p>Limpiar Filtro</p></button>
        </div>
        
        `)
        agregarProductosAlCarrito()

        // Limpiar filtro
    $("#limpiarFiltro").click(() => {
        $("#divProductos").empty()
        for (const producto of productos) {imprimirProductos(producto)}
        $(".filtro").show()
        $("#avisoFiltros").remove()
        agregarProductosAlCarrito()
        })
    })
}
// Función para crear los filtros
function crearFiltros() {
let microprocesadores = productos.filter(function(producto) {return (producto.categoria === "microprocesadores")})
let placasDeVideo = productos.filter(function(producto) {return (producto.categoria === "placasdevideo")})
let motherboards = productos.filter(function(producto) {return (producto.categoria === "motherboards")})
let memoriasRam = productos.filter(function(producto) {return (producto.categoria === "memoriasram")})
let fuentes = productos.filter(function(producto) {return (producto.categoria === "fuentes")})
let precioHasta5 = productos.filter(function(producto) {return (producto.precio <= 5000)})
let precioHasta15 = productos.filter(function(producto) {return (producto.precio > 5000 && producto.precio <= 15000)})
let precioHasta30 = productos.filter(function(producto) {return (producto.precio > 15000 && producto.precio <= 30000)})
let precioHasta50 = productos.filter(function(producto) {return (producto.precio > 30000 && producto.precio <= 50000)})
let precioHasta100 = productos.filter(function(producto) {return(producto.precio > 50000 && producto.precio <= 100000)})
let precioMasde100 = productos.filter(function(producto) {return(producto.precio > 100000)})
let msi = productos.filter(function(producto) {return (producto.marca === "msi")})
let intel = productos.filter(function(producto) {return (producto.marca === "intel")})
let amd = productos.filter(function(producto) {return (producto.marca === "amd")})
let hyperx = productos.filter(function(producto) {return (producto.marca === "hyperx")})
let gigabyte = productos.filter(function(producto) {return (producto.marca === "gigabyte")})
let asus = productos.filter(function(producto) {return (producto.marca === "asus")})
let palit = productos.filter(function(producto) {return (producto.marca === "palit")})
let pny = productos.filter(function(producto) {return (producto.marca === "pny")})
let corsair = productos.filter(function(producto) {return (producto.marca === "corsair")})
mostrarProductosFiltrados("#microprocesadores", microprocesadores, "la categoría microprocesadores")
mostrarProductosFiltrados("#placasDeVideo", placasDeVideo, "la categoría<br>placas de video")
mostrarProductosFiltrados("#motherboards", motherboards, "la categoría<br>motherboards")
mostrarProductosFiltrados("#memoriasRam", memoriasRam, "la categoría<br>memorias RAM")
mostrarProductosFiltrados("#fuentes", fuentes, "la categoría<br>fuentes")
mostrarProductosFiltrados("#hasta5", precioHasta5, "productos de hasta<br>$5,000")
mostrarProductosFiltrados("#hasta15", precioHasta15, "productos desde $5,000 hasta $15,000")
mostrarProductosFiltrados("#hasta30", precioHasta30, "productos desde $15,000 hasta $30,000")
mostrarProductosFiltrados("#hasta50", precioHasta50, "productos desde $30,000 hasta $50,000")
mostrarProductosFiltrados("#hasta100", precioHasta100, "productos desde $50,000 hasta $100,000")
mostrarProductosFiltrados("#masde100", precioMasde100, "productos de más de $100,000")
mostrarProductosFiltrados("#msi", msi, "la marca<br>MSI")
mostrarProductosFiltrados("#intel", intel, "la marca<br>Intel")
mostrarProductosFiltrados("#amd", amd, "la marca<br>AMD")
mostrarProductosFiltrados("#hyperx", hyperx, "la marca<br>HyperX")
mostrarProductosFiltrados("#gigabyte", gigabyte, "la marca<br>Gigabyte")
mostrarProductosFiltrados("#asus", asus, "la marca<br>Asus")
mostrarProductosFiltrados("#palit", palit, "la marca<br>Palit")
mostrarProductosFiltrados("#pny", pny, "la marca<br>PNY")
mostrarProductosFiltrados("#corsair", corsair, "la marca<br>Corsair")
}

// Document ready
$(document).ready(function() {
    localStorage.clear()
    $("#avisoAgregadoCarrito").hide()
});

// Nav
$("#botonUl").click(function(){
    $("#ulNav").toggle("fast","linear");
});

// Arrays
const carritoDeCompras = [];
const productos = []

/*
--------------------
--Cargar productos--
--------------------*/
fetch("productos.json")
.then(response => response.json())
.then(data => {data.forEach((producto) => productos.push(producto))})
.finally(() => {
    productos.forEach(producto => imprimirProductos(producto));
    crearFiltros();
})

/*
-----------------
-----Carrito-----
-----------------*/
agregarProductosAlCarrito()
$("#carrito").click(() => $(".divCarrito").addClass('active'))
$("#botonCerrarCarrito").click(() => $(".divCarrito").removeClass('active'))
$("#cerrarAgregadoCarrito").click(() => $("#avisoAgregadoCarrito").hide())
let botonVerCarrito = document.getElementById("botonVerCarrito").addEventListener('click', () => carritoDeCompras.length >= 1 ? localStorage.setItem('productoLocalStorage', JSON.stringify(carritoDeCompras)) : null)


