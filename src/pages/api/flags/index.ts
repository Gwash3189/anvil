import {Flag} from '@prisma/client'
import {string, object, boolean, InferType, ValidationError} from 'yup'
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

type NewFlagBody = InferType<typeof FlagController.newFlagSchema>

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
    const value = await Try
      .of(async () => FlagController
        .newFlagSchema
        .validate(request.body)
      )

    await value.left((error: any) => {
      response.status(400).json({
        errors: error.errors,
      })
    })

    await value.right(async (body: Promise<NewFlagBody>) => {
      const result = await Try<Promise<Flag>, Error>(async () => {
        const { name, active } = await body

        return Repositorys.find(FlagRepository).create({
          name: name,
          active: active,
        }) as Promise<Flag>
      })

      result.right(async (flag: Promise<Flag>) => {
        response.json({
          data: {
            flag: await flag,
          },
        })
      })

      result.left((error: Error) => {
        response.status(500).json({
          errors: [error.message]
        })
      })
    })
  }
}

export default install(FlagController)

class Try {
  public error
  public value

  static async of(func: Function) {
    return new Try(await func())
  }

  constructor(value?: Awaited<any>, error?: Error) {
    this.value = value || null
    this.error = error || null
  }

  static async left (func: () => Awaited<any>) {
    return Try.of(() => func())
  }

  async left(func: (value: Error) => Awaited<any>) {
    const awaitedError = await this.error

    if(awaitedError) {
      return Try.of(() => func(awaitedError))
    }
  }

  async right(func: (value: Awaited<any>) => Awaited<any>) {
    const awaitedValue = await this.value

    if(awaitedValue) {
      return Try.of(() => func(awaitedValue))
    }
  }
}
