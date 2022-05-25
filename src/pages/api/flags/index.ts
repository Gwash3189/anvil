import {Flag} from '@prisma/client'
import type {NextApiRequest, NextApiResponse} from 'next'
import {
  Controller,
  getPageFromQuery,
  getQuery,
  install,
  Repositorys,
} from 'nextjs-backend-helpers'
import {FlagRepository} from '../../../repositories/flag-repository'

type FindByNameQuery = {
  name: string
}

type NewFlagPostBody = {
  name: string,
  active: boolean
}

export class FlagController extends Controller {
  async get(request: NextApiRequest, response: NextApiResponse) {
    const page = getPageFromQuery(request)
    const {name} = getQuery<FindByNameQuery>(request)
    let flags: Flag[] = []

    if (name) {
      flags = await Repositorys.find(FlagRepository).findByName({name})

      response.json({
        data: {
          flags,
        },
      })

      return;
    }

    flags = await Repositorys.find(FlagRepository).all(page)

    response.json({
      data: {
        flags,
        page,
      },
    });
  }

  async post(request: NextApiRequest, response: NextApiResponse) {
    const {active, name} = request.body as NewFlagPostBody
    const flag = await Repositorys.find(FlagRepository).create({
      name,
      active,
    })

    response.json({
      data: {
        flag,
      },
    });
  }
}

export default install(FlagController)
