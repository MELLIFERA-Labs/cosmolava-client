const { createCosmoLavaHttpClient, CosmoLavaHttpClient: _CosmoLavaHttpClient } = require('../src')
const {
  DirectSecp256k1HdWallet
} = require('@cosmjs/proto-signing')
const { SigningStargateClient } = require('@cosmjs/stargate')
const assert = require('node:assert')
require('dotenv').config()
const { Tendermint34Client } = require('@cosmjs/tendermint-rpc');

(async () => {
  assert(process.env.PRIVATE_KEY, 'PRIVATE_KEY is not defined')
  assert(process.env.MNEMONIC, 'MNEMONIC is required for this example')
  const cosmoLavaHttpClient = await createCosmoLavaHttpClient({
    privateKey: process.env.PRIVATE_KEY,
    chainID: process.env.CHAIN_ID ?? 'LAV1',
    geolocation: process.env.GEO ?? '1'
  })
  const tendermintLavaClient = await Tendermint34Client.create(cosmoLavaHttpClient)
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
    prefix: 'lava@'
  })
  const client = await SigningStargateClient.createWithSigner(tendermintLavaClient, signer)
  const result = await client.sendTokens('lava@1076ldtgsn9pd4kykmw6m977u6a0vvka4cynznq', 'lava@1rgs6cp3vleue3vwffrvttjtl4laqhk8fthu466',
    [{
      amount: '1',
      denom: 'ulava'
    }], {
      amount: [{ denom: 'ulava', amount: '5000' }],
      gas: '200000'
    })
  console.info(result)
})()
