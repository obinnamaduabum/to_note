import {Router} from "express";
import {IndexController} from "../controllers/index-controller";

class IndexRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/',  IndexController.index);
    }
}

export default IndexRouter;
