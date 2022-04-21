import {Request, Response} from 'express';
import {MyUtils} from "../utils/my_util";
import {RoleInterface} from "../interface/role_interface";
import {ApiResponseUtil} from "../utils/api-response-util";
import {UserDao} from "../dao/psql/user_dao";
import {User} from "../entity/user";
import {PortalUserRole} from "../entity/user_account_role";
import {RoleTypeConstant} from "../utils/enums/role_type";

export class UserManagementController {

    static async index(req: Request, res: Response) {

        try {

            let page: number = 0;
            let limit: number = 10;
            let pageNumber: number = 0;
            let pageSize: number = 10;

            try {

                const reqQueryPage  = req.query.page as string;
                if (reqQueryPage) {
                    page = parseInt(reqQueryPage);
                }

                const reqQueryLimit = req.query.limit as string;
                if (reqQueryLimit) {
                    limit = parseInt(reqQueryLimit);
                }
            } catch (e) {
                console.log(e);
            }

            let roleParams:RoleInterface[] = [
                { name: 'USER', type: RoleTypeConstant.USER}
            ];

            const {email, firstName, lastName, otherName, roles} = req.body;

            if (roles) {
                if (roles.length > 0) {
                    roleParams = roles;
                }
            }

            let userAccountType = null;


            let userEmail = null;
            if (email) {
                userEmail = email;
            }

            let userFirstName = null;
            if (firstName) {
                userFirstName = firstName;
            }


            let userLastName = null;
            if (lastName) {
                userLastName = lastName;
            }

            let userOtherName: string = "";
            if (otherName) {
                userLastName = otherName;
            }


            const userCount = {
                userEmail,
                userFirstName,
                userLastName,
                userOtherName,
                roleParams,
            };

            const allUserCount = await UserDao.fetchUserCount(userCount);

            let offset = pageNumber * pageSize;

            const resultData = await UserDao.findAndCountAll(
                userEmail,
                userFirstName,
                userLastName,
                userAccountType,
                roleParams,
                offset,
                limit);


            if (!resultData) {
                return res.status(500).send({
                    success: false,
                    message: 'Internal Server error',
                    data: null,
                    errors: null
                });
            }

            const dataList: any[] = [];

            const rows = resultData.rows;

            let i = 0;
            for (let row of rows) {

                const user = {
                    id: row.id,
                    email: row.email,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    otherName: row.otherName,
                    code: row.code,
                    password: '',
                    createdAt: row.date_created,
                    updatedAt: row.date_updated,
                };


                const roles = row['UserAccountRoleMappers'];

                const data = {
                    user,
                    roles
                };


                let position = 0;

                position = MyUtils.pageOffsetCalculator(page, limit, i);

                const inputData = {
                    position,
                    data
                };

                dataList.push(inputData);
                i++;
            }

            return res.status(200).send({
                success: true,
                message: 'List of users',
                data: {
                    dataList,
                    pageSize: limit,
                    pageNumber: page,
                    length: allUserCount
                },
                errors: null
            });


        } catch (e) {

            return ApiResponseUtil.InternalServerError(res, e);
        }
    }

    static async findByUserId(req: Request, res: Response) {

        try {

            const userId = req.params.userId;
            if (!userId) {

                return res.status(400).send({
                    success: false,
                    message: 'List of users',
                    data: null,
                    errors: null
                });
            }

            const userIdInt = parseInt(userId);

            return User.findOne({
                where: {id: userIdInt}, include: [
                    {
                        model: PortalUserRole,
                    }
                ]
            }).then(async (row: any) => {

                // console.log(row.accounts);
                // console.log(row.UserAccountRoleMappers);

                if (row) {

                    const user = {
                        id: row.id,
                        email: row.email,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        otherName: row.otherName,
                        code: row.code,
                        password: '',
                        blocked: row.blocked,
                        createdAt: row.createdAt,
                        updatedAt: row.updatedAt,
                    };


                    let account = undefined;

                    const accounts = row.accounts;

                    for (let k = 0; k < accounts.length; k++) {

                        if (k === 0) {
                            account = accounts[0]
                        }
                    }

                    const roles = row.UserAccountRoleMappers;

                    const data = {
                        user,
                        account,
                        roles
                    };

                    // console.log(data);

                    return res.status(200).send({
                        success: true,
                        message: 'List of users',
                        data: data,
                        errors: null
                    });

                } else {
                    console.log("error account");
                }
            }).catch(reason => {
                console.log(reason);
            });


        } catch (e) {

            console.log(e);
            return res.status(500).send({
                success: false,
                message: 'Internal Server error',
                data: null,
                errors: null
            })
        }
    }
}
