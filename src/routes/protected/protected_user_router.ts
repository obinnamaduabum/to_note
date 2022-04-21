import {UsersController} from "../../controllers/user-controller";
import {Router} from 'express';
import {AuthenticationUtils} from "../../module/access/authentication_utils";

class ProtectedUserRouter {

    public router: Router;

    constructor() {

        this.router = Router();
        this.router.post('/employee/add', AuthenticationUtils.checkIfAuthenticated, UsersController.addEmployee);
        this.router.post('/employee/update', AuthenticationUtils.checkIfAuthenticated, UsersController.updateEmployee);

        this.router.get('/check/email', AuthenticationUtils.checkIfAuthenticated,
            UsersController.checkIfEmailExistForLoggedInUser);

        this.router.post('/profile/update', AuthenticationUtils.checkIfAuthenticated,
            UsersController.updateUserProfile);
    }
}

export default ProtectedUserRouter;
