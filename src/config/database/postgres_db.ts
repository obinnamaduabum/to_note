import { Sequelize } from "sequelize";

if(!process.env.PG_DATABASE) {
    throw "Database Configuration properties not found";
}
const postgresDatabase = new Sequelize({
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        host: process.env.PG_HOST,
        dialect: "postgres",
        dialectOptions: {
            requestTimeout: 6000, // increase operation timeout
        },
        define: {
            timestamps: true
        },
        logging: false,
        pool: {
            max: 10,
            min: 1,
            idle: 1,
            evict: 15000,
            acquire: 6000000
        }
});

postgresDatabase.authenticate().then(async (_err)=> {
    console.log('Connection has been established successfully.');
}).catch(function (err) {
    console.log('Unable to connect to the database:', err);
    if (err) throw new Error(err);
});

export  { postgresDatabase };
