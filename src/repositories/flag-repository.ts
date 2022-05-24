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

  async findByName({name}: {name: string}) {
    return this.querySingle(async flag => flag.findUnique({
      where: {
        name,
      },
    }))
  }
}
