import {Op} from "sequelize";
import {MyUtils} from "../../utils/my_util";
import {User} from "../../entity/user";

export class UserDao {

    static async checkIfUsernameExists(username: string) {
        return User.findOne({where: {
            username: MyUtils.escapeString(username.toString().toLocaleLowerCase())
        }});
    }

    static async findByEmail(email: string) {
        try {
            return await User.findOne({where:
              { email: MyUtils.escapeString(email) }
            });
        } catch (e) {
            throw e;
        }
    }

    static async checkIfEmailExists(email: string) {
        return User.findOne({where: {
            email: email.toString().toLocaleLowerCase()
        }});
    }


    static async findById(id: number) {
        return User.findOne({where: {
            id: id
        }});
    }

    static async findByCode(code: string) {
        return User.findOne({where: {code: MyUtils.escapeString(code)
        }});
    }

    static async findOne(username: any){
        return User.findOne({where: { email: MyUtils.escapeString(username) }});
    }

    static async fetchUserCount(data: any) {

        try {

            const users: User[] | null = await User.findAll({
                where: {
                    email: data.userEmail !== null ? data.userEmail : {[Op.ne]: 'undefined'},
                    firstName: data.userFirstName !== null ? data.userFirstName : {[Op.ne]: 'undefined'},
                    lastName: data.userLastName !== null ? data.userLastName : {[Op.ne]: 'undefined'}
                }
            });

            if(!users) {
                return 0;
            }

            return users.length;

        } catch (e) {
            console.log(e);
            return 0;
        }
    }


    static async findAndCountAll(userEmail: any, userFirstName: any,  userLastName: any,
                                 userAccountType: any,
                                 roleParams: any[],
                                 offset: number,
                                 limit: number) {

        try {

            return await User.findAndCountAll({
                where: {
                    email: userEmail !== null ? MyUtils.escapeString(userEmail) : {[Op.ne]: 'undefined'},
                    firstName: userFirstName !== null ? MyUtils.escapeString(userFirstName) : {[Op.ne]: 'undefined'},
                    lastName: userLastName !== null ? MyUtils.escapeString(userLastName) : {[Op.ne]: 'undefined'}
                },
                offset: offset, limit: limit,
                order: [
                    ['date_created', 'DESC'],
                ]
            });
        } catch (e) {
            return null;
        }
    }



    static async findByCodeAndAccountAndAccountMapper(code: string) {

        try {


            return await User.findOne({
                where: { code: code },
            });

        } catch (e) {
            throw e;
        }
    }


    static async findByEmailAndAccountAndAccountMapper(email: string) {

        try {

            return await User.findOne({
                where: { email: MyUtils.escapeString(email) },
            });

        } catch (e) {
            throw e;
        }
    }
}
