import * as dotEnvFlow from "dotenv-flow";
dotEnvFlow.config();
import {postgresDatabase} from "./config/database/postgres_db";
import {CustomRouterInterface} from "./interface/custom_router_interface";
import ProtectedUserRouter from "./routes/protected/protected_user_router";
import PublicUserRouter from "./routes/public/public_user_router";
import PublicAuthenticationRouter from "./routes/public/public_authentication_router";
import ProtectedAuthenticationRouter from "./routes/protected/protected_authentication_router";
import ProtectedUserManagementRouter from "./routes/protected/protected_user_management_router";
import IndexRouter from "./routes/index_router";
import {App} from "./app";

let customRouters: CustomRouterInterface[] = [
    {
        url: '/',
        routerObj: new IndexRouter()
    },
    {
        url: '/v1/api/public/auth',
        routerObj: new PublicAuthenticationRouter()
    },
    {
        url: '/v1/api/protected/auth',
        routerObj: new ProtectedAuthenticationRouter()
    },
    {
      url: '/v1/api/protected/user_management',
      routerObj: new ProtectedUserManagementRouter()
    },
    {
        url: '/v1/api/protected/users',
        routerObj: new ProtectedUserRouter()
    },
    {
        url: '/v1/api/public/users',
        routerObj: new PublicUserRouter()
    }
];

let PORT;
let HOSTNAME;


if(process.env.NODE_ENV === 'development'){
    if(process.env.HOSTNAME) {
        HOSTNAME = process.env.HOSTNAME;
    }
}

if (process.env.PORT) {
    PORT = parseInt(process.env.PORT);
} else {
    PORT = 3000;
}

console.log(PORT);
console.log(HOSTNAME);

const app = new App(
    customRouters,
    PORT,
    HOSTNAME
);

try {
    postgresDatabase.sync({alter: false, force: false}).then(async () => {
        // await InitStartUpActions.init();
        // console.error('postgres connected');
        app.listen();
    }).catch((err) => {
        console.error('postgres not connected');
        console.error(err);
    });

} catch (e) {
    console.error(e);
}


