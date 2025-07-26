import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { VentaDetalle } from './VentaDetalles.js';
export const Venta = sequelize.define(
    'ventas', 
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    monto: {
        type: DataTypes.FLOAT(100, 2),
        allowNull: false,
    },
    fechaVenta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    metodoPago: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipoVenta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipoEntrega: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    estadoEntrega: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false,
    },
}, {
    timestamps: false,
});

Venta.hasMany(VentaDetalle, {
    foreignKey:'venta_id',
    sourceKey:'id',
  });
  VentaDetalle.belongsTo(Venta,{
    foreignKey:'venta_id',
    targetKey:'id',
  });

