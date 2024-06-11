import { Response } from "express";
import db from "../database/database";
import { CustomRequest } from "../types/custom";

export const joinRoom = (req: CustomRequest, res: Response): void => {
    if (!req.user) {
        res.sendStatus(403);
        return;
    }

    const { room } = req.body;
    const username = req.user.username;

    // Update the user's room in the database
    db.run(
        "UPDATE users SET room = ? WHERE username = ?",
        [room, username],
        (err) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
};
