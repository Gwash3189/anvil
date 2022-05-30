import {expect} from 'chai'

import {get, patch, post, Repositorys, RequestBuilder} from 'nextjs-backend-helpers'
import {Flag} from '@prisma/client'
import {FlagIdController} from '../../../../src/pages/api/flags/[id]'
import {FlagRepository} from '../../../../src/repositories/flag-repository'

describe('FlagIdController', () => {
  let flag: Partial<Flag>

  describe('#get', () => {
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

  describe('#patch', () => {
    let request; let response

    beforeEach(async () => {
      flag = {
        name: 'A name',
        active: true,
      }
      request = new RequestBuilder()
        .query({
          id: '123',
        })
        .body(flag)
      Repositorys.find(FlagRepository).mock('update', jest.fn(() => ({...flag, id: '123'})))
      response = await patch(FlagIdController, request)
    })

    afterEach(() => {
      Repositorys.find(FlagRepository).reset('update')
    })

    it('updates the flag', () => {
      expect(response.json).to.deep.equal({
        data: {
          id: '123',
          active: true,
          name: 'A name',
        },
      })
    })
  })
})
