# FUNVAL Pro 3 — API REST con TypeScript y Express

## Descripción del proyecto

Este repositorio contiene el proyecto semanal de FUNVAL, enfocado en el desarrollo de una API REST utilizando **Node.js, TypeScript y Express**.

Además del ejercicio principal de inscripciones académicas, se incorporan los ejercicios prácticos de la guía semanal dentro de la carpeta `src/Ejercicios/`.

El objetivo es mantener cada ejercicio organizado en su propio archivo y permitir que sus funcionalidades se ejecuten desde el servidor principal.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- tsx
- Git y GitHub

## Estructura del proyecto

```text
.
├── README.md
└── src/
    ├── index.ts
    ├── Index_comentado.ts
    └── Ejercicios/
        ├── Ejercicio1.ts
        ├── Ejercicio2.ts
        ├── Ejercicio3.ts
        └── Guia.md
```

### Responsabilidad de los archivos

- **`src/index.ts`**: punto de entrada de la aplicación. Configura Express, define las rutas de estudiantes y registra los módulos adicionales.
- **`src/Index_comentado.ts`**: versión comentada del ejercicio principal, utilizada como material de estudio.
- **`src/Ejercicios/Ejercicio1.ts`**: API REST para gestionar una biblioteca digital.
- **`src/Ejercicios/Ejercicio2.ts`**: espacio destinado al ejercicio de gestión de vehículos.
- **`src/Ejercicios/Ejercicio3.ts`**: espacio destinado al ejercicio de gestión de pedidos.
- **`src/Ejercicios/Guia.md`**: guía de referencia para los ejercicios.

## Integración de los ejercicios

Los ejercicios se incorporan al proyecto mediante el mecanismo de **enrutamiento modular de Express**.

El archivo principal importa el router de la biblioteca:

```typescript
import librosRouter from "./Ejercicios/Ejercicio1";
```

Después lo registra en la aplicación:

```typescript
app.use("/api/libros", librosRouter);
```

De esta manera, las rutas definidas dentro de `Ejercicio1.ts` quedan disponibles bajo el prefijo `/api/libros`.

La API de estudiantes conserva sus rutas originales, definidas directamente en `index.ts`.

**Ventaja:** ambas funcionalidades comparten el mismo servidor, pero mantienen separada su lógica de negocio y sus endpoints.

## Ejercicio principal: Inscripciones académicas

El sistema permite gestionar estudiantes mediante operaciones CRUD.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/estudiantes` | Listar estudiantes |
| GET | `/api/estudiantes/:id` | Consultar estudiante por ID |
| POST | `/api/estudiantes` | Registrar estudiante |
| PUT | `/api/estudiantes/:id` | Actualizar estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante |

Los registros se almacenan temporalmente en un arreglo en memoria.

## Ejercicio 1: Biblioteca digital

La API administra un catálogo de libros con los siguientes campos:

- `id`: identificador numérico.
- `titulo`: título del libro.
- `autor`: nombre del autor.
- `paginas`: cantidad de páginas.
- `disponible`: disponibilidad del libro.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/libros` | Listar libros |
| GET | `/api/libros/:id` | Consultar libro por ID |
| POST | `/api/libros` | Registrar libro |
| PUT | `/api/libros/:id` | Actualizar libro |
| DELETE | `/api/libros/:id` | Eliminar libro |

La biblioteca utiliza un arreglo en memoria con tres registros iniciales.

## Configuración e instalación

Desde la raíz del repositorio, instalar las dependencias:

```bash
npm install
```

## Ejecución del servidor

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

El servidor utiliza el puerto `3000`.

Dirección base:

```text
http://localhost:3000
```

No es necesario iniciar un servidor independiente para cada ejercicio integrado.

## Pruebas de funcionamiento

Con el servidor en ejecución, abrir una segunda terminal.

### 1. Comprobar la API de estudiantes

En una terminal use: npm run dev
Despues copie y pegue en otra terminal la consulta que quiere realizar

Consultar lista completa de estudiante:

```bash
curl -i http://localhost:3000/api/estudiantes
```

Consultar un estudiante específico:

```bash
curl -i http://localhost:3000/api/estudiantes/1
```

Registrar un estudiante. Los campos `nombre`, `curso` y `activo` son obligatorios:

```bash
curl -i -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Gustavo Andres","curso":"Node.js","activo":true}'
```

Actualizar un estudiante existente (en este ejemplo, el ID `1`). El PUT requiere enviar los tres campos:

```bash
curl -i -X PUT http://localhost:3000/api/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carlos Mendoza","curso":"TypeScript","activo":true}'
```

### 2. Comprobar la API de biblioteca

```bash
curl -i http://localhost:3000/api/libros
```

Consultar un libro específico:

```bash
curl -i http://localhost:3000/api/libros/1
```

Registrar un libro:

```bash
curl -i -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"La sombra del viento","autor":"Carlos Ruiz Zafón","paginas":576,"disponible":true}'
```

Actualizar un libro existente (en este ejemplo, el ID `1`):

```bash
curl -i -X PUT http://localhost:3000/api/libros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cien años de soledad","autor":"Gabriel García Márquez","paginas":471,"disponible":false}'
```

Una respuesta `HTTP 200 OK` confirma que una consulta GET o una actualización PUT fue atendida correctamente. Las operaciones POST exitosas responden `HTTP 201 Created`. El endpoint DELETE también está disponible para probar la eliminación de registros.

## Compilación de TypeScript

Para comprobar que el código compila:

```bash
npm run build
```

Si la compilación termina sin errores, TypeScript habrá generado los archivos JavaScript de salida según la configuración de `tsconfig.json`.

## Consideraciones

- Los ejercicios utilizan arreglos en memoria, no una base de datos persistente.
- Los cambios realizados mediante POST, PUT y DELETE se pierden cuando se reinicia el servidor.
- Los ejercicios 2 y 3 deberán integrarse y probarse cuando su implementación esté terminada.
- `Index_comentado.ts` es material de referencia; el servidor de desarrollo ejecuta `src/index.ts`.

## Objetivo de aprendizaje

Practicar la creación de APIs REST con TypeScript y Express, implementar operaciones CRUD, organizar módulos independientes e integrarlos mediante Express Router en una aplicación backend común.
