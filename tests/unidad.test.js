import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 

describe('\nPruebas para los endpoints de Unidad\n---------------------------------------------', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    let unidadId;

    test('debería crear una nueva unidad - POST /api/unidades', async () => {
        const nuevaUnidad = { nombre: 'Kilogramo' };
        const response = await request(app).post('/api/unidades').send(nuevaUnidad);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe('Kilogramo');
        unidadId = response.body.id;
    });

    test('debería obtener todas las unidades - GET /api/unidades', async () => {
        const response = await request(app).get('/api/unidades');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].nombre).toBe('Kilogramo');
    });
/* 
    test('debería actualizar una unidad - PUT /api/unidades/:id', async () => {
        const response = await request(app).put(`/api/unidades/${unidadId}`).send({ id: unidadId, nombre: 'Pieza' });
        expect(response.statusCode).toBe(200);
        expect(response.body.nombre).toBe('Pieza');
    });

    test('debería eliminar una unidad - DELETE /api/unidades/:id', async () => {
        const response = await request(app).delete(`/api/unidades/${unidadId}`);
        expect(response.statusCode).toBe(200);

        // Verificar que ya no se puede obtener la unidad eliminada
        const getResponse = await request(app).get(`/api/unidades/${unidadId}`);
        expect(getResponse.statusCode).toBe(404);
    });
 */
    afterAll(async () => {
        await sequelize.close();
    });
});
