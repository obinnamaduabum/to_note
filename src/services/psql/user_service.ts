import {MySequences} from "../../sequence/my_sequences";
import {MyUtils} from "../../utils/my_util";
import {UserAccountInterface} from "../../interface/user_account";
import {RoleInterface} from "../../interface/role_interface";
import {Transaction} from "sequelize";
import {Authentication} from "../../controllers/authentication-controller";
import {BcryptPasswordUtil} from "../../utils/bcrypt-password-util";
import {UserModel} from "../../model/user_model";
import {User} from "../../entity/user";
import {Role} from "../../entity/role";
import {Salary} from "../../entity/salary";
import {PortalUserRole} from "../../entity/user_account_role";

export class UserService {

    static async generateUserCode() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDay();
        const uniqueIdUser = await MySequences.getUserId();
        const uniqueIdNameUser = 'USER';
        const getCurrentTime = new Date().getTime().toString().slice(0, 2);
        return MyUtils.formatString("{0}{1}{2}{3}{4}{5}", uniqueIdNameUser, year.toString(),
            month.toString(), day.toString(), uniqueIdUser, getCurrentTime);
    }

    static async initializeAccountCreation(userAndAccount: UserAccountInterface,
                                           transaction: Transaction) {


        const saltRounds = 10;
        const userCode = await UserService.generateUserCode();

        const encryptedPassword: string | null = await BcryptPasswordUtil.getHashedPassword(userAndAccount.user.password, saltRounds);

        if (!encryptedPassword) {
            throw new Error();
        }

        let userModel: UserModel = new UserModel(
            userAndAccount.user.firstName,
            userAndAccount.user.lastName,
            userAndAccount.user.otherName,
            userAndAccount.user.email,
            encryptedPassword,
            userCode,
            true
        );

        let otherName: string = "";
        if (userModel.otherName) {
            otherName = userModel.otherName.toLocaleLowerCase();
        }


        const userInfoData = {
            firstName: userModel.firstName.toLocaleLowerCase(),
            lastName: userModel.lastName.toLocaleLowerCase(),
            otherName: otherName,
            email: userModel.email.toLocaleLowerCase(),
            password: userModel.password,
            code: userModel.code,
            active: userModel.active,
            date_created: new Date(),
            date_updated: new Date()
        };

        const user = await User.create(userInfoData, {transaction: transaction});

        const salary = new Salary();
        salary.amount = userAndAccount.salary;
        salary.date_created = new Date();
        salary.date_updated = new Date();
        await user.setSalary(salary);

        const rolesRecords: RoleInterface[] = userAndAccount.roles;

        const result = await this.addRoles(rolesRecords, user, transaction);


        if (result) {
            await Promise.all(result.mainPromises);
            await transaction.commit();
            return result.user;
        }

        return null;
    }


    static async addRoles(rolesRecords: RoleInterface[], user: User, transaction: Transaction) {

        try {

            let mainPromises: any[] = [];

            for (let i = 0; i < rolesRecords.length; i++) {

                const role = await Role.findOne({where: {type: rolesRecords[i].type}});

                if (role) {

                    const roleInput = {
                        role_id: role.id,
                        user_id: user.id,
                        date_created: new Date(),
                        date_updated: new Date()
                    };

                    const roleMapper = await PortalUserRole.create(roleInput, {transaction: transaction});
                    mainPromises.push(roleMapper);
                }

            }

            return {
                mainPromises: mainPromises,
                user: user,
            };

        } catch (e) {
            console.log(e);
        }
    }


    static async findLoggedInUser(req, res): Promise<null | User> {
       const result = await Authentication.fetchMe(req, res);
        if (result) {
            const userId = result.data.user.id;
            let user = await User.findOne({where: {id: userId}});
            if(user) {
                return user;
            }
            return null;
        }
        return null;
    }
}
