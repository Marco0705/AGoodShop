document.addEventListener("DOMContentLoaded", function (event) {
  let carrito; // Variable para almacenar la instancia del carrito

  // Función que carga la tabla de productos en el DOM
  function cargarTabla(data) {
    carrito = new Carrito(); 
    const tablaProductos = document.getElementById("cuerpoTabla"); // Selecciono el cuerpo de la tabla

    // Recorro cada producto de los datos
    data.products.forEach((product) => {
      const producto = document.createElement("td"); // Creo la celda del producto
      const nombreProducto = document.createElement("div"); // Creo un div para el nombre del producto
      nombreProducto.innerText = product.title; // Asigno el nombre del producto

      const skuProducto = document.createElement("div"); // Creo un div para el SKU del producto
      skuProducto.classList.add("sku"); // Añado clase para dar estilos
      skuProducto.innerText = "SKU: " + product.SKU; // Asigno el SKU

      producto.append(nombreProducto); // Añado el nombre a la celda del producto
      producto.append(skuProducto); // Añado el SKU a la celda del producto

      const cantidad = document.createElement("td"); // Creo la celda para la cantidad
      const bMenos = document.createElement("button"); // Creo el botón para disminuir
      bMenos.innerText = "-"; // Asigno el texto al botón
      const inputCantidad = document.createElement("input"); // Creo el input para la cantidad
      inputCantidad.type = "number"; // Establezco el tipo de input
      inputCantidad.value = 0; // Valor inicial de la cantidad
      inputCantidad.classList.add("cantidad-input");
      inputCantidad.setAttribute("data-sku", product.SKU); // Asigno el SKU como atributo

      const bMas = document.createElement("button"); // Creo el botón para aumentar
      bMas.innerText = "+"; // Asigno el texto al botón

      // Evento para la cantidad manual
      inputCantidad.addEventListener("input", function () {
        const cantidadManual = parseInt(inputCantidad.value) || 0; // Obtengo la cantidad ingresada o 0 si no es válido
        if (cantidadManual >= 0) {
          // Verifico que la cantidad sea 0 o mayor
          carrito.actualizarUnidades(
            product.SKU,
            cantidadManual -
              (carrito.obtenerInformacionProducto(product.SKU)?.quantity || 0)
          ); // Actualizo la cantidad en el carrito
          actualizarTotal(data); // Actualizo el total general
          actualizarTotalPorProducto(
            product,
            carrito.obtenerInformacionProducto(product.SKU)
          ); // Actualizo el total por producto
        } else {
          inputCantidad.value = 0; // Restablezco el campo a 0 si el valor es menor que 0
        }
      });

      // Evento para el botón de disminuir cantidad
      bMenos.addEventListener("click", function () {
        carrito.decrementar(product.SKU); // Decremento la cantidad en el carrito
        let cantidad = carrito.obtenerInformacionProducto(product.SKU); // Obtengo información del producto
        if (cantidad) {
          inputCantidad.value = cantidad.quantity; // Actualizo el input con la cantidad
        } else {
          inputCantidad.value = 0; // Si no hay cantidad, la establezco en 0
        }
        actualizarTotal(data); // Actualizo el total general
        actualizarTotalPorProducto(product, cantidad); // Actualizo el total por producto
      });

      // Evento para el botón de aumentar cantidad
      bMas.addEventListener("click", function () {
        carrito.incrementar(product.SKU); // Incremento la cantidad en el carrito
        let cantidad = carrito.obtenerInformacionProducto(product.SKU); // Obtengo información del producto
        if (cantidad) {
          inputCantidad.value = cantidad.quantity; // Actualizo el input con la cantidad
        } else {
          inputCantidad.value = 0; // Si no hay cantidad, la establezco en 0
        }
        actualizarTotal(data); // Actualizo el total general
        actualizarTotalPorProducto(product, cantidad); // Actualizo el total por producto
      });

      cantidad.append(bMenos); // Añado el botón de disminuir a la celda de cantidad
      cantidad.append(inputCantidad); // Añado el input de cantidad a la celda
      cantidad.append(bMas); // Añado el botón de aumentar a la celda

      const prUnidad = document.createElement("td"); // Creo la celda para el precio por unidad
      prUnidad.innerText = product.price + " " + data.currency; // Asigno el precio y la moneda

      const total = document.createElement("td"); // Creo la celda para el total del producto
      total.classList.add("total-producto"); // Añado clase para dar estilos
      total.innerText = `0.00 €`; // Inicializo el total en 0

      const tr = document.createElement("tr"); // Creo una nueva fila en la tabla
      tr.append(producto, cantidad, prUnidad, total); // Añado las celdas a la fila

      tablaProductos.append(tr); // Añado la fila al cuerpo de la tabla
    });

    actualizarTotal(data); // Inicializo el total al cargar
  }

  // Función que actualiza el total general del carrito
  function actualizarTotal(data) {
    const totalDisplay = document.getElementById("totalCarrito"); // Selecciono el elemento donde se mostrará el total
    const carritoInfo = carrito.obtenerCarrito(data); // Obtengo la información del carrito
    totalDisplay.innerText = `Total: ${carritoInfo.total} ${carritoInfo.currency}`; // Muestro el total
  }

  // Función que actualiza el total de cada producto en la tabla
  function actualizarTotalPorProducto(product, cantidad) {
    const filas = document.querySelectorAll("#cuerpoTabla tr"); // Selecciono todas las filas de la tabla
    filas.forEach((fila) => {
      const skuElemento = fila
        .querySelector(".sku") // Selecciono el elemento SKU en la fila
        .innerText.replace("SKU: ", ""); // Extraigo el SKU
      if (skuElemento === product.SKU) {
        // Si el SKU coincide
        const precio = parseFloat(product.price); // Convierto el precio a número
        const totalPorProducto = (cantidad ? cantidad.quantity : 0) * precio; // Calculo el total por producto
        const totalElemento = fila.querySelector(".total-producto"); // Selecciono el elemento total en la fila
        totalElemento.innerText = `${totalPorProducto.toFixed(2)} €`; // Muestro el total formateado
      }
    });
  }

  // Fetch para obtener los datos de los productos
  fetch("https://jsonblob.com/api/1298596899396116480")
    .then((response) => response.json()) // Convierto la respuesta a JSON
    .then((data) => {
      cargarTabla(data); // Llamo a la función para cargar la tabla con los datos obtenidos
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error); // Manejo de errores
    });
});
