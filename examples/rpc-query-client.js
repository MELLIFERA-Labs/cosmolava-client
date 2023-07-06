const { QueryClient, setupStakingExtension, setupGovExtension } = require('@cosmjs/stargate')
const { createCosmoLavaHttpClient, CosmoLavaHttpClient: _CosmoLavaHttpClient } = require('../src')
const assert = require('node:assert')
require('dotenv').config()
const { Tendermint34Client } = require('@cosmjs/tendermint-rpc');
(async () => {
  assert(process.env.PRIVATE_KEY, 'PRIVATE_KEY is not defined')
  const cosmoLavaHttpClient = await createCosmoLavaHttpClient({
    privateKey: process.env.PRIVATE_KEY,
    chainID: process.env.CHAIN_ID ?? 'LAV1',
    geolocation: process.env.GEO ?? '1'
  })
  const tendermintLavaClient = await Tendermint34Client.create(cosmoLavaHttpClient)
  const query = QueryClient.withExtensions(
    tendermintLavaClient,
    setupStakingExtension,
    setupGovExtension
  )
  const votingParamsResult = await query.gov.params('voting')
  console.info(votingParamsResult)
  const validatorsResult = await query.staking.validators('BOND_STATUS_BONDED')
  console.info(validatorsResult)
  const delegationsResult = await query.staking.validatorDelegations('lava@valoper1rgs6cp3vleue3vwffrvttjtl4laqhk8fl78jgd')
  console.info(delegationsResult)
})()
