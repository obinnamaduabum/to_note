import {AccountTypeConstant} from "../utils/enums/account_type";

export interface AccountInterface {
    name: string;
    type: AccountTypeConstant;
    active: boolean;
}
