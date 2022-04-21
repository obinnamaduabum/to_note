import {postgresDatabase} from "../config/database/postgres_db";

export class Sequence {

    static async create(name: string) {
        const query = "CREATE SEQUENCE IF NOT EXISTS "+ name +" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1";
        return postgresDatabase.query(query);
    }
}
