import mongoose from 'mongoose'; // Importa el módulo mongoose para trabajar con MongoDB

// Define los roles disponibles para los usuarios
const roles = ['user', 'admin', 'premium'];

// Define el esquema para los usuarios
const userSchema = new mongoose.Schema({
    first_name: String, // Nombre del usuario
    last_name: String, // Apellido del usuario
    email: { type: String, unique: true }, // Correo electrónico del usuario (debe ser único)
    age: Number, // Edad del usuario
    password: String, // Contraseña del usuario
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Referencia al carrito de compras del usuario
    rol: { type: String, enum: roles, default: "user" }, // Rol del usuario (debe ser uno de los roles definidos en 'roles')
    provider: String, // Proveedor de autenticación externo (opcional)
}, { timestamps: true }); // Agrega marcas de tiempo al documento

// Exporta el modelo 'User' basado en el esquema definido
export default mongoose.model('User', userSchema);