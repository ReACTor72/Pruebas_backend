import { Unidad } from "../models/Unidad.js";

export async function listarUnidades( req, res){
    try{
        const unidades=await Unidad.findAll();
        res.json(unidades);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function crearUnidad(req, res){
    const {nombre} = req.body;
    try{
        const newUnidad=await Unidad.create({
            nombre,            
        },{
            fields:['nombre']
        });
        res.status(201).json(newUnidad);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function verUnidad(req, res){
    const {id}=req.params;
    try{
        const unidad= await Unidad.findOne({
            where:{id}
        });
        res.status(201).json(unidad);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function actualizarUnidad(req, res){
    const {id}=req.params;
    const {nombre} = req.body;

    try{
        const unidad=await Unidad.findByPk(id);
        unidad.nombre=nombre;
       
        await unidad.save();
        
        res.status(201).json(unidad);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

