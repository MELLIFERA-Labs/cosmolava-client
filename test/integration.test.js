// @ts-check
const { expect, jest, test, beforeAll } = require('@jest/globals')
const assert = require('node:assert')
const { createCosmoLavaHttpClient, CosmoLavaHttpClient: _CosmoLavaHttpClient } = require('../src')
const { Tendermint34Client } = require('@cosmjs/tendermint-rpc')
require('dotenv').config()
/**
 * @type {_CosmoLavaHttpClient}
 **/
let cosmoLavaHttpClient
/**
 * @type {Tendermint34Client}
 * */
let tendermintLavaClient

beforeAll(async () => {
  jest.setTimeout(50000)
  assert(process.env.PRIVATE_KEY, 'PRIVATE_KEY is not defined')
  assert(process.env.LAVA_RPC_URL, 'LAVA_RPC_URL is not defined')
  cosmoLavaHttpClient = await createCosmoLavaHttpClient({
    privateKey: process.env.PRIVATE_KEY,
    chainID: process.env.CHAIN_ID ?? 'LAV1',
    geolocation: process.env.GEO ?? '1'
  })
  tendermintLavaClient = await Tendermint34Client.create(cosmoLavaHttpClient)
})

test('method: tendermint.validatorsAll()', async () => {
  const resultTendermintLava = await tendermintLavaClient.validatorsAll()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    blockHeight: expect.any(Number),
    count: expect.any(Number),
    total: expect.any(Number),
    validators: expect.arrayContaining([expect.objectContaining({
      pubkey: expect.any(Object),
      votingPower: expect.any(BigInt),
      address: expect.any(Uint8Array),
      proposerPriority: expect.any(Number)
    })])
  }))
})
test('method: tendermint.abciInfo()', async () => {
  const resultTendermintLava = await tendermintLavaClient.abciInfo()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    data: expect.any(String),
    lastBlockHeight: expect.any(Number),
    lastBlockAppHash: expect.any(Uint8Array)
  }))
})
test('method: tendermint.blockchain()', async () => {
  const block = await cosmoLavaHttpClient.currentBlock()
  const resultTendermintLava = await tendermintLavaClient.blockchain(parseInt(block) - 1000, parseInt(block))
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    lastHeight: expect.any(Number),
    blockMetas: expect.arrayContaining([expect.objectContaining({
      blockId: expect.any(Object),
      blockSize: expect.any(Number),
      header: expect.any(Object),
      numTxs: expect.any(Number)
    })])
  }))
})

test('method: tendermint.blockSearch()', async () => {
  const block = await cosmoLavaHttpClient.currentBlock()
  const resultTendermintLava = await tendermintLavaClient.blockSearch({ query: `block.height > ${parseInt(block) - 100}` })
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    totalCount: expect.any(Number),
    blocks: expect.arrayContaining([expect.objectContaining({
      blockId: expect.any(Object),
      block: expect.any(Object)
    })])
  }))
})

test('method: tendermint.commit()', async () => {
  const resultTendermintLava = await tendermintLavaClient.commit()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    canonical: expect.any(Boolean),
    header: expect.any(Object),
    commit: expect.any(Object)
  }))
})

test('method: tendermint.genesis()', async () => {
  const resultTendermintLava = await tendermintLavaClient.genesis()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    genesisTime: expect.any(Object),
    chainId: expect.any(String),
    consensusParams: expect.any(Object),
    validators: expect.any(Array),
    appHash: expect.any(Uint8Array),
    appState: expect.any(Object)
  }))
})

test('method: tendermint.health()', async () => {
  const resultTendermintLava = await tendermintLavaClient.health()
  expect(resultTendermintLava).toEqual(null)
})

test('method: tendermint.numUnconfirmedTxs()', async () => {
  const resultTendermintLava = await tendermintLavaClient.numUnconfirmedTxs()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    total: expect.any(Number),
    totalBytes: expect.any(Number)
  }))
})

test('method: tendermint.status()', async () => {
  const resultTendermintLava = await tendermintLavaClient.status()
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    nodeInfo: expect.any(Object),
    syncInfo: expect.any(Object),
    validatorInfo: expect.any(Object)
  }))
})

test('method: tendermint.txSearch()', async () => {
  const resultTendermintLava = await tendermintLavaClient.txSearch({ query: "tx.hash='813DC111E31E60B8D404F8DCABAFA1CD5BB0C208B2DEE4AEB8C8A34B46507342'" })
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    totalCount: expect.any(Number),
    txs: expect.any(Array)
  }))
})

test('method: tendermint.validators()', async () => {
  const block = await cosmoLavaHttpClient.currentBlock()
  const resultTendermintLava = await tendermintLavaClient.validators({ height: parseInt(block) })
  expect(resultTendermintLava).toEqual(expect.objectContaining({
    blockHeight: expect.any(Number),
    count: expect.any(Number),
    total: expect.any(Number),
    validators: expect.any(Array)
  }))
})
