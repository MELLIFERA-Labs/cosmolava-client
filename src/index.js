const {
  isJsonRpcErrorResponse,
  parseJsonRpcResponse
} = require('@cosmjs/json-rpc')
const assert = require('node:assert')
const { LavaSDK } = require('@lavanet/lava-sdk')
/**
 * @template T
 * @param {T} value;
 */
const orNull = (value) => value ?? null
/**
 * @template T
 * @param {T} value;
 */
const required = (value) => {
  assert(value, `value "${value} is required`)
  return value
}

const params = {
  abci_info: (/** @type {unknown} */ _) => [],
  abci_query: (/** @type {{ tx: unknown; path: unknown; data: unknown; height: unknown; prove: unknown }} */ p) => [required(p.path), required(p.data), p.height, orNull(p.prove)],
  blockchain: (/** @type {{ tx: unknown; minHeight: unknown; maxHeight: unknown}} */ p) => [p.minHeight ?? 0, p.maxHeight],
  block: (/** @type {{ tx: unknown; height: unknown}} */ p) => [required(p.height)],
  block_results: (/** @type {{ tx: unknown; height: unknown }} */ p) => [required(p.height)],
  block_search: (/** @type {{ tx: unknown; query: unknown; page: unknown; per_page: unknown; order_by: unknown }} */ p) => [required(p.query), orNull(p.page), orNull(p.per_page), orNull(p.order_by)],
  broadcast_tx_async: (/** @type {{ tx: unknown; }} */ p) => [p.tx],
  broadcast_tx_sync: (/** @type {{ tx: unknown; }} */ p) => [p.tx],
  broadcast_tx_commit: (/** @type {{ tx: unknown; }} */ p) => [p.tx],
  commit: (/** @type {{ height: unknown; }} */ p) => [p.height],
  genesis: (/** @type {unknown} */ _) => [],
  health: (/** @type {unknown} */ _) => [],
  num_unconfirmed_txs: (/** @type {unknown} */ _) => [],
  status: (/** @type {unknown} */ _) => [],
  subscribe: (/** @type {unknown} */ _) => [],
  tx_search: (/** @type {{ query: unknown; prove: unknown; page: unknown; per_page: unknown; order_by: unknown; }} */ p) => [required(p.query), orNull(p.prove), orNull(p.page), orNull(p.per_page), orNull(p.order_by)],
  validators: (/** @type {{ height: unknown; page: unknown; per_page: unknown; }} */ p) => [required(p.height), orNull(p.page), orNull(p.per_page)],
  net_info: (/** @type {unknown} */ _) => [],
  unsubscribe: (/** @type {unknown} */ _) => []
}
/**
 * @param {keyof typeof params} method
 * @param {{[key in keyof typeof params]: unknown} } prams
 */
function parsePramsToLava (method, prams) {
  if (!params[method]) {
    throw new Error(`method "${method}" not found`)
  }
  // @ts-ignore
  return params[method](prams)
}
/**
 * @typedef {import('@cosmjs/tendermint-rpc').RpcClient} RpcClient
 * @implements {RpcClient}
 */
class CosmoLavaHttpClient {
  static #isInternalConstructing = false
  /**
   * @param {LavaSDK} instanse
   * **/
  constructor (instanse) {
    if (!CosmoLavaHttpClient.#isInternalConstructing) {
      throw new TypeError('PrivateConstructor is not constructable')
    }
    this.url = 'lava'
    this.headers = {}
    this.client = instanse
  }

  async currentBlock () {
    const blockResponse = JSON.parse(await this.client.sendRelay({
      method: 'abci_info',
      params: []
    }))
    return String(blockResponse.result.response.last_block_height)
  }

  /**
   * @param {LavaSDK} sdk
   * @returns {Promise<CosmoLavaHttpClient>}
   * */
  static async create (sdk) {
    CosmoLavaHttpClient.#isInternalConstructing = true
    if ('then' in sdk && typeof sdk.then === 'function') {
      throw new TypeError('lavaSDK param is Promise')
    }
    return new CosmoLavaHttpClient(sdk)
  }

  disconnect () {
    // nothing to be done
  }

  /**
   * @param {import('@cosmjs/json-rpc').JsonRpcRequest} request
   * @returns {Promise<import('@cosmjs/json-rpc').JsonRpcSuccessResponse>}
   * */
  async execute (request) {
    const preparedRequest = /** @type {import('./types/types').JsonParsedRpcRequest}**/ ({ ...request })
    if ('height' in preparedRequest.params) {
      preparedRequest.params.height = preparedRequest.params.height ?? (await this.currentBlock())
    }
    if (preparedRequest.method === 'blockchain' && 'maxHeight' in preparedRequest.params && ('height' in preparedRequest.params)) {
      preparedRequest.params.height = preparedRequest.params.maxHeight ?? (await this.currentBlock())
    }
    const lavaParams = parsePramsToLava(preparedRequest.method, preparedRequest.params)
    const response = parseJsonRpcResponse(JSON.parse(await this.client.sendRelay({
      method: preparedRequest.method,
      params: [...lavaParams]
    })))
    if (isJsonRpcErrorResponse(response)) {
      throw new Error(JSON.stringify(response.error))
    }
    return response
  }
}

/**
 * @param {import('@lavanet/lava-sdk').LavaSDKOptions} params
 * @returns {Promise<CosmoLavaHttpClient>}
 * */
const createCosmoLavaHttpClient = async (params) => {
  const sdk = await new LavaSDK({ ...params })
  return CosmoLavaHttpClient.create(sdk)
}
module.exports = {
  CosmoLavaHttpClient,
  createCosmoLavaHttpClient
}
