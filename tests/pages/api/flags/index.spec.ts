import {expect} from 'chai'

import {
  get,
  post,
  Repositorys,
  RequestBuilder,
  ResponseType,
} from 'nextjs-backend-helpers'
import {Flag} from '@prisma/client'
import {ValidationError} from 'yup'
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
        await get(FlagController, request)
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

  describe('#post', () => {
    let request; let response; let flag

    beforeEach(async () => {
      flag = {
        name: 'a name',
        active: true,
      }
      request = new RequestBuilder().body(flag)
      Repositorys.find(FlagRepository).mock('create', jest.fn(() => flag))
      response = await post(FlagController, request)
    })

    afterEach(() => {
      Repositorys.find(FlagRepository).reset('create')
    })

    it('creates a new flag', () => {
      const mock = (Repositorys.find(FlagRepository).create) as jest.Mock
      expect(mock.mock.calls[0][0]).to.deep.equal({
        active: true,
        name: 'a name',
      })
    })

    it('sends the flag back in a response', () => {
      expect(response.json).to.deep.equal({
        data: {
          flag,
        },
      })
    })

    describe('when the post request has incorrect parameters', () => {
      beforeEach(async () => {
        flag = {
          active: 'true',
        }
        request = new RequestBuilder().body(flag)
        Repositorys.find(FlagRepository).mock('create', jest.fn(() => {
          throw new ValidationError('')
        }))
        response = await post(FlagController, request)
      })

      afterEach(() => {
        Repositorys.find(FlagRepository).reset('create')
      })

      it('returns a 400', () => {
        expect(response.status).to.equal(400)
      })

      it('includes the error in the response', () => {
        expect(response.json).to.deep.equal({
          errors: ['A new flag requires a name'],
        })
      })
    })

    describe('when the database can\'t be reached', () => {
      beforeEach(async () => {
        flag = {
          active: 'true',
          name: 'A name',
        }
        request = new RequestBuilder().body(flag)
        Repositorys.find(FlagRepository).mock('create', jest.fn(() => {
          throw new Error('I can\'t talk to the database')
        }))
        response = await post(FlagController, request)
      })

      it('returns a 500', () => {
        expect(response.status).to.equal(500)
      })

      it('includes the error in the response', () => {
        expect(response.json).to.deep.equal({
          errors: ['I can\'t talk to the database'],
        })
      })
    })
  })
})
