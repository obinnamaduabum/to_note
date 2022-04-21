import {validationResult} from "express-validator";
import {body} from 'express-validator';
import {Request, Response} from "express";
import {Transaction} from "sequelize";
import {ApiResponseUtil} from "../utils/api-response-util";
import {AccountTypeConstant} from "../utils/enums/account_type";
import {UserDao} from "../dao/psql/user_dao";
import {RoleTypeConstant} from "../utils/enums/role_type";
import {MyUtils} from "../utils/my_util";
import {Authentication} from "./authentication-controller";
import {User} from "../entity/user";
import {UserService} from "../services/psql/user_service";
import {RoleInterface} from "../interface/role_interface";
import {UserAccountInterface} from "../interface/user_account";
import {postgresDatabase} from "../config/database/postgres_db";

export class UsersController {

    static validate(method: any) {
        if (method === 'registration') {
            {
                return [
                    body('password', 'Password required').not().isEmpty(),
                    body('firstName', 'Firstname required').not().isEmpty(),
                    body('lastName', 'Lastname required').not().isEmpty(),
                    body('email', 'Email required').not().isEmpty(),
                    body('email', 'Email invalid').isEmail(),
                    body('salary', 'Salary required').not().isEmpty()
                ]
            }
        } else if (method === 'loginCredentials') {

            {
                return [
                    body('email', 'Invalid email').exists().isEmail(),
                    body('password', 'password required').not().isEmpty().exists(),
                ]
            }
        } else if (method === 'email') {
            return [
                body('email', 'Invalid email').exists().isEmail(),
            ]
        }
    };

    static async signUp(req: Request, res: Response) {

        const transaction = await postgresDatabase.transaction();

        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: errors.array()
                });
            }

            const {email, lastName, firstName, otherName, password, salary} = req.body;

            const roles: RoleInterface[] = [{name: 'USER', type: RoleTypeConstant.USER}];

            const userAccountInterface: UserAccountInterface = {
                user: {
                    email: email,
                    lastName: lastName,
                    firstName: firstName,
                    otherName: otherName,
                    password: password,
                    active: true,
                },
                roles: roles,
                salary: salary
            };


            if (email) {

                const doesEmailExist = await UserDao.checkIfEmailExists(email.trim());

                if (doesEmailExist) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists',
                    });
                }
            }

            const user: User | null | undefined = await UserService.initializeAccountCreation(userAccountInterface, transaction);

            if (user) {

                return res.status(201).send({
                    success: true,
                    message: 'User successfully created',
                    data: user
                });

            } else {

                return res.status(500).send({
                    success: false,
                    message: 'User an error occurred during user registration',
                    data: null
                });
            }


        } catch (e) {
            await transaction.rollback();
            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    static async checkIfEmailExist(req: Request, res: Response) {

        try {

            const email = req.query['email'];

            if (!email) {
                return res.status(400).json({
                    success: false,
                    errors: 'email required',
                    message: 'Required',
                });
            }

            const trimmedEmail: string = email.toString().trim().toLocaleLowerCase();

            const user: User | null = await UserDao.checkIfEmailExists(trimmedEmail);

            if (!user) {
                return res.status(200).send({
                    success: true,
                    message: 'Email does not exist',
                    data: null
                });
            }

            return res.status(200).send({
                success: false,
                message: 'Email already taken',
                data: null
            });
        } catch (e) {
            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    static async checkIfEmailExistForLoggedInUser(req: Request, res: Response) {

        try {

            const email = req.query['email'];

            const result = await Authentication.fetchMe(req, res);

            if (!result) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const userId = result.data.user.id;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    errors: 'email required',
                    message: 'Required',
                });
            }

            const foundUser: User | null = await User.findOne({where: {id: userId}});


            if (!foundUser) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const trimmedEmail: string = email.toString().trim().toLocaleLowerCase();
            const user: User | null = await UserDao.checkIfEmailExists(trimmedEmail);

            if (!user) {
                return res.status(200).send({
                    success: true,
                    message: 'Email does not exist',
                    data: null
                });
            }

            if (foundUser.email.trim().toLowerCase() === user.email.trim().toLowerCase()) {
                return res.status(200).send({
                    success: true,
                    message: 'it is my email',
                    data: null
                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: 'Email already taken',
                    data: null
                });
            }

        } catch (e) {
            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    //Employee
    static async addEmployee(req: Request, res: Response) {

        try {

            const {success, data} = await ApiResponseUtil.findUser(req, res);

            if (!success) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const roleParams = [RoleTypeConstant.USER.toString()];

            const user: User | null = await data;
            if (!user) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const row: any | null = await ApiResponseUtil.accountRolePermitted(user.id, roleParams);

            if (!row) {
                return res.status(400).json({
                    success: false,
                    errors: [],
                    message: 'User not allowed to add new users',
                });
            }

            const accounts: any[] = row.accounts;
            let name = "";
            let type = AccountTypeConstant.ADMIN;

            for (let i = 0; i < accounts.length; i++) {
                if (i == 0) {
                    name = accounts[i].name;
                    type = accounts[i].type;
                    break;
                }
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                    message: 'Required',
                });
            }

            const {lastName, firstName, otherName, roles, email, password, salary} = req.body;


            const rolesRecords: RoleInterface[] = [];
            for (let i = 0; i < roles.length; i++) {

                const roleType = roles[i];
                const type: any = RoleTypeConstant[roleType];

                const role = {
                    name: roles[i],
                    type: type
                };

                let roleInterface: RoleInterface = role;

                rolesRecords.push(roleInterface);
            }


            const userAccountInterface: UserAccountInterface = {
                user: {
                    email: email,
                    lastName: lastName,
                    firstName: firstName,
                    otherName: otherName,
                    password: password,
                    active: true
                },
                roles: rolesRecords,
                salary: salary
            };


            const valueForEmailExits: any = await UserDao.checkIfEmailExists(MyUtils.escapeString(email.trim()));

            if (valueForEmailExits) {
                return res.status(200).json({
                    success: false,
                    message: 'Email already exists',
                });
            }

            const newRole: any[] = [];

            for (const role of roles) {
                newRole.push({name: role})
            }

            const userObj = {
                firstName,
                lastName,
                password,
                email,
                roles: newRole
            };

        } catch (e) {
            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    static async updateEmployee(req: Request, res: Response) {

        let transaction: Transaction;

        transaction = await postgresDatabase.transaction();

        try {

            // allowed to perform action
            let parseResult: any;
            const {success, data} = await ApiResponseUtil.findUser(req, res);
            if (!success) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const user: User | null = await data;
            if (!user) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const roleParams = [RoleTypeConstant.ADMIN.toString()];

            const permittedUser: any | null = await ApiResponseUtil.accountRolePermitted(user.id, roleParams);

            if (!permittedUser) {
                return ApiResponseUtil.accountTypeNotPermitted(res);
            }

            // const accounts: any[] = row.accounts;
            const adminUserAccountRoleMappers: any[] = permittedUser.UserAccountRoleMappers;

            const rolesRecords: string[] = [];
            for (let i = 0; i < adminUserAccountRoleMappers.length; i++) {

                const roleType = adminUserAccountRoleMappers[i].role_type;
                rolesRecords.push(roleType);
            }

            const found = rolesRecords.some(r => roleParams.includes(r));


            if (!found) {
                return res.status(401).json({
                    success: false,
                    errors: [],
                    message: 'Your not permitted to perform this action',
                });
            }

            const {email, lastName, firstName, otherName, roles} = req.body;

            const employeeUser: any | null = await UserDao.findByEmailAndAccountAndAccountMapper(email);
            //Update roles

            let deleteRolesPromise: any[] = [];
            let addRolesPromise: any[] = [];

            if (!employeeUser) {
                return res.status(404).json({
                    success: false,
                    errors: [],
                    message: 'Employee\'s account not found',
                });
            }



            // const dbRoles = await Role.findAll({
            //     where: {type: roles}
            // });
            //
            //
            // for (let i = 0; i < dbRoles.length; i++) {
            //
            //     const role = dbRoles[i];
            //     const roleMapper = await UserAccountRoleMapper.create({
            //         user_code: employeeUser.code,
            //         account_code: account.code,
            //         role_name: role.name,
            //         role_type: role.type,
            //         role_id: role.id,
            //         user_id: employeeUser.id,
            //         date_created: new Date(),
            //         date_updated: new Date()
            //     });
            //
            //     addRolesPromise.push(roleMapper);
            // }

            const userUpdateData = {
                lastName,
                firstName,
                otherName
            };

            await User.update(userUpdateData, {
                where: {
                    code: employeeUser.code,
                },
                transaction: transaction
            });

            await Promise.all(deleteRolesPromise);

            await Promise.all(addRolesPromise);

            await transaction.commit();

            return res.status(200).json({
                success: true,
                errors: [],
                message: 'Employee\'s account updated',
            });


        } catch (e) {
            await transaction.rollback();

            return ApiResponseUtil.InternalServerError(res, e);
        }

    }

    // End Employee

    static async updateUserProfile(req: Request, res: Response) {
        try {
            const {email} = req.body;

            const {success, data} = await ApiResponseUtil.findUser(req, res);

            if (!success) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            const foundUser: User | null = await data;

            if (!foundUser) {
                return ApiResponseUtil.unAuthenticated(res);
            }

            if (email) {
                await User.update({
                    email: MyUtils.escapeString(email)
                }, {
                    where: {
                        id: MyUtils.escapeString(foundUser.id)
                    }
                });

                return res.status(200).send({
                    success: true,
                    message: 'User email updated',
                    data: null
                });
            }

        } catch (e) {
            return ApiResponseUtil.InternalServerError(res, e);
        }
    }
}
