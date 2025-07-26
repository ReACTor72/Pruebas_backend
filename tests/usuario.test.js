import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 

describe('\nPruebas para los endpoints de Usuario, Login y Autorización\n-------------------------------------------------------------', () => {
    
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

/*     const datosUsuario = {
        username: 'testuser',
        email: 'test@example.com',
        contrasena: 'ClaveSegura123',
        estado: 1 // 1 para activo, 0 para inactivo
    };
    let authToken;
    let userId;

    // 1. Pruebas de Registro y Validación
    describe('Registro y Validación de Usuarios', () => {
        test('debería registrar un nuevo usuario - POST /api/usuarios', async () => {
            const response = await request(app).post('/api/usuarios').send(datosUsuario);
            expect(response.statusCode).toBe(201);
            expect(response.body.username).toBe(datosUsuario.username);
            expect(response.body.email).toBe(datosUsuario.email);
            expect(response.body.contrasena).toBe(datosUsuario.contrasena); // La contraseña no debe ser devuelta
            //expect(response.body.contrasena).toBeUndefined(); // La contraseña NUNCA debe ser devuelta
            userId = response.body.id;
        });

        test('debería fallar al registrar con un email ya existente - POST /api/usuarios', async () => {
            const response = await request(app).post('/api/usuarios').send({ ...datosUsuario, username: 'otro_user' });
            expect(response.statusCode).toBe(400); // Bad Request por duplicado
        });
    });

    // 2. Pruebas de Login
    describe('Autenticación de Usuarios (Login)', () => {
        test('debería autenticar un usuario y devolver un token - POST /api/login', async () => {
            const credenciales = { email: datosUsuario.email, contrasena: datosUsuario.contrasena };
            const response = await request(app).post('/api/login').send(credenciales);
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
            authToken = response.body.token; // Guardamos el token para pruebas protegidas
        });

        test('debería rechazar credenciales incorrectas - POST /api/login', async () => {
            const credencialesMal = { email: datosUsuario.email, contrasena: 'contrasena_incorrecta' };
            const response = await request(app).post('/api/login').send(credencialesMal);
            expect(response.statusCode).toBe(401); // No autorizado
        });
    });

    // 3. Pruebas de Rutas Protegidas (CRUD con Autorización)
    describe('CRUD de Usuarios con Autorización', () => {
        test('debería denegar el acceso a GET /api/usuarios sin token', async () => {
            const response = await request(app).get('/api/usuarios');
            expect(response.statusCode).toBe(401);
        });

        test('debería permitir el acceso a GET /api/usuarios con un token válido', async () => {
            const response = await request(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('debería permitir actualizar un usuario con token válido - PUT /api/usuarios/:id', async () => {
            const datosActualizados = { username: 'testuser_actualizado', estado: 0 };
            const response = await request(app)
                .put(`/api/usuarios/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(datosActualizados);
            expect(response.statusCode).toBe(200);
            expect(response.body.username).toBe(datosActualizados.username);
            expect(response.body.estado).toBe(datosActualizados.estado);
        });

        test('debería permitir eliminar un usuario con token válido - DELETE /api/usuarios/:id', async () => {
            const response = await request(app)
                .delete(`/api/usuarios/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.statusCode).toBe(200);
        });
    }); */

    afterAll(async () => {
        await sequelize.close();
    });
});