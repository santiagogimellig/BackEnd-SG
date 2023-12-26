import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const init = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error('Ocurrió un error al intentar conectarse a la base de datos', error.message);
    }
};