import { Cliente } from "../models/Cliente.js"
import { Venta } from "../models/Ventas.js"

//listar registros
export const getClientes = async (req, res) => {
    try{
        const clientes = await Cliente.findAll()
        res.status(200).json(clientes);
    }
    
    catch(error){
        return res.status(500).json({message: error.message});
   }   
}

//crear registro
export const createCliente = async (req, res) => {
    try{
        const { nombre_cliente,
            direccion,
            celular,
            email,
            estado,
            estadoCredito} = req.body
    
        const crearCliente = await Cliente.create({
            nombre_cliente,
            direccion,
            celular,
            email,
            estado,
            estadoCredito
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Cliente Regitrado",
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
   }
}

export const getCliente = async (req, res) => {
    const {id} = req.params
       try{
           const cliente = await Cliente.findOne({
               where: {id},
           });
           res.status(200).json( cliente);
       }
       catch(error){
            return res.status(500).json({message: error.message});
       }
}

//actualizar registro
export const updateCliente = async (req, res) => {
    const {id} = req.params
    try{
        const cliente = await Cliente.findOne({
            where: {id},
        });
        cliente.set(req.body);
        await cliente.save();
        
        res.status(200).json({
            message: "Registro Actualizado",
            ok: true,
            status: 200,
            body: cliente,
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};

//mostrar compras de un cliente
//api/clientes/16/ventas
export const getClienteCompras = async (req, res) => {
    const {id} = req.params
    try{
        const ventas = await Venta.findAll({
            where: { cliente_id: id }
        });
        res.status(200).json(ventas); // <-- Directamente el array de ventas
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};
