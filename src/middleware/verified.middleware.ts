import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';

@Injectable()
export class checkVerification implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private childModel: Model<User>,
    @InjectModel(pUser.name) private parentModel: Model<pUser>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id || req.body.id;

      const checkVerification =
        (await this.childModel.findById(userId)) ||
        (await this.parentModel.findById(userId));

      if (!checkVerification) {
        res.status(409).json({
          message: 'Relation not found',
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(400).json({
        message: 'Something went wrong',
        status: 400,
        error: error,
      });
    }
  }
}
