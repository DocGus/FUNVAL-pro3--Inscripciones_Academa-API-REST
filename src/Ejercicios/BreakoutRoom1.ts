
import { Router, Request, Response, NextFunction } from "express";

// ==========================================
// 1. MODELO DE DATOS: PRODUCTO
// ==========================================

// Una interfaz define la estructura que debe tener un objeto Producto.
// TypeScript utiliza esta definición para detectar errores mientras escribimos
// el código. No valida automáticamente los JSON que llegan por HTTP.
//
// id: identificador único del producto.
// nombre: nombre descriptivo del producto.
// precio: precio de venta.
// stock: cantidad disponible en inventario.
// activo: indica si el producto está habilitado o deshabilitado.
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    activo: boolean;
}

// ==========================================
// 2. DATOS SIMULADOS EN MEMORIA
// ==========================================

// Este arreglo funciona como una pequeña base de datos temporal.
// Todos los endpoints de este archivo trabajan sobre el mismo arreglo.
//
// Como los datos están en memoria, se restablecen cuando reiniciamos
// el servidor. No se utiliza una base de datos persistente.
const productos: Producto[] = [
    {
        id: 1,
        nombre: "Teclado mecánico",
        precio: 850,
        stock: 10,
        activo: true,
    },
    {
        id: 2,
        nombre: "Mouse inalámbrico",
        precio: 350,
        stock: 20,
        activo: true,
    },
    {
        id: 3,
        nombre: "Monitor",
        precio: 2500,
        stock: 5,
        activo: false,
    },
];

// ==========================================
// 3. MIDDLEWARE DE VALIDACIÓN DE PRODUCTOS
// ==========================================

// Un middleware es una función que Express ejecuta durante una solicitud HTTP.
//
// Recibe tres elementos:
// - req: contiene la información enviada por el cliente.
// - res: permite construir y enviar una respuesta HTTP.
// - next: permite continuar al siguiente middleware o controlador.
//
// Esta función se utilizará en POST y PUT para revisar el nombre y el precio
// antes de permitir que el controlador modifique el arreglo.
export const validarProducto = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body: unknown = req.body;

    if (
        typeof body !== "object" ||
        body === null ||
        Array.isArray(body)
    ) {
        res.status(400).json({
            error: "El cuerpo debe ser un objeto JSON.",
        });
        return;
    }

    const datos = body as Record<string, unknown>;
    const { nombre, precio, stock, activo } = datos;

    // Comprobamos que el nombre exista, sea texto y no esté vacío.
    // trim() elimina los espacios al principio y al final.
    if (
        !nombre ||
        typeof nombre !== "string" ||
        nombre.trim() === ""
    ) {
        // HTTP 400 significa que la solicitud contiene datos inválidos.
        // Después de responder, return evita que se ejecute el resto
        // de este middleware.
        res.status(400).json({
            error: "El nombre es obligatorio y debe ser texto.",
        });
        return;
    }

    // El precio debe ser un número mayor que cero.
    // Un valor como "850" enviado como texto no supera esta comprobación.
    if (
        typeof precio !== "number" ||
        !Number.isFinite(precio) ||
        precio <= 0
    ) {
        res.status(400).json({
            error: "El precio debe ser un número mayor a 0.",
        });
        return;
    }

    if (
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        res.status(400).json({
            error: "El stock debe ser un número entero mayor o igual a 0.",
        });
        return;
    }

    if (activo !== undefined && typeof activo !== "boolean") {
        res.status(400).json({
            error: "El campo activo debe ser true o false.",
        });
        return;
    }

    // Si las dos comprobaciones se superan, permitimos continuar.
    // Express ejecutará el siguiente middleware o el controlador de la ruta.
    next();
};

// ==========================================
// 4. MIDDLEWARE DE CONTROL DE ROLES
// ==========================================

// Este middleware protege las operaciones de eliminación.
//
// El parámetro rolMinimo determina el permiso requerido:
// - "MODERADOR": permite MODERADOR o ADMIN.
// - "ADMIN": permite exclusivamente ADMIN.
//
// Se devuelve una función porque necesitamos configurar el rol requerido
// cuando registramos cada ruta, por ejemplo verificarRol("ADMIN").
export const verificarRol = (
    rolMinimo: "MODERADOR" | "ADMIN"
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        // Leemos la cabecera HTTP personalizada x-rol.
        // Por ejemplo: x-rol: MODERADOR
        //
        // Express normaliza los nombres de las cabeceras, por eso usamos
        // req.headers["x-rol"].
        const rol = req.headers["x-rol"];

        // Determinamos si el rol recibido tiene permiso para continuar.
        //
        // Para operaciones de ADMIN, solamente aceptamos exactamente ADMIN.
        // Para operaciones de MODERADOR, aceptamos MODERADOR o ADMIN.
        const tienePermiso =
            rolMinimo === "ADMIN"
                ? rol === "ADMIN"
                : rol === "MODERADOR" || rol === "ADMIN";

        if (!tienePermiso) {
            // HTTP 403 significa que la solicitud no está autorizada.
            // El return impide continuar hacia la operación protegida.
            res.status(403).json({
                error:
                    rolMinimo === "ADMIN"
                        ? "Acceso denegado. Se requiere rol ADMIN."
                        : "Acceso denegado. Se requiere rol MODERADOR o ADMIN.",
            });
            return;
        }

        // El rol tiene permiso: Express puede ejecutar el controlador.
        next();
    };
};

// ==========================================
// 5. ROUTER DE PRODUCTOS
// ==========================================

// Router permite agrupar endpoints relacionados en un módulo independiente.
// En index.ts registramos este router bajo /api/productos.
//
// Por eso, una ruta local como "/" estará disponible como /api/productos.
const router = Router();

// ==========================================
// 6. GET: LISTAR PRODUCTOS ACTIVOS
// ==========================================

// Endpoint final: GET /api/productos
//
// filter() crea un nuevo arreglo con los productos que cumplen la condición.
// En este caso, solo devolvemos los que tienen activo === true.
// El arreglo original no se modifica.
router.get(
    "/",
    (_req: Request, res: Response): void => {
        const productosActivos = productos.filter(
            (producto) => producto.activo
        );

        // HTTP 200 indica que la consulta se atendió correctamente.
        res.status(200).json(productosActivos);
    }
);

// ==========================================
// 7. GET: BUSCAR PRODUCTO POR ID
// ==========================================

// Endpoint final: GET /api/productos/:id
//
// El parámetro :id forma parte de la URL.
// Por ejemplo: /api/productos/2
router.get(
    "/:id",
    (req: Request, res: Response): void => {
        // Los parámetros de URL llegan como texto.
        // Number() intenta convertir el texto a número.
        const id = Number(req.params.id);

        // Rechazamos identificadores que no sean enteros positivos.
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: "El ID debe ser un número entero positivo.",
            });
            return;
        }

        // find() devuelve el primer producto que cumple la condición.
        // En este endpoint, los productos inactivos no se muestran.
        const producto = productos.find(
            (producto) => producto.id === id && producto.activo
        );

        // Si find() no encuentra coincidencias, devuelve undefined.
        if (!producto) {
            res.status(404).json({
                error: "Producto no encontrado.",
            });
            return;
        }

        res.status(200).json(producto);
    }
);

// ==========================================
// 8. POST: CREAR PRODUCTO
// ==========================================

// Endpoint final: POST /api/productos
//
// Express ejecuta primero validarProducto.
// Si responde con un error, este controlador no se ejecuta.
// Si llama a next(), continuamos con la creación.
router.post(
    "/",
    validarProducto,
    (req: Request, res: Response): void => {
        // Extraemos los campos enviados en el JSON.
        const { nombre, precio, stock, activo } = req.body;

        // Calculamos el siguiente ID a partir del mayor ID existente.
        // Así evitamos reutilizar un ID si el último producto fue eliminado.
        const nuevoId =
            productos.length > 0
                ? Math.max(...productos.map((producto) => producto.id)) + 1
                : 1;

        // Construimos un objeto con la estructura Producto.
        const nuevoProducto: Producto = {
            id: nuevoId,
            nombre: nombre.trim(),
            precio,
            stock,
            // Si activo no fue proporcionado, lo establecemos en true.
            activo: activo ?? true,
        };

        // push() añade el nuevo objeto al arreglo compartido.
        productos.push(nuevoProducto);

        // HTTP 201 indica que se creó un recurso.
        res.status(201).json(nuevoProducto);
    }
);

// ==========================================
// 9. PUT: ACTUALIZAR PRODUCTO
// ==========================================

// Endpoint final: PUT /api/productos/:id
//
// Primero validamos el cuerpo y después buscamos el producto.
// Esta implementación sigue la validación básica del taller.
router.put(
    "/:id",
    validarProducto,
    (req: Request, res: Response): void => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: "El ID debe ser un número entero positivo.",
            });
            return;
        }

        // findIndex() devuelve la posición del producto en el arreglo.
        // Solamente permitimos actualizar productos que estén activos.
        const indice = productos.findIndex(
            (producto) => producto.id === id && producto.activo
        );

        if (indice === -1) {
            res.status(404).json({
                error: "Producto no encontrado.",
            });
            return;
        }

        const productoExistente = productos[indice];

        if (!productoExistente) {
            res.status(404).json({
                error: "Producto no encontrado.",
            });
            return;
        }

        const { nombre, precio, stock, activo } = req.body;

        // Creamos el objeto actualizado conservando el mismo ID.
        const productoActualizado: Producto = {
            id,
            nombre: nombre.trim(),
            precio,
            stock,
            // Si activo no fue enviado, conservamos su valor anterior.
            activo: activo ?? productoExistente.activo,
        };

        // Sustituimos el objeto que ocupaba esa posición del arreglo.
        productos[indice] = productoActualizado;

        res.status(200).json(productoActualizado);
    }
);

// ==========================================
// 10. PATCH: BORRADO LÓGICO (SOFT DELETE)
// ==========================================

// Endpoint final: PATCH /api/productos/soft/:id
//
// PATCH se utiliza aquí para cambiar parcialmente el estado del producto.
// No eliminamos el objeto: únicamente cambiamos activo a false.
//
// verificarRol("MODERADOR") acepta MODERADOR y ADMIN.
router.patch(
    "/soft/:id",
    verificarRol("MODERADOR"),
    (req: Request, res: Response): void => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: "El ID debe ser un número entero positivo.",
            });
            return;
        }

        // Buscamos el registro aunque ya esté inactivo.
        // Esto nos permite diferenciar entre inexistente e inactivo.
        const producto = productos.find(
            (producto) => producto.id === id
        );

        if (!producto) {
            res.status(404).json({
                error: "Producto no encontrado.",
            });
            return;
        }

        if (!producto.activo) {
            res.status(400).json({
                error: "El producto ya está inactivo.",
            });
            return;
        }

        // El registro permanece en el arreglo, pero deja de estar activo.
        producto.activo = false;

        res.status(200).json({
            mensaje: "Producto desactivado correctamente.",
            data: producto,
        });
    }
);

// ==========================================
// 11. DELETE: BORRADO DEFINITIVO (HARD DELETE)
// ==========================================

// Endpoint final: DELETE /api/productos/hard/:id
//
// Esta operación elimina el registro del arreglo.
// Solo un cliente que presente x-rol: ADMIN pasa el middleware.
// El borrado es definitivo dentro de este arreglo en memoria.
router.delete(
    "/hard/:id",
    verificarRol("ADMIN"),
    (req: Request, res: Response): void => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: "El ID debe ser un número entero positivo.",
            });
            return;
        }

        // Buscamos el producto sin filtrar por activo.
        // Así también se puede eliminar definitivamente uno inactivo.
        const indice = productos.findIndex(
            (producto) => producto.id === id
        );

        if (indice === -1) {
            res.status(404).json({
                error: "Producto no encontrado.",
            });
            return;
        }

        // splice() elimina un elemento del arreglo en la posición indicada.
        // El elemento eliminado se devuelve dentro de un arreglo.
        const [productoEliminado] = productos.splice(indice, 1);

        res.status(200).json({
            mensaje: "Producto eliminado definitivamente.",
            data: productoEliminado,
        });
    }
);

// ==========================================
// 12. EXPORTAR EL ROUTER
// ==========================================

// Exportamos el router para que index.ts pueda registrarlo:
//
// app.use("/api/productos", productosRouter);
//
// No iniciamos un servidor aquí, porque el servidor principal ya existe.
export default router;
