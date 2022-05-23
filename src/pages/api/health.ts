import type { NextApiRequest, NextApiResponse } from 'next'
import { Controller, install } from 'nextjs-backend-helpers'

export class HealthController extends Controller {
  get(req: NextApiRequest, res: NextApiResponse) {
    return res.json({
      alive: true
    })
  }
}

export default install(HealthController)
