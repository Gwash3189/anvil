import {expect} from 'chai'

import {get} from 'nextjs-backend-helpers'
import {HealthController} from '../../../src/pages/api/health'

describe('HealthController', () => {
  it('says its alive', async () => {
    const response = await get(HealthController)

    expect(response.json).to.deep.equal({
      alive: true,
    })
  })
})
