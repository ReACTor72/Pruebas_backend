import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 
import { Usuario } from '../src/models/Usuario.js'; 
import bcrypt from 'bcrypt';


describe('\nPruebas de Autenticación\n----------------------------------', () => {

    // --- DATOS DE PRUEBA ---
    const usuarioActivo = {
        nombre: 'usuario_activo',
        correo: 'activo@example.com',
        contrasena: 'ClaveActiva123'
    };

    const usuarioInactivo = {
        nombre: 'usuario_inactivo',
        correo: 'inactivo@example.com',
        contrasena: 'ClaveInactiva456',
    };

    // --- SETUP ANTES DE LAS PRUEBAS ---
    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Crear usuarios de prueba directamente en la BD para simular un estado real
        // Se usa el mismo método de hashing que el controlador `createUser`
        const salt = await bcrypt.genSalt(10);
        
        await Usuario.create({
            username: usuarioActivo.nombre,
            email: usuarioActivo.correo,
            contrasena: await bcrypt.hash(usuarioActivo.contrasena, salt),
            estado: 1 // 1 = Activo
        });

        await Usuario.create({
            username: usuarioInactivo.nombre,
            email: usuarioInactivo.correo,
            contrasena: await bcrypt.hash(usuarioInactivo.contrasena, salt),
            estado: 0 // 0 = Inactivo
        });
    });

    // --- PRUEBAS DE LOGIN ---
    describe('Pruebas de ingreso de usuarios (Login)', () => {
        test('debería autenticar a un usuario activo y devolver un token \t- POST /api/login', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: usuarioActivo.correo,
                    contrasena: usuarioActivo.contrasena
                });
            
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        test('debería rechazar login con contraseña incorrecta \t\t- POST /api/login', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: usuarioActivo.correo,
                    contrasena: 'contrasena-incorrecta'
                });
            
            expect(response.statusCode).toBe(400); // Unauthorized
            expect(response.body.token).toBeUndefined();
        });

        test('debería rechazar login con un email que no existe \t\t- POST /api/login', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'noexiste@example.com',
                    contrasena: 'cualquierclave'
                });
            
            expect(response.statusCode).toBe(404); // Not Found
        });

    });

    // --- CLEANUP DESPUÉS DE LAS PRUEBAS ---
    afterAll(async () => {
        await sequelize.close();
    });
});
