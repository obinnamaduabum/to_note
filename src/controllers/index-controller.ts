import {Request, Response} from "express";

export class IndexController {

    static async index(req: Request, res: Response) {
        return res.status(200).send({
            success: true,
            message: 'I am here, hello am an app',
        });
    }

    static async healthCheck(req: Request, res: Response) {
        return res.status(200).send({
            success: true,
            message: 'I am here hello',
        });
    }
}
