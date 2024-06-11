import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { CustomRequest } from "../types/custom";

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      next();
    }
  };
};

export const validateUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    if (
        !req.user ||
        !req.user.username ||
        typeof req.user.username !== "string" ||
        req.user.username.length < 3 ||
        req.user.username.length > 30
    ) {
        return res.status(400).json({ error: "Invalid user information" });
    }
    next();
};
