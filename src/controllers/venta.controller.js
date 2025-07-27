
import { Sequelize, Op } from "sequelize";
import { sequelize } from "../database/db.js";
import { Venta } from "../models/Ventas.js"
import { VentaDetalle } from "../models/VentaDetalles.js"
import { Producto } from "../models/Producto.js";
import { IngresoDetalle } from "../models/IngresoDetalles.js";
import { Cliente } from "../models/Cliente.js"
import { Empleado } from "../models/Empleado.js";
//crear registro
export const createVenta = async (req, res) => {
    const t = await sequelize.transaction();
    let lote;
    let producto, updateStock;
    let newDetalle;
    const { monto, fechaVenta, metodoPago, tipoVenta, tipoEntrega, cliente_id, empleado_id, detalles } = req.body;

    try {
        const nuevaVenta = await Venta.create({
            monto,
            fechaVenta,
            metodoPago,
            tipoVenta,
            tipoEntrega,
            cliente_id,
            empleado_id
        },
            { transaction: t }
        );
        for (const detalle of detalles) {
            producto = await Producto.findOne({
                where: { id: detalle.producto_id },
            });
            updateStock = await Producto.update({ stock: parseInt(producto.stock) - parseInt(detalle.cantidad) },
                { where: { id: detalle.producto_id } });
            producto = await IngresoDetalle.findOne({
                where: { producto_id: detalle.producto_id, saldoProducto: { [Sequelize.Op.gt]: 0 } },
            });

            updateStock = await IngresoDetalle.update({ saldoProducto: parseInt(producto.saldoProducto) - parseInt(detalle.cantidad) },
                { where: { id: producto.id } });

            newDetalle = await VentaDetalle.create({
                producto_id: detalle.producto_id,
                cantidad: detalle.cantidad,
                precio: detalle.precio,
                total: detalle.total,
                venta_id: nuevaVenta.id
            }, { transaction: t });

        }

        // Si ambos registros se crean correctamente, confirmamos la transacción
        await t.commit();

        res.status(201).json({
            mensaje: 'Venta Registrada Correctamente',
            nuevaVenta
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Listar registros - SOLO CAMBIO: quitar la inclusión de detalles
export const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        {
          model: Cliente,
          attributes: ["id", "nombre_cliente"],
        },
        {
          model: Empleado,
          attributes: ["id", "nombre"],
        }
      ],
    });
    res.status(200).json(ventas);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// NUEVA FUNCIÓN: Obtener detalles de una venta específica
export const getVentaDetalles = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: Cliente,
          attributes: ["id", "nombre_cliente"],
        },
        {
          model: VentaDetalle,
          include: [{
            model: Producto,
            attributes: ['id', 'nombre']
          }]
        }
      ],
    });

    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.status(200).json({
      id: venta.id,
      fechaVenta: venta.fechaVenta,
      cliente: venta.cliente,
      venta_detalles: venta.venta_detalles,
      metodoPago: venta.metodoPago,
      tipoVenta: venta.tipoVenta,
      tipoEntrega: venta.tipoEntrega,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener detalles de venta",
      error: error.message 
    });
  }
}

//mostrar un solo registro
export const getVenta = async (req, res) => {
    const { id } = req.params
    try {
        const venta = await Venta.findOne({
            where: { id },
        });
        res.status(200).json(venta);
    }
    catch (error) {
        return res.status(500).json({ message: error.messaje });
    }
}

//actualizar registro
export const updateVenta = async (req, res) => {
    const { id } = req.params
    try {
        const venta = await Venta.findOne({
            where: { id }
        });
        if (!venta) {
        return res.status(404).json({
            message: "Venta no encontrada",
            ok: false,
        });
    }
        venta.set(req.body);
        await venta.save();

        res.status(201).json({
            message: "Registro Actualizado",
            ok: true,
            status: 201,
            body: venta,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}