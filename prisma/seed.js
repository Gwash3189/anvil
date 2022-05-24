const Prisma = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const client = new Prisma.PrismaClient()



async function createItems() {
  await client.item.deleteMany()

  return await Promise.all(new Array(faker.datatype.number({
    max: 50,
    min: 1
  })).fill(0).map(() => {
    return {
      name: faker.name.jobTitle()
    }
  }).map(async (item) => {
    return await client.item.create({
      data: {
        name: item.name
      }
    })
  }))
}

async function createFlags(items = []) {
  await client.flag.deleteMany()
  return await Promise.all(new Array(faker.datatype.number({
    max: 500,
    min: 100
  })).fill(0)
  .map(() => {
    return {
      active: faker.datatype.boolean(),
      name: faker.name.jobTitle()
    }
  }).map(async (flag) => {
    const itemId = items[faker.datatype.number({ min: 0, max: items.length - 1 })].id

    return await client.flag.create({
      data: {
        active: flag.active,
        name: flag.name,
        items: {
          connect: {
            id: itemId
          }
        }
      }
    })
  }))
}

async function createWebhooks(items = [], flags = []) {
  await client.webhook.deleteMany()

  return await Promise.all(new Array(faker.datatype.number({
    max: 10000,
    min: 5000
  })).fill(0)
  .map(() => {
    return {
      lastSent: faker.date.recent()
    }
  }).map(async (webhook) => {
    const itemId = items[faker.datatype.number({ min: 0, max: items.length - 1 })].id
    const flagId = flags[faker.datatype.number({ min: 0, max: flags.length - 1 })].id

    return await client.webhook.create({
      data: {
        lastSent: webhook.lastSent,
        flagId,
        itemId,
      }
    })
  }))
}

const start = async function () {
  const items = await createItems()
  const flags = await createFlags(items)
  await createWebhooks(items, flags)
}

start()

