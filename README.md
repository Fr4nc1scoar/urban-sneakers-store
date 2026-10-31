# Alberto Shoes Collection 👟🔥
### Plataforma de Venta de Zapatos, Gestión de Pedidos por WhatsApp y Crédito Quincenal

Plataforma moderna de comercio electrónico diseñada para la venta de calzado deportivo y casual (Nike, Jordan, Adidas, New Balance, Alexander McQueen, Salomon, etc.) con sincronización automática de catálogo y gestión de cobro a crédito en cuotas quincenales.

---

## 🚀 Características Principales

### 1. 🛍️ Catálogo en Línea y Experiencia de Usuario (UI/UX Premium)
* **+290 Modelos Sincronizados:** Productos extraídos directamente del catálogo digital con fotos en alta resolución, disponibilidad y tallas reales.
* **Precio Único Configurable:** Todos los modelos fijados a **$50 USD** por defecto (modificable desde el panel admin o reglas globales).
* **Filtros Dinámicos e Interactivos:**
  * Filtro por marca (Nike, Jordan, Adidas, New Balance, McQueen, Salomon, etc.).
  * Filtro interactivo por talla (EU 30 a 48).
  * Buscador en tiempo real por modelo o descripción.
* **Modal de Detalles del Zapato:**
  * Selector visual de tallas disponibles en stock.
  * Selector de cantidad.
  * Desglose instantáneo de pago: **De Contado ($50)** o **A Crédito (2 cuotas de $25)**.
* **Carrito y Checkout Interactivo:**
  * Resumen del pedido con cálculo automático de cuotas.
  * Formulario de cliente: Nombre, Teléfono/WhatsApp, Cédula (C.I.), Ciudad, Dirección y Notas.
  * Opciones de pago: Crédito Quincenal, Pago Móvil (Bs), Efectivo (USD), Binance Pay (USDT) y Zelle.
  * **Efecto de Confetti** al realizar el pedido.

---

### 2. 📲 Integración con WhatsApp (+58 424-8057420)
* **Envío Directo al Dueño:** Cada pedido genera automáticamente un mensaje estructurado y detallado para WhatsApp dirigido al número del dueño **`+58 424-8057420`**.
* **Detalle del Mensaje:**
  * Código de Pedido (#ALB-XXXX).
  * Datos completos del cliente (Nombre, Teléfono, C.I., Dirección).
  * Modelos seleccionados, tallas elegidas y subtotal.
  * Total a pagar y modalidad seleccionada (Crédito / Contado).
* **Botón Flotante:** Acceso rápido para atención al cliente por WhatsApp en cualquier momento.

---

### 3. 💳 Panel de Administración y Gestión de Créditos Quincenales
Ruta del panel: `http://localhost:3000/admin` o `/admin` en producción.

* **Métricas en Tiempo Real:**
  * Total de pedidos recibidos.
  * Pedidos pendientes por confirmar.
  * Monto total por cobrar en créditos activos ($ USD).
  * Alerta de cuotas vencidas o pendientes de cobro.
* **Gestión de Cuotas Quincenales:**
  * Asignación de cuotas (por defecto 2 quincenales del 50%, expandible a 3 o personalizado).
  * Edición manual de montos y fechas de vencimiento.
  * Cambio de estado por cuota: ⏳ **Pendiente**, ✅ **Cobrada/Pagada**, ⚠️ **Vencida/Atrasada**.
* **Automatización de Cobros por WhatsApp:**
  * Botón **"📲 Cobrar por WhatsApp"** en cada cuota: Genera un mensaje cordial, personalizado y profesional que incluye el nombre del cliente, número de cuota, monto a pagar, fecha límite y los datos bancarios (Pago Móvil, Binance Pay, etc.).

---

### 4. 🔄 Sincronizador Automático de Catálogo
* Conexión directa con la fuente: `https://loading-stylee.ola.click/products/?type=read`.
* Botón **"🔄 Sincronizar Catálogo Ahora"** en el Admin con feedback instantáneo.
* Endpoint API: `POST /api/sync` (puede conectarse a un Cron Job de Vercel para actualización diaria automática).
* Parser inteligente que extrae tallas (ej. `36-37-38-39-40-41-42-43-44-45`), marcas, estado de stock e imágenes de alta definición.

---

## 🛠️ Stack Tecnológico
* **Frontend & Backend:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
* **Estilos & Animaciones:** [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism + [Lucide Icons](https://lucide.dev/).
* **Efectos:** [Canvas-Confetti](https://github.com/catdad/canvas-confetti).
* **Base de Datos & Persistencia:**
  * Almacenamiento local optimizado en `data/` listo para usar en desarrollo y despliegues Node.
  * Adaptador Firebase (`src/lib/firebase.ts`) preparado para conectar con Firestore para despliegues serverless en Vercel.

---

## 💻 Instrucciones para Ejecutar en Local

1. Asegúrate de tener Node.js instalado (v18 o superior).
2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```
3. Abre tu navegador en:
   * **Tienda:** [http://localhost:3000](http://localhost:3000)
   * **Panel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ☁️ Despliegue en Vercel
1. Sube este repositorio a tu cuenta de GitHub / GitLab.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. (Opcional) Si deseas habilitar sincronización en la nube con Firebase, añade las siguientes variables de entorno en el panel de Vercel:
   * `NEXT_PUBLIC_FIREBASE_API_KEY`
   * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   * `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   * `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   * `NEXT_PUBLIC_FIREBASE_APP_ID`
4. ¡Listo! Vercel desplegará automáticamente la aplicación.
