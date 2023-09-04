export class UserModel {

    constructor(
        public name: string,
        public last_name: string,
        public email: string,
        public role: string,
        public username: string,
        public password: string,
    ) {
    }

}