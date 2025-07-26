import { Empleado } from "../models/Empleado.js"

//listar registros
export const listarEmpleados = async (req, res) => {
    try{
        const clientes = await Empleado.findAll()
        res.status(200).json({
            message: "Lista de Clientes",
            ok: true,
            status: 200,
            body: clientes,
    });
    }
    
    catch(error){
        return res.status(500).json({message: error.messaje});
   }   
}

//crear registro
export const crearEmpleado = async (req, res) => {
    try{
        const { nombre_cliente,
            nombre,
            direccion,
            telefono,
            celular,
            email,
            estado,
            } = req.body
    
        const crearCliente = await Empleado.create({
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
        return res.status(500).json({message: error.messaje});
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
            return res.status(500).json({message: error.messaje});
       }
}

//actualizar registro
export const actualizarEmpleado = async (req, res) => {
    const {id} = req.params
    try{
        const empleado = await Empleado.findOne({
            where: {id},
        });
        Empleado.set(req.body);
        await empleado.save();
        
        res.status(200).json(cliente);
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};

