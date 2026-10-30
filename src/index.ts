
import express from "express";
import type { ErrorRequestHandler, Request, Response } from "express";

// Conservamos las rutas que ya habías separado en otros archivos.
import librosRouter from "./Ejercicios/Eje1-libreria";
import productosRouter from "./Ejercicios/eje4-middleware";
import vehiculosRouter from "./Ejercicios/Eje2-flota_autos";
import pedidosRouter from "./Ejercicios/Eje3-pedidos_comida";
import estudiantesRouter from "./routes/estudiantes.routes";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger_output.json";

const app = express();
const PORT = 3000;

// MIDDLEWARE GLOBAL
// Debe ejecutarse antes de las rutas para que Express pueda interpretar
// los cuerpos JSON enviados en las peticiones POST y PUT.
app.use(express.json());

// Rutas independientes que ya existían en el proyecto.
app.use("/api/libros", librosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/vehiculos", vehiculosRouter);
app.use("/api/pedidos", pedidosRouter);
app.use("/api/estudiantes", estudiantesRouter);
// DOCUMENTACIÓN SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

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
