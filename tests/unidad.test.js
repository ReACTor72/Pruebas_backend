import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 

describe('\nPruebas para los endpoints de Unidad\n---------------------------------------------', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    let unidadId;
    const datosUnidad = {
        id: 1,
        nombre: 'Galon'
    };

    test('debería crear una nueva unidad \t\t- POST /api/unidades', async () => {
        const nuevaUnidad = { nombre: 'Kilogramo' };
        const response = await request(app).post('/api/unidades').send(nuevaUnidad);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe('Kilogramo');
        unidadId = response.body.id;
    });

    test('debería obtener todas las unidades \t- GET /api/unidades', async () => {
        const response = await request(app).get('/api/unidades');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].nombre).toBe('Kilogramo');
    });

    test('debería actualizar una unidad \t\t- PUT /api/unidades/:id', async () => {
            const datosActualizados = datosUnidad;           // Mantenemos datos antes de la actualización x Campos obligatorios
            datosActualizados.nombre = 'Barril';            // Cambiamos el nombre a 'Barril '
        const response = await request(app).put(`/api/unidades/${unidadId}`).send(datosActualizados);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe('Barril');
    });

        test('debería evitar que se elimine una unidad \t- DELETE /api/unidades/:id', async () => {
        const response = await request(app).delete(`/api/unidades/${unidadId}`);
        expect(response.statusCode).toBe(404);

        // Verificar que el unidad no ha sido eliminado
        const getResponse = await request(app).get(`/api/unidades/${unidadId}`);
        expect(getResponse.statusCode).toBe(201);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
