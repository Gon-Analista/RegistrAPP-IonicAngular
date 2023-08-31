export class UserModel {

    constructor(
        public name: string,
        public last_name: string,
        public email: string,
        public birthday: Date | undefined,
        public type: string,
        public username: string,
        public password: string,
    ) {
    }

    //Metodo dentro de la clase para crear usuario. EJEMPLO solamente.
    static crearUsuario(event: {
        name: string,
        last_name: string,
        email: string
    }){
        return {
            name: event.email,
            last_name: event.last_name,
            email: event.email
        }
    }
}