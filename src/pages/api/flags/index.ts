import {Flag} from '@prisma/client'
import {ValidationError} from 'yup'
import type {NextApiRequest, NextApiResponse} from 'next'
import {
  Controller,
  getPageFromQuery,
  getQuery,
  install,
  Repositorys,
} from 'nextjs-backend-helpers'
import {FlagRepository} from '../../../repositories/flag-repository'
import {newFlagSchema} from '../../../schemas/flags'
import {AppController} from '../../../controllers/application-controller'

type FindByNameQuery = {
  name: string
}

export class FlagController extends AppController {
  async get(request: NextApiRequest, response: NextApiResponse) {
    const page = getPageFromQuery(request)
    const {name} = getQuery<FindByNameQuery>(request)
    let flags: Flag[] = []

    if (name) {
      flags = await Repositorys.find(FlagRepository).findByName({name, page})

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
    const {name, active} = await newFlagSchema
      .validate(request.body)

    const flag = await Repositorys.find(FlagRepository).create({
      name,
      active,
    })

    response.json({
      data: {
        flag,
      },
    })
  }
}

export default install(FlagController)
