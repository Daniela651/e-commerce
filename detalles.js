const BASE_API = "https://68bdfdbf227c48698f85cdf9.mockapi.io/api/v1";
const PRODUCTOS_API = `${BASE_API}/productos`;
const CARRITO_API = `${BASE_API}/carro`;

const id = localStorage.getItem("productoID");
if (!id) document.getElementById("detalle").innerHTML = "<p>Producto no encontrado.</p>";

fetch(`${PRODUCTOS_API}/${id}`)
  .then(res => res.json())
  .then(prod => {
    const detalle = document.getElementById("detalle");

    const imagenes = [prod.fotos.imagen1, prod.fotos.imagen2, prod.fotos.imagen3].filter(Boolean);
    const carruselItems = imagenes.map((img, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${img}" class="d-block w-100" alt="Imagen ${i + 1}">
      </div>
    `).join("");

    detalle.innerHTML = `
      <div class="mx-auto" style="max-width: 500px;">
     <div id="carouselExampleFade" class="carousel slide carousel-fade mb-3" data-bs-ride="carousel">          <div class="carousel-inner">
            ${carruselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
        <div class="text-center">
          <h3>${prod.nombre}</h3>
          <p>Precio: $${prod.precio}</p>
          <p>${prod.detalles}</p>
          <button class="btn btn-primary mb-2" id="btnCarrito">Agregar al carrito</button><br>
          <a href="principal.html" class="btn btn-secondary">Volver</a>
        </div>
      </div>
    `;

    const btn = document.getElementById("btnCarrito");
    btn.addEventListener("click", async () => {
      try {
        const res = await fetch(CARRITO_API);
        const carrito = await res.json();

        const existe = carrito.find(p => p.nombre_producto === prod.nombre);

        if (existe) {
          await fetch(`${CARRITO_API}/${existe.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...existe, cantidad_producto: existe.cantidad_producto + 1 })
          });
          alert(`Ahora tenés ${existe.cantidad_producto + 1} de ${prod.nombre}`);
        } else {
          const nuevoProd = {
            nombre_producto: prod.nombre,
            precio_producto: prod.precio,
            imagen_producto: prod.fotos.imagen1,
            cantidad_producto: 1
          };
          await fetch(CARRITO_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProd)
          });
          alert(`${prod.nombre} agregado al carrito`);
        }
      } catch (err) {
        console.error(err);
        alert("Error al agregar al carrito");
      }
    });
  })
  .catch(err => console.error(err));

