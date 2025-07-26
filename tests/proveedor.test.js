import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 

describe('\nPruebas para los endpoints de Proveedor\n---------------------------------------------', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    let proveedorId;
    const datosProveedor = {
        nombre: 'TRUPER S.A.',
        nombre_contacto: 'Carlos Villegas',
        direccion: 'Av. Industrial 123, Parque Industrial',
        telefono: '4445566',
        celular: '71811223',
        email: 'contacto@truper.com',
        estado: '1'
    };

    test('debería crear un nuevo proveedor \t\t\t\t- POST /api/proveedor', async () => {
        const response = await request(app).post('/api/proveedor').send(datosProveedor);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe(datosProveedor.nombre);
        expect(response.body.nombre_contacto).toBe(datosProveedor.nombre_contacto);
        proveedorId = response.body.id;
    });

    test('debería obtener todos los proveedores \t\t\t- GET /api/proveedor', async () => {
        const response = await request(app).get('/api/proveedor');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    test('debería obtener un proveedor por ID \t\t\t- GET /api/proveedor/:id', async () => {
        const response = await request(app).get(`/api/proveedor/${proveedorId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(datosProveedor.email);
    });

    test('debería actualizar datos de un proveedor \t\t\t- PUT /api/proveedor/:id', async () => {
        const datosActualizados = datosProveedor;           // Mantenemos datos antes de la actualización x Campos obligatorios
            datosActualizados.celular = '111223344';
            datosActualizados.direccion = 'Bolivar 123'; // Cambiamos la dirección a 'Bolivar 123'
        const response = await request(app).put(`/api/proveedor/${proveedorId}`).send(datosActualizados);
        expect(response.statusCode).toBe(200);
        expect(response.body.celular).toBe(datosActualizados.celular);
        expect(response.body.direccion).toBe(datosActualizados.direccion);
    });

    test('debería dar de Baja/Actualizar estado de un proveedor \t- PUT /api/proveedor/:id', async () => {
        const datosActualizados = datosProveedor;           // Mantenemos datos antes de la actualización x Campos obligatorios
            datosActualizados.estado = 'Baja';              // Cambiamos el estado a 'Baja'
        const response = await request(app).put(`/api/proveedor/${proveedorId}`).send(datosActualizados);
        expect(response.statusCode).toBe(200);
        expect(response.body.estado).toBe(datosActualizados.estado);
    });

    test('debería evitar que se elimine un proveedor \t\t- DELETE /api/proveedor/:id', async () => {
        const response = await request(app).delete(`/api/proveedor/${proveedorId}`);
        expect(response.statusCode).toBe(404);

        // Verificar que el proveedor no ha sido eliminado
        const getResponse = await request(app).get(`/api/proveedor/${proveedorId}`);
        expect(getResponse.statusCode).toBe(200);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
