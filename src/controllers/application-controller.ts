import { PrismaClientInitializationError } from '@prisma/client/runtime';
import {Controller, Logger} from 'nextjs-backend-helpers';
import {ValidationError} from 'yup';

export class AppController extends Controller {
  constructor() {
    super()

    this.rescue(ValidationError, (error, _request, response) => {
      response.status(400).json({
        errors: error.errors,
      })
    })

    this.rescue(Error, (error, _request, response) => {
      response.status(500).json({
        errors: [error.constructor.name, error.message],
      })
    })

    this.rescue(PrismaClientInitializationError, (error, request, response) => {
      Logger.error({ message: 'Looks like we cant reach the database. Is the connection string right? Is the database up?' })
      response.status(500).json({
        errors: ['unable to reach database']
      })
    })
  }
}
