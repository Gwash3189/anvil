import type {NextApiRequest, NextApiResponse} from 'next'
import {Controller, install} from 'nextjs-backend-helpers'

export class HealthController extends Controller {
  get(request: NextApiRequest, response: NextApiResponse) {
    response.json({
      alive: true,
    });
  }
}

export default install(HealthController)
