import {body, validationResult} from "express-validator";
import {Request, Response} from 'express';
import {RoleTypeConstant} from "../utils/enums/role_type";
import {BcryptPasswordUtil} from "../utils/bcrypt-password-util";
import {ApiResponseUtil} from "../utils/api-response-util";
import {User} from "../entity/user";
import {RoleInterface} from "../interface/role_interface";
import {AuthenticationUtils} from "../module/access/authentication_utils";
import {UserDao} from "../dao/psql/user_dao";

export class Authentication {

    static validate(method: string) {
        if (method === 'validateUserCredentials') {
            {
               return  [
                    body('email', 'email required').exists(),
                    body('email', 'email invalid').exists().isEmail(),
                    body('password', 'password required').exists()
                ]
            }
        }

        return;
    };

    static async logOut(req: Request, res: Response) {

        try {

            let cookie = req.cookies;

            for (let prop in cookie) {
                if (!cookie.hasOwnProperty(prop)) {
                    continue;
                }

                const options = {expires: new Date(0), httpOnly: true};
                res.cookie(prop, '', options);
            }

            return res.status(200).send({
                success: true,
                message: 'Logout successful',
            });

        } catch (e) {

            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    static async me(req: Request, res: Response) {

        try {

            const verifyToken: any = await AuthenticationUtils.verifyTokenForMe(req, res);

            if (verifyToken === null) {
                return res.status(401).send({
                    success: false,
                    message: 'session or token expired, kindly login again',
                    data: null
                });
            } else if (verifyToken === 'cookieNotFound') {
                return res.status(401).send({
                    success: false,
                    message: 'kindly login again',
                    data: 'cookieNotFound'
                });
            }

            const row: any = await User.findOne({
                where: {code: verifyToken.id}
            });

            if (!row) {
                return res.status(401).send({
                    success: false,
                    message: 'username or password is invalid',
                });
            }

            if (row) {

                if (!row.active && row.blocked) {
                    return res.status(200).send({
                        success: false,
                        message: 'Account not activated',
                        data: null
                    });
                }

                const user = {
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    otherName: row.otherName,
                    code: row.code,
                    password: '',
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                };

                const roles = row.UserAccountRoleMappers;

                const data = {
                    user,
                    roles
                };

                return res.status(200).send({
                    success: true,
                    message: 'user found',
                    data
                });
            }

        } catch (e) {

            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    //Login
    static async authenticateUser(req: any, res: any) {

        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const {email, password} = req.body;

        const trimmedEmail = email.trim().toLocaleLowerCase();

            try {

                const user = await UserDao.findByEmail(trimmedEmail);

                if (!user) {
                    return res.status(200).send({
                        success: false,
                        message: 'Account not found',
                    });
                }

                const compareResult = await BcryptPasswordUtil.compare(password, user.password);

                if (!compareResult) {

                    return res.status(401).send({
                        success: false,
                        message: 'username or password is invalid',
                    });
                }

                const token = AuthenticationUtils.generateToken(user.code);

                AuthenticationUtils.setCookie(token, res);

                return res.status(200).send({
                    success: true,
                    message: 'token successfully generated',
                    token
                });

            } catch (e) {

                return ApiResponseUtil.InternalServerError(res, e);
            }
    }

    static async fetchMe(req: Request, res: Response) {

        try {

            const verifyToken: any = await AuthenticationUtils.verifyToken(req, res);

            if (!verifyToken) {
                return null;
            }

            const row: any = await User.findOne({
                where: {code: verifyToken['id']}
            });


            if(!row) {
                return null;
            }

            const roles: any[] = row.UserAccountRoleMappers;

            const rolesRecords: RoleInterface[] = [];

            for (const roleType of roles) {

                const type: any = RoleTypeConstant[roleType];

                const role = {
                    name: roleType,
                    type: type
                };

                let roleInterface: RoleInterface = role;

                rolesRecords.push(roleInterface);
            }


            const userAccountInterface: any = {
                user: {
                    id: row.id,
                    email: row.email,
                    lastName: row.lastName,
                    firstName: row.firstName,
                    otherName: row.otherName,
                    password: "",
                    active: true,
                },
                roles: rolesRecords
            };


            return {
                data: {
                    user: userAccountInterface.user,
                    roles: userAccountInterface.roles
                }
            };

        } catch (e) {

            console.log(e);
            return null;
        }
    }
}
