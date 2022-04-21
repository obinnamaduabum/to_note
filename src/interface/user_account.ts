import {RoleInterface} from "./role_interface";
import {UserInterface} from "./user_interface";

export interface UserAccountInterface {
    user: UserInterface;
    roles: RoleInterface[];
    salary?: bigint
}
