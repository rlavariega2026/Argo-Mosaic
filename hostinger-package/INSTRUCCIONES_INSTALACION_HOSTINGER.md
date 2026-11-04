# GUÍA OFICIAL DE INSTALACIÓN EN HOSTINGER — ARGO MOSAIC

Esta guía detalla paso a paso cómo publicar la plataforma comercial de **ARGO MOSAIC** en tu hosting de Hostinger (cPanel o hPanel).

---

## 1. REQUISITOS DEL SERVIDOR (HOSTINGER)
- PHP versión **8.0, 8.1 o 8.2** (activo por defecto en Hostinger).
- Extensiones PHP requeridas: `pdo_mysql`, `curl`, `json`, `mbstring`.
- Base de datos MySQL / MariaDB.
- Servidor web Apache con módulo `mod_rewrite` habilitado (incluido en todos los planes de Hostinger).

---

## 2. PASO 1: CREAR LA BASE DE DATOS MYSQL EN HOSTINGER
1. Inicia sesión en el panel de control de Hostinger (**hPanel**).
2. Ve a la sección **Bases de Datos** (Databases) -> **Administración de MySQL** (MySQL Databases).
3. Crea una nueva base de datos:
   - **Nombre de la base de datos:** por ejemplo `u123456789_argo`
   - **Nombre de usuario:** por ejemplo `u123456789_argouser`
   - **Contraseña:** asigna una contraseña segura y anótala.
4. Haz clic en **Crear**.

---

## 3. PASO 2: IMPORTAR LA ESTRUCTURA SQL (`database.sql`)
1. En la lista de bases de datos de Hostinger, haz clic en el botón **Ingresar a phpMyAdmin** junto a la base de datos recién creada.
2. En el menú superior de phpMyAdmin, haz clic en la pestaña **Importar** (Import).
3. Haz clic en **Seleccionar archivo** y elige el archivo `database.sql` incluido en este paquete.
4. Presiona el botón **Importar** al final de la página.
5. Verás el mensaje verde de confirmación indicando que las 7 tablas (`argo_products`, `argo_product_gallery`, `argo_orders`, `argo_quotes`, `argo_samples`, `argo_sales_reps`, `argo_settings`, `argo_admins`) se crearon exitosamente.

---

## 4. PASO 3: CONFIGURAR CREDENCIALES EN `api/config.php`
Abre el archivo `api/config.php` con el Administrador de Archivos de Hostinger o en tu editor de código y actualiza las siguientes líneas con tus datos reales:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_argo');      // Tu nombre de base de datos
define('DB_USER', 'u123456789_argouser');  // Tu usuario de MySQL
define('DB_PASS', 'TuContraseñaSegura');   // La contraseña creada en el Paso 1
```

---

## 5. PASO 4: SUBIR LOS ARCHIVOS A HOSTINGER
1. En hPanel, dirígete a **Administrador de Archivos** (File Manager) -> ingresa a la carpeta **`public_html`**.
2. Sube todos los archivos y carpetas de esta distribución:
   - `index.html`
   - `assets/` (carpeta con los bundles JS, CSS y fuentes)
   - `api/` (carpeta con todos los endpoints PHP y `config.php`)
   - `uploads/` (carpeta para imágenes de productos subidas por el administrador)
   - `.htaccess` (archivo crítico para el enrutamiento y seguridad)
3. Asegúrate de que la carpeta `uploads/` tenga permisos de escritura (`chmod 755` o `chmod 775`).

---

## 6. PASO 5: ACCESO AL PANEL ADMINISTRATIVO
1. Abre tu navegador e ingresa a tu dominio: `https://tudominio.com/`
2. Para acceder al panel de control de ARGO MOSAIC, haz clic en el botón **Admin Portal** o navega a:
   `https://tudominio.com/?tab=admin`
3. Credenciales predeterminadas:
   - **Usuario:** `admin`
   - **Contraseña:** `argo2026!`
4. Puedes cambiar tu usuario y contraseña en cualquier momento desde la pestaña **Website & Admin Settings**.

---

## 7. PASO 6: CONFIGURAR PAYPAL (SANDBOX Y PRODUCCIÓN)
1. En el panel administrativo de ARGO MOSAIC, ve a **Configuración de Pagos (Payment Settings)**.
2. Ingresa tu **PayPal Client ID** y tu **PayPal Secret Key** (obtenidos en el portal de desarrolladores de PayPal en developer.paypal.com).
3. Selecciona el modo:
   - **Sandbox:** para realizar pruebas sin cargos reales.
   - **Live:** para recibir pagos de pedidos reales en tu cuenta comercial de PayPal en EE. UU.
4. Haz clic en **Guardar Configuración**.

---

## 8. RESOLUCIÓN DE DUDAS FRECUENTES
- **¿Qué hacer si las imágenes no cargan?**
  Verifica que la carpeta `uploads/` exista en `public_html/` y tenga permisos 755.
- **¿Qué hacer si al recargar la página da error 404?**
  Asegúrate de que el archivo `.htaccess` esté subido en la raíz de `public_html`. Los servidores Apache de Hostinger utilizan este archivo para dirigir las rutas al frontend React y a la API PHP.
