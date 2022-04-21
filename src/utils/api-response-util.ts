import {Authentication} from "../controllers/authentication-controller";
import {MyUtils} from "./my_util";
import {User} from "../entity/user";

export class ApiResponseUtil {

    static InternalServerError(res, e) {
        console.log(e);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

    static unAuthenticated(res) {
        return res.status(401).send({
            success: false,
            message: 'unauthenticated',
            data: null
        });
    }

    static accountTypeNotPermitted(res) {
        return res.status(200).send({
            success: false,
            message: 'user not permitted',
            data: null
        });
    }

    static async accountRolePermitted(userId: number, roleParams: any[]) {

        try {

            return await User.findOne({
                where: {
                    id: userId
                }
            });

        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static async accountRolePermittedByEmail(email: string, roleParams: any[]) {

        try {

            return await User.findOne({
                where: {
                    email: MyUtils.escapeString(email)
                }
            });

        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static async findUser(req, res) {

        try {

            let userId: number = 0;
            const result = await Authentication.fetchMe(req, res);
            if (result) {
                userId = result.data.user.id;
                const user =  User.findOne({where: {id: userId}});
                const data  = {
                    success: true,
                    data: user
                };

                return data;

            } else {
                const data = {
                    success: false,
                    data: null
                };
                return data;
            }
        } catch (e) {
            console.log(e);
            const data = {
                success: false,
                data: null
            };

            return data;
        }
    }


}
