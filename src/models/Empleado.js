import { DataTypes } from "sequelize"
import { sequelize } from "../database/db.js";
import { Venta } from "./Ventas.js";

export const Empleado=sequelize.define(
    'empleados',
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        nombre:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        direccion:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        telefono:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        celular:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        estado:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
    },
    {
      timestamps: false,
    }
);

Empleado.hasMany(Venta, {
    foreignKey:'empleado_id',
    sourceKey:'id',
});
Venta.belongsTo(Empleado,{
    foreignKey:'empleado_id',
    targetKey:'id',
});
 