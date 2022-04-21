import {QueryTypes} from "sequelize";
import {postgresDatabase} from "../config/database/postgres_db";

export class MySequences {

    static async getUserId() {
        return MySequences.createOrGenerate('user_id_seq');
    }

    static async createOrGenerate(sequenceTableName: string) {

        try {
            const query = "CREATE sequence IF NOT EXISTS " + sequenceTableName + " start with 0 minvalue 0 increment BY 1;";
            const data: any = await postgresDatabase.query(query);
            if (data) {
                const value: any[] = await postgresDatabase.query("SELECT nextval('" + sequenceTableName + "')", {
                    type: QueryTypes.SELECT
                });
                if(value){
                  if(value.length > 0){
                      return value[0]['nextval'];
                  }
                  return null;
                }
               return null;
            }
            return null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
