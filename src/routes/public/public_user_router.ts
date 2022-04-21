import {UsersController} from "../../controllers/user-controller";
import {Router} from 'express';


class PublicUserRouter {

    public router: Router;

    constructor() {

        this.router = Router();

        // @ts-ignore
        this.router.post('/register', UsersController.validate("registration"), UsersController.signUp);

        this.router.get('/check/email/exists', UsersController.checkIfEmailExist);

    }
}

export default PublicUserRouter;
