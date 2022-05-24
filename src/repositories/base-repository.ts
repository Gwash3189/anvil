import {PrismaClient} from '@prisma/client'
import {BaseRepository as Base} from 'nextjs-backend-helpers'

export abstract class BaseRepository<T, X> extends Base<T, X> {
  createClient() {
    return new PrismaClient()
  }
}
