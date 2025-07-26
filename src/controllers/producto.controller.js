import { Sequelize, Op} from "sequelize";
import { Producto } from "../models/Producto.js";
import { IngresoDetalle } from "../models/IngresoDetalles.js";
import { Categoria } from "../models/Categoria.js";
import { Unidad } from "../models/Unidad.js"


// Listar todos los productos con sus categorías
export async function listarProductos(req, res) {
  try {
    const productos = await Producto.findAll({
      attributes: ["id", "nombre", "descripcion", "stock", "imagen"],
      include: [
        {
          model: Categoria, // El modelo de la categoría
          as: "categoria",  // Alias de la relación definida en el modelo
          attributes: ["id", "nombre"], // Atributos que deseas incluir de la categoría
        },
        {
          model: Unidad,
          as: "unidad",
          attributes: ["id", "nombre"],
        }
        
      ],
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


export async function crearProducto(req, res) {
  const { nombre, descripcion, stock, categoria_id , unidad_id} = req.body;
  console.log("Datos recibidos:", { nombre, descripcion, stock, categoria_id, unidad_id });
  console.log("Imagen recibida:", req.file);

  try {
    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      return res.status(400).json({ message: "Categoría no encontrada" });
    }
    const unidad = await Unidad.findByPk(unidad_id);
    if (!unidad) {
      return res.status(400).json({ message: "Unidad no encontrada" });
    }

    // Obtener la ruta del archivo subido (si existe)
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Crear el producto en la base de datos
    const newProducto = await Producto.create({
      nombre,
      descripcion,
      stock,
      categoria_id,
      unidad_id,
      imagen,
    });

    res.status(201).json(newProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      message: error.message,
    });
  }
}


// Ver un producto por su ID
export async function verProducto(req, res) {
  const { id } = req.params;
  try {
    const producto = await Producto.findOne({
      where: { id },
    });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Editar un producto por su ID
export async function editarProducto(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, stock, categoria_id, unidad_id } = req.body;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }


    // Si se sube una nueva imagen, actualizarla; de lo contrario, mantener la anterior
    const imagen = req.file ? `/uploads/${req.file.filename}` : producto.imagen;

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.stock = stock;
    producto.categoria_id = categoria_id;
    producto.unidad_id = unidad_id;
    producto.imagen = imagen; // Actualizar la imagen

    await producto.save();

    res.status(200).json(producto); // Responder con el producto actualizado
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
export async function verPrecioProducto(req, res){
    const {id}=req.params;
    try{
        const producto= await Producto.findOne({
            where:{id},
            include:{
                model: IngresoDetalle,
                attributes: ['precioVenta'],
                where: {
                  saldoProducto: { [Sequelize.Op.gt]:0 }, 
                }, 
              }
        }
    );
   
        res.status(201).json(producto);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}