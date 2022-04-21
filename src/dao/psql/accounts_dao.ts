// import {Transaction} from "sequelize";
// const SqlString = require('sqlstring');
//
// export class AccountsDao {
//
//     static async save(name: string, code: string, type: string) {
//
//         const inputData = {
//             name: SqlString.escape(name),
//             code: SqlString.escape(code),
//             type: SqlString.escape(type)
//         }
//         return Account.create(inputData);
//     }
//
//
//     static async saveWithTransaction(name: string, code: string, type: string, transaction: Transaction) {
//         return Account.create({
//             name,
//             code,
//             type
//         }, {transaction: transaction});
//     }
//
//     static async findById(id: number) {
//         return Account.findOne({where: {id: id}});
//     }
// }
