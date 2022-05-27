import {Flag, Prisma, PrismaClient} from '@prisma/client'
import {repository} from 'nextjs-backend-helpers'
import {BaseRepository} from './base-repository'

type UpdateFlagType = {
  id: string,
  name?: string,
  active?: boolean
}

@repository()
export class FlagRepository extends BaseRepository<
Prisma.FlagDelegate<any>,
Flag
> {
  getDataType(client: PrismaClient): Prisma.FlagDelegate<any> {
    return client.flag
  }

  async create({name, active}: Pick<Prisma.FlagCreateInput, 'name' | 'active'>) {
    return this.querySingle(async flag => flag.create({
      data: {
        active,
        name,
      },
    }))
  }

  async findByName({name, page = 0}: {name: string, page?: number}) {
    return this.queryMany(async flag => flag.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      take: 30,
      skip: page * 30
    }))
  }

  async update({id, name, active}: UpdateFlagType) {
    let data: Record<string, string | boolean> = {}
    if (name !== undefined) {
      data.name = name
    }
    if (active !== undefined) {
      data.active = active
    }
    return this.querySingle(async flag => {
      return await flag.update({
        where: {
          id
        },
        data
      })
    })
  }
}
