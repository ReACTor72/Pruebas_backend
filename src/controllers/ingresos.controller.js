import { sequelize } from "../database/db.js";
import { Ingreso } from "../models/Ingresos.js";
import { IngresoDetalle } from "../models/IngresoDetalles.js";
import { Producto } from "../models/Producto.js";
import { Proveedor } from "../models/Proveedor.js"

// Función listar todos los ingresos
export async function listarIngresos(req, res) {
  try {
    const ingresos = await Ingreso.findAll({
    
      include: [
      {
        model: Proveedor, // El modelo de la Proveedor
        as: "proveedor",
        attributes: ["id", "nombre"], // Atributos que deseas incluir del Proveedor
      },
    ],
  });
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Función registrar nuevo ingreso
export async function registrarIngreso(req, res) {
  const t = await sequelize.transaction();

  let newDetalle;
  let lote;
  let producto, updateStock;
  const { fechaIngreso, proveedor_id, detalles} = req.body;

  // Calcular montoTotal basado en los detalles
  const montoTotal = detalles.reduce((acc, detalle) => acc + detalle.total, 0);

  try {
    const newIngreso = await Ingreso.create({
      fechaIngreso,
      montoTotal,
      proveedor_id,   
    },
    { transaction: t }
  );
  
  for (const detalle of detalles) {
    lote=await IngresoDetalle.count({
                   where: {producto_id: detalle.producto_id},
               });
    producto=await Producto.findOne({
      where: {id:detalle.producto_id},
  });
    updateStock=await Producto.update({stock:parseInt(producto.stock)+parseInt(detalle.cantidad)},
      {where: {id: detalle.producto_id}});
    newDetalle = await IngresoDetalle.create({
      producto_id: detalle.producto_id,
      lote: lote,
      cantidad: detalle.cantidad,
      precio: detalle.precio,
      precioVenta: detalle.precioVenta,
      saldoProducto: detalle.saldoProducto,
      ingreso_id: newIngreso.id
    },{ transaction: t });
  }
   // Crear productos asociados al ingreso 
   /* const Newdetalles = await IngresoDetalle.bulkCreate(
    detalles.map(detalle => ({
      producto_id: detalle.producto_id,
      lote: detalle.lote,
      cantidad: detalle.cantidad,
      precio: detalle.precio,
      precioVenta: detalle.precioVenta,
      saldoProducto: detalle.saldoProducto,
      ingreso_id: newIngreso.id // Asociamos cada post al usuario por su ID
    })),{ transaction: t }
  ); */
   
  // Si ambos registros se crean correctamente, confirmamos la transacción
  await t.commit();

    res.status(201).json({mensaje: 'Ingreso Registrado correctamente',
      newIngreso});
  } catch (error) {
    await t.rollback();
    console.error('Error al crear ingreso:', error);
    res.status(500).json({ message: 'Error al guardar el ingreso', error: error.message });
  }
}

// Función buscar ingreso por ID
export async function buscarIngreso(req, res) {
  const { id } = req.params;

  try {
    const ingreso = await Ingreso.findByPk(id);
    if (!ingreso) {
      return res.status(404).json({ message: "Ingreso no encontrado" });
    }
    res.json(ingreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Función actualizar saldo de un ingreso
export async function actualizarSaldo(req, res) {
  const { id } = req.params;
  const { saldoProducto } = req.body;

  try {
    const ingreso = await Ingreso.findByPk(id);
    if (!ingreso) {
      return res.status(404).json({ message: "Ingreso no encontrado" });
    }

    ingreso.saldoProducto = saldoProducto;
    await ingreso.save();

    res.json(ingreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function obtenerDetalles(req, res) {
  const { ingresoId } = req.params;

  try {
    const detalles = await IngresoDetalle.findAll({
      where: { ingreso_id: ingresoId },
      include: [
        {
          model: Producto,
          as: "producto", // Asegúrate de definir esta relación en tu modelo
          attributes: ["id", "nombre"],
        },
      ],
    });

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: "No se encontraron detalles para este ingreso" });
    }

    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalles del ingreso", error: error.message });
  }
}

