
import express from "express";
import type { Request, Response } from "express";
import librosRouter from "./Ejercicios/Ejercicio1";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/libros", librosRouter);

interface Estudiante {
  id: number;
  nombre: string;
  curso: string;
  activo: boolean;
}

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

let siguienteId =
  Math.max(0, ...listaEstudiantes.map((estudiante) => estudiante.id)) + 1;

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
    typeof datos.curso !== "string" ||
    !datos.curso.trim()
  ) {
    return "El curso es obligatorio y debe ser texto.";
  }

  if (typeof datos.activo !== "boolean") {
    return "El campo activo debe ser true o false.";
  }

  return null;
}

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

app.get(
  "/api/estudiantes/:id",
  (req: Request, res: Response) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const estudiante = listaEstudiantes.find(
      (e) => e.id === id
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

app.post(
  "/api/estudiantes",
  (req: Request, res: Response) => {

    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    const { nombre, curso, activo } = req.body as Estudiante;

    const nuevoEstudiante: Estudiante = {
      id: siguienteId++,
      nombre: nombre.trim(),
      curso: curso.trim(),
      activo,
    };

    listaEstudiantes.push(nuevoEstudiante);

    return res.status(201).json({
      ok: true,
      mensaje: "Estudiante registrado con éxito.",
      data: nuevoEstudiante,
    });
  }
);

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

    const indice = listaEstudiantes.findIndex(
      (e) => e.id === id
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

    const { nombre, curso, activo } = req.body as Estudiante;

    const estudianteActualizado: Estudiante = {
      id,
      nombre: nombre.trim(),
      curso: curso.trim(),
      activo,
    };

    listaEstudiantes[indice] = estudianteActualizado;

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante actualizado con éxito.",
      data: estudianteActualizado,
    });
  }
);

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

    const indice = listaEstudiantes.findIndex(
      (e) => e.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    const [estudianteEliminado] = listaEstudiantes.splice(
      indice,
      1
    );

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante eliminado con éxito.",
      data: estudianteEliminado,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
