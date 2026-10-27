
import express from "express";
import type { ErrorRequestHandler, Request, Response } from "express";

// Conservamos las rutas que ya habías separado en otros archivos.
import librosRouter from "./Ejercicios/Eje1";
import productosRouter from "./Ejercicios/eje4-middleware";

const app = express();
const PORT = 3000;

// MIDDLEWARE GLOBAL
// Debe ejecutarse antes de las rutas para que Express pueda interpretar
// los cuerpos JSON enviados en las peticiones POST y PUT.
app.use(express.json());

// Rutas independientes que ya existían en el proyecto.
app.use("/api/libros", librosRouter);
app.use("/api/productos", productosRouter);

// MODELO DE ESTUDIANTE
// CAMBIO: sustituimos "curso" y "activo" por "email" y "bootcamp".
// ¿Por qué? La consigna oficial de FUNVAL solicita estos cuatro campos.
interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

// CAMBIO: empezamos con un arreglo vacío.
// ¿Por qué? La consigna pide que los estudiantes se registren mediante POST,
// en lugar de cargar diez estudiantes ficticios al iniciar el servidor.
const listaEstudiantes: Estudiante[] = [];

// ID AUTOMÁTICO
// El primer estudiante recibirá el ID 1.
// Math.max(0, ...) permite calcular el máximo incluso con el arreglo vacío.
let siguienteId =
  Math.max(0, ...listaEstudiantes.map((estudiante) => estudiante.id)) + 1;

// VALIDACIÓN DE DATOS
// CAMBIO: validamos nombre, email y bootcamp.
// ¿Por qué? Son los campos del nuevo modelo solicitado por FUNVAL.
// Devuelve un mensaje si hay un error y null si los datos son válidos.
function validarEstudiante(body: unknown): string | null {
  // Comprobamos que el body sea un objeto, no null ni un arreglo.
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return "El cuerpo debe ser un objeto JSON.";
  }

  // Tratamos las propiedades como desconocidas hasta validarlas.
  const datos = body as Record<string, unknown>;

  if (
    typeof datos.nombre !== "string" ||
    !datos.nombre.trim()
  ) {
    return "El nombre es obligatorio y debe ser texto.";
  }

  // REQUISITO FUNVAL: si falta el email, POST debe responder 400.
  if (
    typeof datos.email !== "string" ||
    !datos.email.trim()
  ) {
    return "El email es obligatorio y debe ser texto.";
  }

  if (
    typeof datos.bootcamp !== "string" ||
    !datos.bootcamp.trim()
  ) {
    return "El bootcamp es obligatorio y debe ser texto.";
  }

  return null;
}

// GET /api/estudiantes
// Retorna la lista completa. Si no hay estudiantes, devuelve un arreglo vacío.
app.get(
  "/api/estudiantes",
  (_req: Request, res: Response) => {
    return res.status(200).json({
      ok: true,
      mensaje: "Lista de estudiantes de FUNVAL",
      total: listaEstudiantes.length,
      data: listaEstudiantes,
    });
  }
);

// GET /api/estudiantes/:id
// Conservamos este endpoint adicional del código anterior.
// Permite consultar un estudiante por su ID, aunque no es obligatorio
// en la consigna del entregable.
app.get(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Un ID debe ser un entero positivo.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const estudiante = listaEstudiantes.find((e) => e.id === id);

    // 404 significa que el ID no corresponde a ningún estudiante.
    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    return res.status(200).json({
      ok: true,
      data: estudiante,
    });
  }
);

// POST /api/estudiantes
// Registra un estudiante nuevo y devuelve 201 Created.
app.post(
  "/api/estudiantes",
  (req: Request, res: Response) => {
    const error = validarEstudiante(req.body);

    // Si falta algún dato obligatorio, respondemos 400 Bad Request.
    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    // La validación anterior permite construir el nuevo registro.
    const datos = req.body as Omit<Estudiante, "id">;

    const nuevoEstudiante: Estudiante = {
      id: siguienteId++,
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      bootcamp: datos.bootcamp.trim(),
    };

    listaEstudiantes.push(nuevoEstudiante);

    return res.status(201).json({
      ok: true,
      mensaje: "Estudiante registrado con éxito.",
      data: nuevoEstudiante,
    });
  }
);

// PUT /api/estudiantes/:id
// Busca un estudiante y reemplaza sus datos con los recibidos en el body.
app.put(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex((e) => e.id === id);

    // REQUISITO FUNVAL: responder 404 si el ID no existe.
    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    const datos = req.body as Omit<Estudiante, "id">;

    // Conservamos el ID de la URL: el cliente no puede cambiarlo desde el body.
    const estudianteActualizado: Estudiante = {
      id,
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      bootcamp: datos.bootcamp.trim(),
    };

    listaEstudiantes[indice] = estudianteActualizado;

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante actualizado con éxito.",
      data: estudianteActualizado,
    });
  }
);

// DELETE /api/estudiantes/:id
// Elimina al estudiante que corresponda al ID indicado.
app.delete(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex((e) => e.id === id);

    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    // splice elimina el registro del arreglo y devuelve los elementos quitados.
    const [estudianteEliminado] = listaEstudiantes.splice(indice, 1);

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante eliminado con éxito.",
      data: estudianteEliminado,
    });
  }
);

// MIDDLEWARE GLOBAL DE ERRORES
// Debe registrarse después de las rutas para recibir los errores que se propaguen.
const manejarErrores: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  // Si la respuesta ya empezó, dejamos que Express gestione el error.
  if (res.headersSent) {
    next(error);
    return;
  }

  // Express identifica los errores del parser JSON mediante la propiedad type.
  const tipoError =
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof error.type === "string"
      ? error.type
      : undefined;

  // JSON mal formado: 400 Bad Request.
  if (tipoError === "entity.parse.failed") {
    res.status(400).json({
      ok: false,
      mensaje: "El cuerpo de la solicitud contiene JSON inválido.",
    });
    return;
  }

  // Cuerpo demasiado grande: 413 Content Too Large.
  if (tipoError === "entity.too.large") {
    res.status(413).json({
      ok: false,
      mensaje: "El cuerpo de la solicitud excede el tamaño permitido.",
    });
    return;
  }

  // Los errores no previstos se registran en la terminal.
  console.error("Error interno al procesar la solicitud:", error);

  res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor.",
  });
};

// El middleware de errores va después de registrar las rutas.
app.use(manejarErrores);

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
