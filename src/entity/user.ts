import {postgresDatabase} from '../config/database/postgres_db';
import {
    Model,
    DataTypes, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Association
} from 'sequelize';
import {Salary} from "./salary";

export class User extends Model {

    public id!: number;
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public otherName!: string;
    public password!: string;
    public active!: boolean;
    public code!: string;
    public blocked!: boolean;
    public date_created!: Date;
    public date_updated!: Date;

    public getSalary!: HasOneGetAssociationMixin<Salary>;
    public setSalary!: HasOneSetAssociationMixin<Salary, number>;

    public static associations: {
        salary: Association<User, Salary>;
    };
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otherName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: "portal_user",
        createdAt: false,
        updatedAt: false,
        sequelize: postgresDatabase // this bit is important
    }
);


User.hasOne(Salary, {
    foreignKey: 'portal_user_id',
    constraints: false
});
