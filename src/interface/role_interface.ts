import {RoleTypeConstant} from "../utils/enums/role_type";

export interface RoleInterface {
    name: string,
    type: RoleTypeConstant,
    date_created?: Date,
    date_updated?: Date
}
