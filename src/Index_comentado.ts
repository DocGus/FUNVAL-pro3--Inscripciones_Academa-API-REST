
/*
==========================================================
PROYECTO: API REST DE INSCRIPCIONES ACADÉMICAS
TECNOLOGÍAS: Node.js, Express y TypeScript

En este archivo vamos a practicar el CRUD de estudiantes.

CRUD significa:
- Create: crear estudiantes (POST).
- Read: consultar estudiantes (GET).
- Update: actualizar estudiantes (PUT).
- Delete: eliminar estudiantes (DELETE).

Por ahora guardaremos los datos en un arreglo (array).
Más adelante podremos utilizar una base de datos real.
*/

// ==========================================================
// 1. IMPORTAR LAS HERRAMIENTAS QUE NECESITAMOS
// ==========================================================

// Express nos ayuda a crear el servidor y sus rutas.
import express from "express";

// Request representa lo que nos envía el cliente.
// Response nos permite responderle al cliente.
import type { Request, Response } from "express";

// Importamos el router del Ejercicio 1: Biblioteca Digital.
// Este archivo contiene sus propias rutas CRUD.
// El router se conectará con la aplicación principal más adelante.
import librosRouter from "./Ejercicios/Ejercicio1";

// ==========================================================
// 2. PREPARAR EL SERVIDOR
// ==========================================================

// Creamos nuestra aplicación Express.
// Aquí vamos a definir las rutas de nuestra API.
const app = express();

// Elegimos el puerto donde estará escuchando el servidor.
const PORT = 3000;

// Le decimos a Express que interprete los datos JSON
// que recibimos en las peticiones.
// Gracias a esto podemos leerlos desde req.body.
app.use(express.json());

// Así mantenemos separados los ejercicios de estudiantes
// y biblioteca, aunque ambos utilicen el mismo servidor.
app.use("/api/libros", librosRouter);

// ==========================================================
// 3. DEFINIR CÓMO ES UN ESTUDIANTE
// ==========================================================

// Esta interfaz describe la información que tendrá
// cada estudiante dentro de nuestro programa.
//
// id: número que identifica al estudiante.
// nombre: nombre completo.
// curso: curso en el que está inscrito.
// activo: indica si el estudiante está activo o no.
//
// TypeScript nos ayuda a comprobar que usemos estos tipos.
// Esta interfaz no valida automáticamente lo que llega
// desde una petición HTTP; eso lo haremos más adelante.
interface Estudiante {
  id: number;
  nombre: string;
  curso: string;
  activo: boolean;
}

// ==========================================================
// 4. CREAR NUESTRA BASE DE DATOS DE PRÁCTICA
// ==========================================================

// Este arreglo será nuestra base de datos temporal.
// Cada objeto representa a un estudiante.
//
// Como todavía no usamos una base de datos real,
// los cambios solo existirán mientras el servidor esté activo.
const listaEstudiantes: Estudiante[] = [
  { id: 1, nombre: "Carlos Mendoza", curso: "JavaScript", activo: true },
  { id: 2, nombre: "María López", curso: "TypeScript", activo: true },
  { id: 3, nombre: "Juan Pérez", curso: "React", activo: false },
  { id: 4, nombre: "Ana García", curso: "HTML y CSS", activo: true },
  { id: 5, nombre: "Luis Fernández", curso: "JavaScript", activo: false },
  { id: 6, nombre: "Sofía Ramírez", curso: "TypeScript", activo: true },
  { id: 7, nombre: "Diego Torres", curso: "React", activo: true },
  { id: 8, nombre: "Valentina Castro", curso: "Node.js", activo: false },
  { id: 9, nombre: "Andrés Flores", curso: "JavaScript", activo: true },
  { id: 10, nombre: "Camila Vargas", curso: "TypeScript", activo: false },
];

// ==========================================================
// 5. PREPARAR EL PRÓXIMO ID
// ==========================================================

// Cada estudiante necesita un ID diferente.
//
// Si utilizáramos la cantidad de estudiantes + 1,
// podríamos repetir un ID después de eliminar registros.
//
// Por eso buscamos el ID más alto que ya existe
// y le sumamos uno. Así sabemos cuál usar al crear
// el siguiente estudiante.
let siguienteId =
  Math.max(0, ...listaEstudiantes.map((estudiante) => estudiante.id)) + 1;

// ==========================================================
// 6. REVISAR LOS DATOS QUE RECIBIMOS
// ==========================================================

// Esta función revisa si los datos de un estudiante
// tienen la información que necesitamos.
//
// Devuelve un mensaje cuando encuentra un problema.
// Si todo está bien, devuelve null.
//
// Así podemos utilizar la misma función al crear
// y al actualizar estudiantes, sin repetir el código.
function validarEstudiante(body: unknown): string | null {

  // Primero comprobamos que hayamos recibido un objeto JSON.
  // No aceptamos valores vacíos, null ni arreglos.
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return "El cuerpo debe ser un objeto JSON.";
  }

  // Todavía no sabemos qué contiene este objeto.
  // Por eso revisamos cada campo antes de utilizarlo.
  const datos = body as Record<string, unknown>;

  // El nombre debe ser texto y no puede estar vacío.
  // trim() quita los espacios que sobran al principio y al final.
  if (
    typeof datos.nombre !== "string" ||
    !datos.nombre.trim()
  ) {
    return "El nombre es obligatorio y debe ser texto.";
  }

  // El curso también debe ser texto y tener contenido.
  if (
    typeof datos.curso !== "string" ||
    !datos.curso.trim()
  ) {
    return "El curso es obligatorio y debe ser texto.";
  }

  // activo solo puede recibir true o false.
  // Por ejemplo, no aceptamos "true" como texto.
  if (typeof datos.activo !== "boolean") {
    return "El campo activo debe ser true o false.";
  }

  // Si llegamos aquí, todos los campos son válidos.
  return null;
}

// ==========================================================
// 7. GET: CONSULTAR TODOS LOS ESTUDIANTES
// ==========================================================

// Esta ruta se utiliza cuando queremos ver la lista completa.
//
// Petición:
// GET http://localhost:3000/api/estudiantes
//
// No necesitamos recibir datos del cliente para esta consulta.
// Por eso escribimos _req: no vamos a utilizar req.
//
// res nos permite construir y enviar la respuesta.
app.get(
  "/api/estudiantes",
  (_req: Request, res: Response) => {

    // El código 200 significa que la petición salió bien.
    //
    // Enviamos un objeto JSON con un mensaje,
    // la cantidad de estudiantes y la lista completa.
    return res.status(200).json({
      ok: true,
      mensaje: "Lista de estudiantes de FUNVAL",
      total: listaEstudiantes.length,
      data: listaEstudiantes,
    });
  }
);

// ==========================================================
// 8. GET: BUSCAR UN ESTUDIANTE POR SU ID
// ==========================================================

// Esta ruta nos permite consultar un solo estudiante.
//
// Por ejemplo:
// GET http://localhost:3000/api/estudiantes/3
//
// El :id de la URL es un valor que cambia según
// el estudiante que queremos consultar.
app.get(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {

    // El ID llega desde la URL como texto.
    // Number() nos permite convertirlo en número.
    const id = Number(req.params.id);

    // Comprobamos que el ID sea un entero positivo.
    // Si no lo es, respondemos con un error 400.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    // find() recorre la lista hasta encontrar
    // al estudiante que tenga el ID que buscamos.
    //
    // Si lo encuentra, devuelve ese estudiante.
    // Si no, devuelve undefined.
    const estudiante = listaEstudiantes.find(
      (e) => e.id === id
    );

    // Si no encontramos al estudiante, respondemos 404.
    // Este código significa que el recurso no existe.
    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    // Si lo encontramos, devolvemos sus datos con código 200.
    return res.status(200).json({
      ok: true,
      data: estudiante,
    });
  }
);

// ==========================================================
// 9. POST: REGISTRAR UN NUEVO ESTUDIANTE
// ==========================================================

// POST se utiliza para crear un estudiante.
//
// El cliente debe enviar los datos en formato JSON.
//
// Ejemplo del cuerpo de la petición:
// {
//   "nombre": "Kevin López",
//   "curso": "Node.js",
//   "activo": true
// }
app.post(
  "/api/estudiantes",
  (req: Request, res: Response) => {

    // Antes de registrar al estudiante, revisamos los datos.
    const error = validarEstudiante(req.body);

    // Si la función encontró un problema, respondemos 400.
    // No creamos el registro si los datos son incorrectos.
    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    // Desestructuramos los datos para obtener cada campo
    // directamente del objeto recibido en req.body.
    const { nombre, curso, activo } = req.body as Estudiante;

    // Creamos el nuevo estudiante con su propio ID.
    // trim() elimina los espacios sobrantes del nombre y el curso.
    const nuevoEstudiante: Estudiante = {
      id: siguienteId++,
      nombre: nombre.trim(),
      curso: curso.trim(),
      activo,
    };

    // push() agrega el nuevo estudiante al final de la lista.
    listaEstudiantes.push(nuevoEstudiante);

    // El código 201 significa que creamos un recurso nuevo.
    // Devolvemos los datos del estudiante que acabamos de registrar.
    return res.status(201).json({
      ok: true,
      mensaje: "Estudiante registrado con éxito.",
      data: nuevoEstudiante,
    });
  }
);

// ==========================================================
// 10. PUT: ACTUALIZAR UN ESTUDIANTE
// ==========================================================

// PUT se utiliza para actualizar los datos de un estudiante.
//
// Ejemplo:
// PUT http://localhost:3000/api/estudiantes/2
//
// En esta práctica pedimos todos los campos editables:
// nombre, curso y activo.
//
// El ID se obtiene de la URL y no se cambia.
app.put(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {

    // Convertimos el ID de la URL en un número.
    const id = Number(req.params.id);

    // Primero comprobamos que el ID sea válido.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    // findIndex() busca la posición del estudiante en la lista.
    // Si no lo encuentra, devuelve -1.
    const indice = listaEstudiantes.findIndex(
      (e) => e.id === id
    );

    // Si no existe, no tenemos nada que actualizar.
    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    // Revisamos los nuevos datos antes de modificar el registro.
    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    // Obtenemos los datos nuevos enviados por el cliente.
    const { nombre, curso, activo } = req.body as Estudiante;

    // Construimos el estudiante actualizado.
    // Conservamos el ID que recibimos en la URL.
    const estudianteActualizado: Estudiante = {
      id,
      nombre: nombre.trim(),
      curso: curso.trim(),
      activo,
    };

    // Reemplazamos el estudiante antiguo por el nuevo
    // en la posición que encontramos con findIndex().
    listaEstudiantes[indice] = estudianteActualizado;

    // Respondemos 200 porque la actualización fue exitosa.
    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante actualizado con éxito.",
      data: estudianteActualizado,
    });
  }
);

// ==========================================================
// 11. DELETE: ELIMINAR UN ESTUDIANTE
// ==========================================================

// DELETE se utiliza para eliminar un estudiante por su ID.
//
// Ejemplo:
// DELETE http://localhost:3000/api/estudiantes/3
app.delete(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {

    // Convertimos el ID de la URL en número.
    const id = Number(req.params.id);

    // Comprobamos que el ID tenga un formato válido.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    // Buscamos la posición del estudiante que queremos eliminar.
    const indice = listaEstudiantes.findIndex(
      (e) => e.id === id
    );

    // Si la posición es -1, el estudiante no existe.
    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    // splice() elimina elementos de una lista.
    // Aquí eliminamos un elemento desde la posición encontrada.
    //
    // También guardamos el estudiante eliminado para poder
    // incluir sus datos en la respuesta.
    const [estudianteEliminado] = listaEstudiantes.splice(
      indice,
      1
    );

    // Respondemos 200 y confirmamos qué estudiante eliminamos.
    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante eliminado con éxito.",
      data: estudianteEliminado,
    });
  }
);

// ==========================================================
// 12. PONER EL SERVIDOR EN FUNCIONAMIENTO
// ==========================================================

// app.listen() inicia el servidor y lo deja esperando peticiones.
// El puerto 3000 es donde los clientes podrán acceder a la API.
//
// Cuando el servidor esté listo, veremos este mensaje en la terminal.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
