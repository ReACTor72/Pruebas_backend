import { sequelize } from '../src/database/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  // Añadir autenticación explícita y sincronización
  try {
    await sequelize.authenticate();
    console.log('Conexión a BD establecida');
    await sequelize.sync({ force: true });
    console.log('Tablas sincronizadas/creadas');
  } catch (error) {
    console.error('Error en setup:', error);
  }
});

afterAll(async () => {
  await sequelize.close();
});