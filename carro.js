const CARRITO_API = "https://68bdfdbf227c48698f85cdf9.mockapi.io/api/v1/carro";

// Función para convertir string con puntos en número real
function limpiarPrecio(valor) {
  if (typeof valor === "string") {
    // Elimina puntos de miles y reemplaza coma decimal por punto
    const limpio = valor.replace(/\./g, "").replace(",", ".");
    return parseFloat(limpio);
  }
  return parseFloat(valor);
}

// Función para mostrar precios con formato argentino
function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function cargarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  try {
    const res = await fetch(CARRITO_API);
    const productos = await res.json();

    if (productos.length === 0) {
      contenedor.innerHTML = `<p class="text-center text-muted">Tu carrito está vacío </p>`;
      return;
    }

    let total = 0;

    productos.forEach(prod => {
      const precio = limpiarPrecio(prod.precio_producto);
      const subtotal = precio * prod.cantidad_producto;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("col-md-4");
      div.innerHTML = `
        <div class="card h-100 shadow-sm carta">
          <img src="${prod.imagen_producto}" class="card-img-top" alt="${prod.nombre_producto}">
          <div class="card-body">
            <h5>${prod.nombre_producto}</h5>
            <p>Precio unitario: $${formatearPrecio(precio)}</p>
            <p>Subtotal: $${formatearPrecio(subtotal)}</p>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-warning btn-sm restar" data-id="${prod.id}">-</button>
              <span>Cantidad: <strong>${prod.cantidad_producto}</strong></span>
              <button class="btn btn-success btn-sm sumar" data-id="${prod.id}">+</button>
              <button class="btn btn-danger btn-sm eliminar" data-id="${prod.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });

    const divTotal = document.createElement("div");
    divTotal.classList.add("col-12", "mt-4");
    divTotal.innerHTML = `<h3>Total: $${formatearPrecio(total)}</h3>`;
    contenedor.appendChild(divTotal);

    agregarEventos(productos);

  } catch (err) {
    console.error(err);
  }
}

function agregarEventos(productos) {
  document.querySelectorAll(".sumar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const prod = productos.find(p => p.id === id);
      await fetch(`${CARRITO_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prod, cantidad_producto: prod.cantidad_producto + 1 })
      });
      cargarCarrito();
    });
  });

  document.querySelectorAll(".restar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const prod = productos.find(p => p.id === id);

      if (prod.cantidad_producto > 1) {
        await fetch(`${CARRITO_API}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...prod, cantidad_producto: prod.cantidad_producto - 1 })
        });
      } else {
        await fetch(`${CARRITO_API}/${id}`, { method: "DELETE" });
      }
      cargarCarrito();
    });
  });

  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      await fetch(`${CARRITO_API}/${id}`, { method: "DELETE" });
      cargarCarrito();
    });
  });
}

document.querySelector(".btn-comprar").addEventListener("click", async () => {
  const confirmar = confirm("¿Deseas finalizar la compra?");
  if (!confirmar) return;

  const res = await fetch(CARRITO_API);
  const productos = await res.json();
  for (let prod of productos) {
    await fetch(`${CARRITO_API}/${prod.id}`, { method: "DELETE" });
  }
  alert("¡Compra finalizada! Gracias por tu compra.");
  cargarCarrito();
});

cargarCarrito();

