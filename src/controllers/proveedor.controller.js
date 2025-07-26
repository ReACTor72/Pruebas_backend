import { Proveedor } from "../models/Proveedor.js";

// Función registrar nuevo proveedor
export async function registrarProveedor(req, res) {
  const {
    nombre,
    nombre_contacto,
    direccion,
    telefono,
    celular,
    email,
    estado,
  } = req.body;

  try {
    const newProveedor = await Proveedor.create({
      nombre,
      nombre_contacto,
      direccion,
      telefono,
      celular,
      email,
      estado,
    });
    res.status(201).json(newProveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Función buscar proveedor por ID
export async function buscarProveedor(req, res) {
  const { id } = req.params;

  try {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Función editar proveedor
export async function editarProveedor(req, res) {
  const { id } = req.params;
  const {
    nombre,
    nombre_contacto,
    direccion,
    telefono,
    celular,
    email,
    estado,
  } = req.body;

  try {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    proveedor.nombre = nombre;
    proveedor.nombre_contacto = nombre_contacto;
    proveedor.direccion = direccion;
    proveedor.telefono = telefono;
    proveedor.celular = celular;
    proveedor.email = email;
    proveedor.estado = estado;

    await proveedor.save();

    res.json(proveedor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
export async function listarProveedor(req, res) {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}