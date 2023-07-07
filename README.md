[![conventional commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)  ![node](https://img.shields.io/badge/node-%3E=18.16.1-green) [![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
  
# cosmolava-client
Lava http client to use [lava-sdk](https://github.com/lavanet/lava-sdk) with [cosmjs](https://github.com/cosmos/cosmjs) 

This package is currently in the Alpha stage and is not production-ready for all usecases. 
Because of [lava-sdk](https://github.com/lavanet/lava-sdk) in Alpha

<img src="https://github.com/MELLIFERA-Labs/cosmolava-client/blob/main/cosmolava.png" width="30%">

## Installation
npm
```
npm i cosmoslava-client
```
yarn 
```
yarn add cosmoslava-client
```
## Usage 
1. Use build in lava-sdk instance 
```js
const cosmoLavaHttpClient = await createCosmoLavaHttpClient({
    privateKey: process.env.PRIVATE_KEY,
    chainID: process.env.CHAIN_ID ?? 'LAV1',
    geolocation: process.env.GEO ?? '1'
})
const tendermintLavaClient = await Tendermint34Client.create(cosmoLavaHttpClient)
// fully functional cosmjs client :)
const client = await SigningStargateClient.createWithSigner(tendermintLavaClient, signer)
```
2. Provide you own lava-sdk instance(To use this approach you need to check lava-sdk compatibility with this package by yourself)
```js
const lavaSdk = await new LavaSDK({
    privateKey: process.env.PRIVATE_KEY,
    chainID: process.env.CHAIN_ID ?? 'LAV1',
    geolocation: process.env.GEO ?? '1'
  })

const lavaClient = await CosmoLavaHttpClient.create(lavaSdk)
const tendermintLavaClient = await Tendermint34Client.create(lavaClient)
// fully functional cosmjs client :)
const client = await SigningStargateClient.createWithSigner(tendermintLavaClient, signer)
```
__Check `examples` folder for more examples__

## You want to get involved? 😍

Please submit a pull request if you know any resources that might be helpful to the community. ❤️
