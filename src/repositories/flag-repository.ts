import {Flag, Prisma, PrismaClient} from '@prisma/client'
import {repository} from 'nextjs-backend-helpers'
import {BaseRepository} from './base-repository'

@repository()
export class FlagRepository extends BaseRepository<
Prisma.FlagDelegate<any>,
Flag
> {
  getDataType(client: PrismaClient): Prisma.FlagDelegate<any> {
    return client.flag
  }

  async create({name, active}: {name: string; active: boolean}) {
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
}
