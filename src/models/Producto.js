import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
import { IngresoDetalle } from "./IngresoDetalles.js";
import { VentaDetalle } from "./VentaDetalles.js";
// Definir el modelo Producto sin la relación a Categoria por ahora
export const Producto = sequelize.define(
  "productos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
    timestamps: false,
  }
);


Producto.hasMany(IngresoDetalle, {
    foreignKey:'producto_id',
    sourceKey:'id',
  });
  IngresoDetalle.belongsTo(Producto,{
    foreignKey:'producto_id',
    targetKey:'id',
  });
// Relaciones con Ingreso y Venta
Producto.hasMany(VentaDetalle, {
  foreignKey: "producto_id",
  sourceKey: "id",
});
VentaDetalle.belongsTo(Producto, {
  foreignKey: "producto_id",
  targetKey: "id",
});

