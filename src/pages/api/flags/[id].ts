import type {NextApiRequest, NextApiResponse} from 'next'
import {
  Controller,
  getQuery,
  install,
  Repositorys,
} from 'nextjs-backend-helpers'
import {FlagRepository} from '../../../repositories/flag-repository'

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
}

export default install(FlagIdController)
