import {postgresDatabase} from '../config/database/postgres_db';
import {
    Model,
    DataTypes
} from 'sequelize';

export class Role extends Model {

    public id!: number;
    public name!: string;
    public type!: string;
    public date_created!: Date;
    public date_updated!: Date;
}


Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: "role",
        createdAt: false,
        updatedAt: false,
        sequelize: postgresDatabase
    }
);
