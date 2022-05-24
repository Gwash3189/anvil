import {expect} from 'chai'

import {get, Repositorys, RequestBuilder} from 'nextjs-backend-helpers'
import {Flag} from '@prisma/client'
import {FlagIdController} from '../../../../src/pages/api/flags/[id]'
import {FlagRepository} from '../../../../src/repositories/flag-repository'

describe('FlagIdController', () => {
  let flag: Flag

  beforeEach(() => {
    flag = {
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '123',
      name: 'A name',
    }

    Repositorys.find(FlagRepository).mock('findById', jest.fn(() => flag))
  })

  it('returns the found flag', async () => {
    const response = await get(
      FlagIdController,
      new RequestBuilder().query({id: '123'}),
    )

    expect(response.json).to.deep.equal({
      data: {flag},
    })
  })
})
