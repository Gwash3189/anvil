import {Flag} from '@prisma/client'
import {string, object, boolean, ValidationError} from 'yup'
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

export class FlagController extends Controller {
  static newFlagSchema = object({
    name: string()
      .required('A new flag requires a name'),
    active: boolean()
      .required(
        'A new flag needs an active state. It can be either true or false.',
      ),
  })

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
    try {
      const {name, active} = await FlagController
        .newFlagSchema
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

export default install(FlagController)
