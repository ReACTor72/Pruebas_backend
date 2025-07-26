import {DataTypes} from "sequelize"
import { sequelize } from "../database/db.js";
import { Producto } from "./Producto.js";

export const Unidad=sequelize.define(
    'unidades',
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        nombre:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },
    {
      timestamps: false,
    }
);

Unidad.hasMany(Producto, {
    foreignKey:'unidad_id',
    sourceKey:'id',
    as: 'producto',
});
Producto.belongsTo(Unidad,{
    foreignKey:'unidad_id',
    targetKey:'id',
    as: 'unidad'
});