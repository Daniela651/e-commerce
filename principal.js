const BASE_API = "https://68bdfdbf227c48698f85cdf9.mockapi.io/api/v1";
const PRODUCTOS_API = `${BASE_API}/productos`;
const CARRITO_API = `${BASE_API}/carro`;

// Esperar que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("articulos");

  if (!contenedor) {
    console.error("No se encontró el contenedor #articulos");
    return;
  }

  // Cargar productos
  fetch(PRODUCTOS_API)
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener productos");
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-muted'>No hay productos disponibles.</p>";
        return;
      }

      data.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("col-md-3");

        div.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${prod.fotos?.imagen1 || 'fotos/default.png'}" class="card-img-top img-click" alt="${prod.nombre}" data-id="${prod.id}">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">Precio: $${prod.precio}</p>
              <button class="btn btn-primary w-100 agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
            </div>
          </div>
        `;

        contenedor.appendChild(div);
      });

      // Abrir detalles
      document.querySelectorAll(".img-click").forEach(img => {
        img.addEventListener("click", () => {
          const id = img.dataset.id;
          localStorage.setItem("productoID", id);
          window.location.href = "detalles.html";
        });
      });

      // Agregar al carrito
      document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const producto = data.find(p => p.id === id);
          if (!producto) return;

          try {
            const res = await fetch(CARRITO_API);
            const carrito = await res.json();

            const existe = carrito.find(p => p.nombre_producto === producto.nombre);

            if (existe) {
              await fetch(`${CARRITO_API}/${existe.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...existe, cantidad_producto: existe.cantidad_producto + 1 })
              });
              alert(`Ahora tenés ${existe.cantidad_producto + 1} de ${producto.nombre}`);
            } else {
              const nuevoProd = {
                nombre_producto: producto.nombre,
                precio_producto: producto.precio,
                imagen_producto: producto.fotos?.imagen1 || '',
                cantidad_producto: 1
              };
              await fetch(CARRITO_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProd)
              });
              alert(`${producto.nombre} agregado al carrito`);
            }
          } catch (err) {
            console.error("Error al agregar al carrito:", err);
            alert("No se pudo agregar al carrito.");
          }
        });
      });
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
      contenedor.innerHTML = "<p class='text-danger text-center'>No se pudieron cargar los productos.</p>";
    });
});

