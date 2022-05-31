import type {NextApiRequest, NextApiResponse} from 'next'
import {
  Controller,
  getQuery,
  install,
  Repositorys,
} from 'nextjs-backend-helpers'
import {
  AppController,
} from '../../../controllers/application-controller'
import {FlagRepository} from '../../../repositories/flag-repository'
import {flagSchema} from '../../../schemas/flags'

type FlagIdQuery = {
  id: string
}

export const config = Controller.configuration

export class FlagIdController extends AppController {
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
    });
  }
}

export default install(FlagIdController)
