import {Router} from "express";
import {UserManagementController} from "../../controllers/user_management_controller";
import {AuthenticationUtils} from "../../module/access/authentication_utils";

class ProtectedUserManagementRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.router.post('/', AuthenticationUtils.checkIfAuthenticated, UserManagementController.index);
        this.router.get('/:userId', AuthenticationUtils.checkIfAuthenticated, UserManagementController.findByUserId);
    }
}

export default ProtectedUserManagementRouter;
