import {postgresDatabase} from '../config/database/postgres_db';
import {
    Model,
    DataTypes
} from 'sequelize';

export class Salary extends Model {

    public id!: number;
    public amount: bigint | undefined;
    public date_created!: Date;
    public date_updated!: Date;
}

Salary.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.BIGINT,
            allowNull: true
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
        tableName: "portal_user_salary",
        createdAt: false,
        updatedAt: false,
        sequelize: postgresDatabase
    }
);

