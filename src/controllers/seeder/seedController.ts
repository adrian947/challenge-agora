import { Request, Response } from "express";
import {seedService}  from '../../services/seedService'

export const seedController = async (req: Request, res: Response) => {
    try {
        const seederUser = await seedService();
        return res.status(200).json({ msg: seederUser });
    } catch (error: any) {        
        
        return res.status(500).json({ msg: error.message });
    }
};


