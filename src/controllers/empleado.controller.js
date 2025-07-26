import { Empleado } from "../models/Empleado.js"

//listar registros
export const listarEmpleados = async (req, res) => {
    try{
        const empleados = await Empleado.findAll()
        res.status(200).json({
            message: "Lista de Empleados",
            ok: true,
            status: 200,
            body: empleados,
    });
    }
    
    catch(error){
        return res.status(500).json({message: error.message});
   }   
}

//crear registro
export const crearEmpleado = async (req, res) => {
    try{
        const {
            nombre,
            direccion,
            telefono,
            celular,
            email,
            estado,
            } = req.body
    
        const crearEmpleado = await Empleado.create({
            nombre,
            direccion,
            telefono,
            celular,
            email,
            estado,
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Empleado Regitrado",
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
   }
}

export const verEmpleado = async (req, res) => {
    const {id} = req.params
       try{
           const empleado = await Empleado.findOne({
               where: {id},
           });
           res.status(200).json(empleado);
       }
       catch(error){
            return res.status(500).json({message: error.message});
       }
}

//actualizar registro
export const actualizarEmpleado = async (req, res) => {
    const {id} = req.params
    try{
        const empleado = await Empleado.findOne({
            where: {id},
        });
        empleado.set(req.body);
        await empleado.save();
        
        res.status(200).json({
            message: "Registro Actualizado",
            ok: true,
            status: 200,
            body: empleado,
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};

