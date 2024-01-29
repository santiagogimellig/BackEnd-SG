// Importo el módulo mongoose para interactuar con MongoDB
import mongoose from 'mongoose';

// Defino el nombre de la colección en MongoDB
const collection = 'User';

// Defino el esquema del modelo para la colección de usuarios
const schema = new mongoose.Schema({
    // Propiedad 'first_name': Almacena el primer nombre del usuario
    first_name: String,
    // Propiedad 'last_name': Almacena el apellido del usuario
    last_name: String,
    // Propiedad 'email': Almacena el correo electrónico del usuario
    email: String,
    // Propiedad 'age': Almacena la edad del usuario
    age: Number,
    // Propiedad 'password': Almacena la contraseña del usuario
    password: String,
    // Propiedad 'rol': Almacena el rol del usuario, con un valor predeterminado de 'user'
    rol: {
        type: String,
        default: 'user'
    },
    // Propiedad 'githubProfile': Almacena el perfil de GitHub del usuario (opcional)
    githubProfile: { type: Object, required: false },
    // Propiedad 'cart': Almacena la referencia al carrito asociado al usuario
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"  // Referencia al modelo de carritos
    }
});

// Antes de realizar una operación de búsqueda, configuro la población de la referencia al modelo de carritos
schema.pre('find', function () {
    this.populate("carts.cart");
});

// Creo el modelo 'userModel' utilizando el esquema definido
const userModel = mongoose.model(collection, schema);

// Exporto el modelo para su uso en otras partes de la aplicación
export default userModel;