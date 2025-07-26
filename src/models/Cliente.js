import { DataTypes, ForeignKeyConstraintError } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Venta } from './Ventas.js'

export const Cliente = sequelize.define(
    'clientes', 
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    estado: {
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    },
    estadoCredito: {
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    },
}, {
    timestamps: true,
    tableName: 'clientes',
});

Cliente.hasMany(Venta, {
    foreignKey: 'cliente_id',
    sourceKey: 'id'
});

Venta.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    targetId: 'id'
})
