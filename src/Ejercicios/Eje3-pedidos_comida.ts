
import { Router, Request, Response } from "express";

// ==========================================
// EJERCICIO 3: GESTIÓN DE PEDIDOS DE COMIDA
// ==========================================

// 1. INTERFAZ Y MODELO DE DATOS

interface Pedido {
    id: number;
    cliente: string;
    platillo: string;
    total: number;
    entregado: boolean;
}

// 2. SIMULACIÓN DE BASE DE DATOS EN MEMORIA

let listaPedidos: Pedido[] = [
    {
        id: 1,
        cliente: "Carlos Mendoza",
        platillo: "Hamburguesa clásica",
        total: 120,
        entregado: false
    },
    {
        id: 2,
        cliente: "Ana López",
        platillo: "Pizza de pepperoni",
        total: 180,
        entregado: true
    },
    {
        id: 3,
        cliente: "Miguel Torres",
        platillo: "Tacos al pastor",
        total: 95,
        entregado: false
    }
];

// 3. CONFIGURACIÓN DEL ROUTER

const pedidosRouter = Router();

// ==========================================
// GET: LISTAR TODOS LOS PEDIDOS
// GET /api/pedidos
// ==========================================

pedidosRouter.get("/", (_req: Request, res: Response): void => {
    res.status(200).json(listaPedidos);
});

// ==========================================
// GET: BUSCAR PEDIDO POR ID
// GET /api/pedidos/:id
// ==========================================

pedidosRouter.get("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const pedido = listaPedidos.find(
        (pedido) => pedido.id === id
    );

    if (!pedido) {
        res.status(404).json({
            error: "Pedido no encontrado."
        });
        return;
    }

    res.status(200).json(pedido);
});

// ==========================================
// POST: CREAR UN PEDIDO
// POST /api/pedidos
// ==========================================

pedidosRouter.post("/", (req: Request, res: Response): void => {
    const { cliente, platillo, total, entregado } = req.body;

    const nuevoPedido: Pedido = {
        id: listaPedidos.length > 0
            ? Math.max(...listaPedidos.map((pedido) => pedido.id)) + 1
            : 1,
        cliente,
        platillo,
        total,
        entregado
    };

    listaPedidos.push(nuevoPedido);

    res.status(201).json({
        mensaje: "Pedido creado correctamente.",
        pedido: nuevoPedido
    });
});

// ==========================================
// PUT: MODIFICAR UN PEDIDO
// PUT /api/pedidos/:id
// ==========================================

pedidosRouter.put("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const indice = listaPedidos.findIndex(
        (pedido) => pedido.id === id
    );

    if (indice === -1) {
        res.status(404).json({
            error: "Pedido no encontrado."
        });
        return;
    }

    const { cliente, platillo, total, entregado } = req.body;

    const pedidoActualizado: Pedido = {
        id,
        cliente,
        platillo,
        total,
        entregado
    };

    listaPedidos[indice] = pedidoActualizado;

    res.status(200).json({
        mensaje: "Pedido actualizado correctamente.",
        pedido: pedidoActualizado
    });
});

// ==========================================
// DELETE: CANCELAR UN PEDIDO
// DELETE /api/pedidos/:id
// ==========================================

pedidosRouter.delete("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const indice = listaPedidos.findIndex(
        (pedido) => pedido.id === id
    );

    if (indice === -1) {
        res.status(404).json({
            error: "Pedido no encontrado."
        });
        return;
    }

    const [pedidoCancelado] = listaPedidos.splice(indice, 1);

    res.status(200).json({
        mensaje: "Pedido cancelado correctamente.",
        pedido: pedidoCancelado
    });
});

// ==========================================
// EXPORTAR ROUTER
// ==========================================

export default pedidosRouter;
