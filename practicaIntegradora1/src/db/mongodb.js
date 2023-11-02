import mongoose from 'mongoose';

export const init = async () => {
    try {
        const URI = 'mongodb+srv://santigimelli:aqmQ3tKNjb0tZzp9@cluster0.kgid0ky.mongodb.net/';
        await mongoose.connect(URI);
        console.log('Database conected 🚀');
    } catch (error) {
        console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    }
}