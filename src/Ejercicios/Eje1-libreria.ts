
import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// Interfaz que define la estructura de un libro
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  paginas: number;
  disponible: boolean;
}

// Datos que recibimos al crear o actualizar un libro
type DatosLibro = Omit<Libro, "id">;

// Base de datos simulada en memoria
const libros: Libro[] = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    paginas: 471,
    disponible: true,
  },
  {
    id: 2,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    paginas: 863,
    disponible: true,
  },
  {
    id: 3,
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    paginas: 96,
    disponible: false,
  },
];

// GET /api/libros
// Listar todos los libros
router.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    ok: true,
    mensaje: "Lista de libros de la biblioteca digital",
    total: libros.length,
    data: libros,
  });
});

// GET /api/libros/:id
// Buscar un libro por ID
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El ID debe ser un número entero positivo.",
    });
  }

  const libro = libros.find((libro) => libro.id === id);

  if (!libro) {
    return res.status(404).json({
      ok: false,
      mensaje: `El libro con ID ${id} no existe.`,
    });
  }

  return res.status(200).json({
    ok: true,
    data: libro,
  });
});

// POST /api/libros
// Registrar un libro nuevo
router.post("/", (req: Request, res: Response) => {
  const datos = req.body as DatosLibro;

  const nuevoLibro: Libro = {
    id:
      libros.length > 0
        ? Math.max(...libros.map((libro) => libro.id)) + 1
        : 1,
    titulo: datos.titulo,
    autor: datos.autor,
    paginas: datos.paginas,
    disponible: datos.disponible,
  };

  libros.push(nuevoLibro);

  return res.status(201).json({
    ok: true,
    mensaje: "Libro registrado correctamente.",
    data: nuevoLibro,
  });
});

// PUT /api/libros/:id
// Actualizar los datos de un libro
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El ID debe ser un número entero positivo.",
    });
  }

  const indice = libros.findIndex((libro) => libro.id === id);

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `El libro con ID ${id} no existe.`,
    });
  }

  const datos = req.body as DatosLibro;

  const libroActualizado: Libro = {
    id,
    titulo: datos.titulo,
    autor: datos.autor,
    paginas: datos.paginas,
    disponible: datos.disponible,
  };

  libros[indice] = libroActualizado;

  return res.status(200).json({
    ok: true,
    mensaje: "Libro actualizado correctamente.",
    data: libroActualizado,
  });
});

// DELETE /api/libros/:id
// Eliminar un libro
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El ID debe ser un número entero positivo.",
    });
  }

  const indice = libros.findIndex((libro) => libro.id === id);

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `El libro con ID ${id} no existe.`,
    });
  }

  const [libroEliminado] = libros.splice(indice, 1);

  return res.status(200).json({
    ok: true,
    mensaje: "Libro eliminado correctamente.",
    data: libroEliminado,
  });
});

// Exportar el router para conectarlo con src/index.ts
export default router;
