Guía de Prácticas: APIs REST con TypeScript y
Express
Materia: Desarrollo Backend / Programación Web | Instrucciones Generales para Estudiantes
1. Configuración del Entorno de Trabajo
Para cada uno de los ejercicios solicitados, deberá inicializar un proyecto nuevo en Node.js, instalar
TypeScript, Express y configurar las herramientas de desarrollo necesarias ejecutando los siguientes
comandos en su terminal:

mkdir mi-proyecto-backend cd mi-proyecto-backend npm init -y npm install express npm
install -D typescript @types/node @types/express ts-node npx tsc --init

2. Requisitos Obligatorios por Ejercicio
Simulación de Base de Datos: Cada proyecto debe declarar una interfaz estricta en TypeScript y un
arreglo en memoria que almacene al menos 3 registros iniciales.
Endpoints Requeridos: Obligatoriamente cada API debe implementar 5 métodos esenciales:
GET Listar todos los recursos y GET Buscar recurso por ID.
POST Crear nuevo registro.
PUT Actualizar un registro existente por ID.
DELETE Eliminar un registro por ID.
Criterios de Evaluación
Se calificará el correcto tipado de TypeScript (evitar el uso de any) y la correcta ejecución en Postman o
Thunder Client. Nota: No utilizaremos librerías de validación como Zod todavía; asumiremos que el
usuario envía los datos correctos.

Práctica de Programación Backend - TypeScript & Express Página 1 de 3




Ejercicio 1: Sistema de Gestión de Biblioteca Digital
Desarrolle una API REST para administrar un catálogo de libros digitales en una plataforma educativa.
Estructura y Endpoints (Temática 1: Libros)
Interfaz: { id: number, titulo: string, autor: string, paginas: number,
disponible: boolean }
GET /api/libros (Listar todos) GET /api/libros/:id (Buscar por ID)
POST /api/libros (Registrar libro) PUT /api/libros/:id (Actualizar datos)
DELETE /api/libros/:id (Eliminar libro)



Ejercicio 2: Sistema de Control de Flota de Vehículos
Desarrolle una API REST enfocada en el monitoreo y gestión de vehículos de una empresa de transporte
urbano.
Estructura y Endpoints (Temática 2: Vehículos)
Interfaz: { id: number, placa: string, modelo: string, kilometraje: number,
estado: 'activo' | 'mantenimiento' }
GET /api/vehiculos (Listar todos) GET /api/vehiculos/:id (Buscar por ID)
POST /api/vehiculos (Registrar vehículo) PUT /api/vehiculos/:id (Actualizar vehículo)
DELETE /api/vehiculos/:id (Dar de baja)
Práctica de Programación Backend - TypeScript & Express Página 2 de 3

Ejercicio 3: Sistema de Gestión de Pedidos de Comida Rápida
Desarrolle una API REST orientada al procesamiento y seguimiento de órdenes en línea de un restaurante.
Estructura y Endpoints (Temática 3: Pedidos)
Interfaz: { id: number, cliente: string, platillo: string, total: number,
entregado: boolean }
GET /api/pedidos (Listar todos) GET /api/pedidos/:id (Buscar por ID)
POST /api/pedidos (Crear pedido) PUT /api/pedidos/:id (Modificar pedido)
DELETE /api/pedidos/:id (Cancelar pedido)
Instrucciones de Entrega
Cada estudiante o grupo de trabajo deberá entregar los tres proyectos desarrollados en repositorios
independientes de GitHub o en un archivo comprimido (ZIP) que contenga la carpeta de cada proyecto con su
respectivo código fuente compilable, archivo package.json y un archivo README.md detallando las rutas
probadas.
Validación con Postman
Recuerde enviar capturas de pantalla o exportar su colección de pruebas en Postman demostrando el
funcionamiento correcto de los 5 endpoints obligatorios para cada una de las 3 temáticas solicitadas.