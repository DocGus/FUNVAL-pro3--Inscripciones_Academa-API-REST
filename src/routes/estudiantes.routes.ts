
import { Router } from "express";
import type { Request, Response } from "express";

// Router independiente para todas las operaciones de estudiantes.
const estudiantesRouter = Router();

// Modelo de datos solicitado por FUNVAL.
interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

// Arreglo en memoria compartido por todos los endpoints de este router.
const listaEstudiantes: Estudiante[] = [];

// Generador de IDs automáticos. El primer estudiante tendrá ID 1.
let siguienteId = 1;

// Validamos el body de POST y PUT antes de guardar los datos.
function validarEstudiante(body: unknown): string | null {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return "El cuerpo debe ser un objeto JSON.";
  }

  const datos = body as Record<string, unknown>;

  if (
    typeof datos.nombre !== "string" ||
    !datos.nombre.trim()
  ) {
    return "El nombre es obligatorio y debe ser texto.";
  }

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
// GET /api/estudiantes?bootcamp=Frontend
// Devuelve todos los estudiantes o filtra por el bootcamp indicado.
estudiantesRouter.get(
  "/",
  (req: Request, res: Response) => {
    const bootcamp = req.query.bootcamp;

    // Aplicamos el filtro solo si recibimos bootcamp como texto.
    if (typeof bootcamp === "string") {
      const estudiantesFiltrados = listaEstudiantes.filter(
        (estudiante) =>
          estudiante.bootcamp.toLowerCase() === bootcamp.trim().toLowerCase()
      );

      return res.status(200).json({
        ok: true,
        mensaje: "Lista de estudiantes de FUNVAL",
        total: estudiantesFiltrados.length,
        data: estudiantesFiltrados,
      });
    }

    // Si no hay parámetro, devolvemos la lista completa.
    return res.status(200).json({
      ok: true,
      mensaje: "Lista de estudiantes de FUNVAL",
      total: listaEstudiantes.length,
      data: listaEstudiantes,
    });
  }
);

// GET /api/estudiantes/:id
// Busca un estudiante por su ID y devuelve 404 si no existe.
estudiantesRouter.get(
  "/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const estudiante = listaEstudiantes.find(
      (item) => item.id === id
    );

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
// Registra un estudiante y responde 201 Created.
estudiantesRouter.post(
  "/",
  (req: Request, res: Response) => {
    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

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
// Actualiza todos los campos del estudiante indicado.
estudiantesRouter.put(
  "/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex(
      (item) => item.id === id
    );

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
// Elimina el estudiante indicado.
estudiantesRouter.delete(
  "/:id",
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex(
      (item) => item.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    const [estudianteEliminado] = listaEstudiantes.splice(indice, 1);

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante eliminado con éxito.",
      data: estudianteEliminado,
    });
  }
);

// Exportamos el router para registrarlo en src/index.ts.
export default estudiantesRouter;
