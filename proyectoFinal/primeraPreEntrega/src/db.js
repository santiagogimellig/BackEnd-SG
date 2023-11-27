import {connect} from 'mongoose';

export const connectDB = async () => {
    try {
        await connect('mongodb+srv://santigimelli:aqmQ3tKNjb0tZzp9@cluster0.kgid0ky.mongodb.net/')
        console.log('connect to db');
    } catch (error) {
        console.error(error);
    }
}