import type {NextApiRequest, NextApiResponse} from 'next'
import {
  Controller,
  getQuery,
  install,
  Repositorys,
} from 'nextjs-backend-helpers'
import {ValidationError} from 'yup'
import {FlagRepository} from '../../../repositories/flag-repository'
import {flagSchema} from '../../../schemas/flags'

type FlagIdQuery = {
  id: string
}

export const config = Controller.configuration

export class FlagIdController extends Controller {
  async get(request: NextApiRequest, response: NextApiResponse) {
    const {id} = getQuery<FlagIdQuery>(request)
    const flag = await Repositorys.find(FlagRepository).findById(id)

    response.json({
      data: {
        flag,
      },
    });
  }

  async patch(request: NextApiRequest, response: NextApiResponse) {
    try {
      const {id} = getQuery<FlagIdQuery>(request)
      const {name, active} = await flagSchema
        .validate(request.body)

      const flag = await Repositorys.find(FlagRepository).update({
        id,
        name,
        active,
      })

      response.json({
        data: flag,
      })

      return
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        response.status(400).json({
          errors: error.errors,
        })

        return
      }

      response.status(500).json({
        errors: [(error as Error).message],
      })
    }
  }
}

export default install(FlagIdController)
