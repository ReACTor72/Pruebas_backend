import {DataTypes} from "sequelize";
import { sequelize } from "../database/db.js";

export const IngresoDetalle = sequelize.define(
    "ingreso_detalles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lote: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      precioVenta: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      saldoProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  

  