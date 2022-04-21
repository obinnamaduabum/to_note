import {RandomPasswordGenerator} from "./random-password-generator";
const owasp = require('owasp-password-strength-test');

export class PasswordStrength {

    static async checkPassWordStrengthAndGeneratePassword() {

        try {
            owasp.config({
                allowPassphrases: true,
                maxLength: 15,
                minLength: 6,
                minPhraseLength: 6,
                minOptionalTestsToPass: 4,
            });
            const password = await RandomPasswordGenerator.generate();
            const result = owasp.test(password);
            if(result.strong) {
               return password;
            }
            await this.checkPassWordStrengthAndGeneratePassword();
        } catch (e) {
            console.log("error");
            return null;
        }
    }

}
