export class RandomPasswordGenerator {

    static async generate() {
        return Math.random()                        // Generate random number, eg: 0.123456
            .toString(36)           // Convert  to base-36 : "0.4fzyo82mvyr"
            .slice(-8);
    }

    static async generateStrongPassword(length: number) {

        try {

            let password = '', character;
            while (length > password.length) {
                if (password.indexOf(character = String.fromCharCode(Math.floor(Math.random() * 94) + 33), Math.floor(password.length / 94) * 94) < 0) {
                    password += character;
                }
            }
            return password;

        }catch (e) {

        }
    }
}
