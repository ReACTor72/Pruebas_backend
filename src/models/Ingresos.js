import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
import { Producto } from "./Producto.js";
import { IngresoDetalle } from "./IngresoDetalles.js";

export const Ingreso = sequelize.define(
  "ingresos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaIngreso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    montoTotal: {
      type: DataTypes.FLOAT,
      allowNull:false,
    },
  },
  {
    timestamps: false,
  }
);

Ingreso.hasMany(IngresoDetalle, {
  foreignKey:'ingreso_id',
  sourceKey:'id',
});
IngresoDetalle.belongsTo(Ingreso,{
  foreignKey:'ingreso_id',
  targetKey:'id',
});