import {Authentication} from "../../controllers/authentication-controller";
import {Router} from 'express';

class ProtectedAuthenticationRouter {

    public router: Router = Router();

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes() {
        this.router.get('/me', Authentication.me);
        this.router.get('/logout', Authentication.logOut);
        this.router.post('/logout', Authentication.logOut);
    }
}

export default ProtectedAuthenticationRouter;
