// Defino una clase 'GetPublicUserDto' para representar un objeto de transferencia de datos (DTO) para usuarios públicos
export class GetPublicUserDto {
    // En el constructor, tomo un objeto 'userDB' y asigno sus propiedades al DTO
    constructor(userDB) {
        // Asigno el nombre del usuario desde la base de datos al DTO
        this.first_name = userDB.first_name;
        // Asigno el apellido del usuario desde la base de datos al DTO
        this.last_name = userDB.last_name;
        // Asigno el correo electrónico del usuario desde la base de datos al DTO
        this.email = userDB.email;
        // Asigno la edad del usuario desde la base de datos al DTO
        this.age = userDB.age;
        // Asigno el carrito del usuario desde la base de datos al DTO
        this.cart = userDB.cart;
    }
}