import {
    Association,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    Model,
} from "sequelize";
import {User} from "./user";
import {Role} from "./role";
import {postgresDatabase} from "../config/database/postgres_db";

export class PortalUserRole extends Model {
    public id!: number;
    public date_created!: Date;
    public date_updated!: Date;
    public getRole!: HasManyGetAssociationsMixin<Role>; // Note the null assertions!
    public addRole!: HasManyAddAssociationMixin<Role, number>;
    public static associations: {
        roles: Association<PortalUserRole, Role>;
    };
}

PortalUserRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_updated: {
            type: DataTypes.DATE,
            allowNull: false
        }

    },
    {
        tableName: "portal_user_role",
        sequelize: postgresDatabase
    }
);

PortalUserRole.belongsTo(Role, {foreignKey: 'role_id', constraints: false});

User.hasMany(PortalUserRole, {
    foreignKey: 'user_id',
    constraints: false
});

Role.hasMany(PortalUserRole, {
    foreignKey: 'role_id',
    constraints: false
});


let isForced = false;
let isAltered = true;
// if (process.env.DATABASE_FORCED === "true") {
//     isForced = true;
// }
// if (process.env.DATABASE_ALTERED === "true") {
//     isAltered = true;
// }


