import {AccountsDao} from "../../dao/psql/accounts_dao";
import {Account} from "../../models/psql/account";
import {AccountInterface} from "../../interface/account_interface";
import {MySequences} from "../../sequence/my_sequences";
import {MyUtils} from "../../utils/my_util";

export class AccountService {

    static save(accountInterface: AccountInterface, code: string): Promise<Account> {
        return AccountsDao.save(
            accountInterface.name,
            accountInterface.type,
            code
        );
    }


    static async generateAccountCode() {
        const uniqueIdAccount = await MySequences.getAccountCode();
        const uniqueIdNameAccount = 'AC_';
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDay();
        const getCurrentTime = new Date().getTime().toString().slice(0, 2);

        const accountCode = MyUtils.formatString("{0}{1}{2}{3}{4}{5}", uniqueIdNameAccount, year.toString(),
            month.toString(), day.toString(), uniqueIdAccount, getCurrentTime);
        return accountCode;
    }
}
