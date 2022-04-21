export class UserModel {
    firstName: string;
    lastName: string;
    otherName: string | undefined;
    email: string;
    password: string;
    code: string;
    active: boolean;

    constructor(firstName: string,
                lastName: string,
                otherName: string | undefined,
                email: string,
                password: string,
                code: string,
                active: boolean) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.otherName = otherName;
        this.email = email;
        this.password = password;
        this.code = code;
        this.active = active;
    }
}
