☕ BARISTABOX
BaristaBox es una tienda virtual de productos para amantes del café. Este proyecto simula un e-commerce funcional con navegación entre productos, detalle individual, carrito de compras y finalización de compra. Está construido con HTML, CSS, Bootstrap y JavaScript, y utiliza MockAPI como backend simulado.

🧭 Navegación de la aplicación
La app está compuesta por tres vistas principales:
1. 
• 	Página de inicio.
• 	Muestra todos los productos disponibles en forma de cards.
• 	Cada card incluye imagen, nombre, precio y botón “Agregar al carrito”.
• 	Al hacer clic en la imagen, se guarda el  del producto en  y se redirige a .
2. 
• 	Página de detalle del producto.
• 	Recupera el  desde  y muestra:
• 	Carrusel de imágenes.
• 	Nombre, precio y descripción.
• 	Botón “Agregar al carrito”.
• 	Si el producto ya está en el carrito, aumenta la cantidad.
• 	Incluye botón “Volver” a la página principal.
3. 
• 	Página del carrito de compras.
• 	Muestra todos los productos agregados con:
• 	Imagen, nombre, precio unitario, cantidad y subtotal.
• 	Botones para sumar, restar o eliminar productos.
• 	Calcula el total general.
• 	Botón “Finalizar compra” que elimina todos los productos del carrito y muestra un mensaje de confirmación.

🧩 Explicación de los archivos JS

• 	Carga los productos desde la API .
• 	Renderiza cada producto como una card con Bootstrap.
• 	Permite agregar productos al carrito:
• 	Si ya existe, aumenta la cantidad ().
• 	Si no existe, lo agrega ().
• 	Guarda el  del producto en  para navegar a .

• 	Recupera el  del producto desde .
• 	Carga los datos del producto desde la API.
• 	Muestra un carrusel con hasta 3 imágenes.
• 	Muestra nombre, precio y descripción.
• 	Permite agregar el producto al carrito con lógica similar a .

• 	Carga los productos del carrito desde la API .
• 	Calcula subtotal por producto y total general.
• 	Usa funciones:
• 	 para convertir strings como  en números reales.
• 	 para mostrar precios con formato argentino ().
• 	Permite modificar cantidades () o eliminar productos ().
• 	Finaliza la compra eliminando todos los productos del carrito.

🛠️ Tecnologías utilizadas
• 	HTML5 y CSS3
• 	Bootstrap 5 para estilos y componentes visuales
• 	JavaScript (ES6+) para lógica de frontend
• 	Fetch API para comunicación con MockAPI
• 	MockAPI como backend simulado
• 	localStorage para persistencia de navegación
