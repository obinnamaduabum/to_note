import {Authentication} from "../../controllers/authentication-controller";
import {Router} from 'express';

class PublicAuthenticationRouter {

    public router: Router = Router();

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes() {
        // @ts-ignore
        this.router.post('/login', Authentication.validate('validateUserCredentials'), Authentication.authenticateUser);
    }
}

export default PublicAuthenticationRouter;
