import {expect} from 'chai'

import {
  get,
  Repositorys,
  RequestBuilder,
  ResponseType,
} from 'nextjs-backend-helpers'
import {Flag} from '@prisma/client'
import {FlagRepository} from '../../../../src/repositories/flag-repository'
import {FlagController} from '../../../../src/pages/api/flags'

describe('FlagController', () => {
  let flag: Flag
  let response: ResponseType

  describe('#get', () => {
    beforeEach(async () => {
      flag = {
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '123',
        name: 'A name',
      }

      Repositorys.find(FlagRepository).mock('all', jest.fn(() => [flag]))
      const request = new RequestBuilder().query({page: 1})
      response = await get(FlagController, request)
    })

    afterEach(() => {
      Repositorys.find(FlagRepository).reset('all')
    })

    it('returns a list of flags', () => {
      expect(response.json).to.deep.equal({
        data: {
          flags: [flag],
          page: 1,
        },
      })
    })

    describe('when a name query paramter is provided', () => {
      beforeEach(async () => {
        const request = new RequestBuilder()
          .query({page: 1, name: 'A name'})
        Repositorys
          .find(FlagRepository)
          .mock('findByName', jest.fn(() => [flag]))
        response = await get(FlagController, request)
      })

      afterEach(() => {
        Repositorys
          .find(FlagRepository)
          .reset('findByName')
      })

      it('calls findByName', () => {
        const mockCalls = (
          Repositorys
            .find(FlagRepository)
            .findByName as jest.Mock
        )
          .mock.calls[0] as Array<Record<string, string>>

        expect(mockCalls).to.deep.equal([{name: 'A name', page: 1}])
      })
    })
  })
})
