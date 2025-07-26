import Sequelize from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno según el ambiente
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
  console.log('.....................Cargando variables de entorno desde .env.test:', process.env.DB_NAME);
} else if (process.env.NODE_ENV === 'development') {
  console.log('.....................Cargando variables de entorno desde .env.development:', process.env.DB_NAME);
} else {
  dotenv.config({ path: '.env' });
  console.log('.....................Cargando variables de entorno desde .env:', process.env.DB_NAME);
}

// Carga las variables de entorno ORIGINAL
//dotenv.config();

// Crear la instancia de Sequelize
export const sequelize = new Sequelize(
    process.env.DB_NAME,       // Nombre de la base de datos
    process.env.DB_USERNAME,   // Usuario
    process.env.DB_PASSWORD,   // Contraseña
    {
        host: process.env.HOST,    // Host (generalmente localhost)
        dialect: "mysql",          // Tipo de base de datos
        logging: false,            // ------------------ false Desactiva los logs de las consultas
        dialectOptions: {
            connectTimeout: 100000 // 100 segundos
        }
    }
);

// Función para verificar y sincronizar solo en ambientes no de prueba
// ===================================================================

export const initializeDB = async () => {
  try {
    //if (process.env.NODE_ENV !== 'test') {
    //if (true) {
      await sequelize.authenticate();
      console.log('-------------->>> Conexión a DB establecida');
      await sequelize.sync({ alter: true });
      console.log('-------------->>> Tablas sincronizadas');
    //}
  } catch (error) {
    console.error('-------------->>> Error en DB:', error);
  }
};