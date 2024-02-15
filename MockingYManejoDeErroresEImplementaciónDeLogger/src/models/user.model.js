import mongoose from 'mongoose';

// Definición de los roles disponibles
const roles = ['user', 'admin'];

// Esquema de Mongoose para los usuarios
const userSchema = new mongoose.Schema({
    // Nombre del usuario
    first_name: String,
    // Apellido del usuario
    last_name: String,
    // Correo electrónico único del usuario
    email: { type: String, unique: true },
    // Edad del usuario
    age: Number,
    // Contraseña del usuario (se recomienda almacenarla de forma segura, por ejemplo, hasheada)
    password: String,
    // ID del carrito de compras asociado al usuario
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    // Rol del usuario (debe estar dentro de los roles definidos)
    rol: { type: String, enum: roles, default: "user" },
    // Proveedor de autenticación (por ejemplo, Google, Facebook, etc.)
    provider: String,
}, { timestamps: true }); // Se incluye la opción timestamps para registrar la fecha y hora de creación y actualización del usuario

// Exporta el modelo User basado en el esquema userSchema
export default mongoose.model('User', userSchema);
