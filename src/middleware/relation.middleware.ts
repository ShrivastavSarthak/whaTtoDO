import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';

@Injectable()
export class CheckRelation implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private childModel: Model<User>,
    @InjectModel(pUser.name) private parentModel: Model<pUser>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const cId = req.params.cId || req.body.cId  ;
      const pId = req.params.pId || req.body.pId  ;

      console.log(cId,pId);
      
      

      const check = await this.parentModel.findOne({
        _id: pId,
        children: { $in: [cId] },
      });

      if (check) {
        next();
      } else {
        res.status(401).json({
          message: 'Relation not found',
        });
      }
    } catch (error) {
      res.status(401).json({
        message: 'Something went wrong',
        status: 401,
        error: error,
      });
    }
  }
}
