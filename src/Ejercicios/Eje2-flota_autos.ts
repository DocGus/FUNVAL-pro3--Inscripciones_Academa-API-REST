
import { Router, Request, Response } from "express";

// ==========================================
// EJERCICIO 2: SISTEMA DE CONTROL DE FLOTA
// ==========================================

// 1. INTERFAZ Y MODELO DE DATOS

interface Vehiculo {
    id: number;
    placa: string;
    modelo: string;
    kilometraje: number;
    estado: "activo" | "mantenimiento";
}

// 2. SIMULACIÓN DE BASE DE DATOS EN MEMORIA

let listaVehiculos: Vehiculo[] = [
    {
        id: 1,
        placa: "ABC-123",
        modelo: "Mercedes-Benz Sprinter",
        kilometraje: 45000,
        estado: "activo"
    },
    {
        id: 2,
        placa: "XYZ-789",
        modelo: "Volkswagen Crafter",
        kilometraje: 72000,
        estado: "mantenimiento"
    },
    {
        id: 3,
        placa: "DEF-456",
        modelo: "Ford Transit",
        kilometraje: 31500,
        estado: "activo"
    }
];

// 3. CONFIGURACIÓN DEL ROUTER

const vehiculosRouter = Router();

// ==========================================
// GET: LISTAR TODOS LOS VEHÍCULOS
// GET /api/vehiculos
// ==========================================

vehiculosRouter.get("/", (_req: Request, res: Response): void => {
    res.status(200).json(listaVehiculos);
});

// ==========================================
// GET: BUSCAR VEHÍCULO POR ID
// GET /api/vehiculos/:id
// ==========================================

vehiculosRouter.get("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const vehiculo = listaVehiculos.find(
        (vehiculo) => vehiculo.id === id
    );

    if (!vehiculo) {
        res.status(404).json({
            error: "Vehículo no encontrado."
        });
        return;
    }

    res.status(200).json(vehiculo);
});

// ==========================================
// POST: REGISTRAR UN VEHÍCULO
// POST /api/vehiculos
// ==========================================

vehiculosRouter.post("/", (req: Request, res: Response): void => {
    const { placa, modelo, kilometraje, estado } = req.body;

    const nuevoVehiculo: Vehiculo = {
        id: listaVehiculos.length > 0
            ? Math.max(...listaVehiculos.map((vehiculo) => vehiculo.id)) + 1
            : 1,
        placa,
        modelo,
        kilometraje,
        estado
    };

    listaVehiculos.push(nuevoVehiculo);

    res.status(201).json({
        mensaje: "Vehículo registrado correctamente.",
        vehiculo: nuevoVehiculo
    });
});

// ==========================================
// PUT: ACTUALIZAR UN VEHÍCULO
// PUT /api/vehiculos/:id
// ==========================================

vehiculosRouter.put("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const indice = listaVehiculos.findIndex(
        (vehiculo) => vehiculo.id === id
    );

    if (indice === -1) {
        res.status(404).json({
            error: "Vehículo no encontrado."
        });
        return;
    }

    const { placa, modelo, kilometraje, estado } = req.body;

    const vehiculoActualizado: Vehiculo = {
        id,
        placa,
        modelo,
        kilometraje,
        estado
    };

    listaVehiculos[indice] = vehiculoActualizado;

    res.status(200).json({
        mensaje: "Vehículo actualizado correctamente.",
        vehiculo: vehiculoActualizado
    });
});

// ==========================================
// DELETE: DAR DE BAJA UN VEHÍCULO
// DELETE /api/vehiculos/:id
// ==========================================

vehiculosRouter.delete("/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
        return;
    }

    const indice = listaVehiculos.findIndex(
        (vehiculo) => vehiculo.id === id
    );

    if (indice === -1) {
        res.status(404).json({
            error: "Vehículo no encontrado."
        });
        return;
    }

    const [vehiculoEliminado] = listaVehiculos.splice(indice, 1);

    res.status(200).json({
        mensaje: "Vehículo dado de baja correctamente.",
        vehiculo: vehiculoEliminado
    });
});

// ==========================================
// EXPORTAR ROUTER
// ==========================================

export default vehiculosRouter;
