class Carrito {
  // Constructor que inicializa un objeto para almacenar los productos en el carrito
  constructor() {
    this.productos = {};
  }

  // Método para actualizar la cantidad de un producto basado en su SKU
  actualizarUnidades(sku, unidades) {
    // Si el producto ya existe en el carrito, se suma la cantidad
    if (this.productos[sku]) {
      this.productos[sku].quantity += unidades;
    } else {
      // Si el producto no existe, se agrega con la cantidad inicial
      this.productos[sku] = { sku, quantity: unidades };
    }
  }

  // Método para incrementar la cantidad de un producto
  incrementar(sku) {
    this.actualizarUnidades(sku, 1); // Llamo a actualizarUnidades con +1
  }

  // Método para decrementar la cantidad de un producto
  decrementar(sku) {
    // Solo decrementar si el producto existe y su cantidad es mayor que 0
    if (this.productos[sku] && this.productos[sku].quantity > 0) {
      this.actualizarUnidades(sku, -1); // Llamo a actualizarUnidades con -1
    }
  }

  // Método para obtener información de un producto en base a su SKU
  obtenerInformacionProducto(sku) {
    return this.productos[sku] || null; // Devuelvo el producto o null si no existe
  }

  // Método para obtener el total del carrito y la información de los productos
  obtenerCarrito(data) {
    // Calculo el total acumulando el precio de cada producto multiplicado por su cantidad
    const total = Object.values(this.productos).reduce((sum, product) => {
      // Buscp los datos del producto en el array de datos
      const productData = data.products.find((p) => p.SKU === product.sku);
      // Si se encuentra el producto, se suma su precio por la cantidad
      return sum + (productData ? productData.price * product.quantity : 0);
    }, 0);

    // Devuelvo un objeto con el total, la moneda y la lista de productos
    return {
      total: total.toFixed(2), // Formateo el total a dos decimales
      currency: "€",
      products: Object.values(this.productos), // Devuelvo la lista de productos
    };
  }
}
