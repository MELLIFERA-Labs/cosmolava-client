export type RpcClient = import('@cosmjs/tendermint-rpc').RpcClient;
/**
 * @typedef {import('@cosmjs/tendermint-rpc').RpcClient} RpcClient
 * @implements {RpcClient}
 */
export class CosmoLavaHttpClient implements RpcClient {
    static "__#1@#isInternalConstructing": boolean;
    /**
     * @param {LavaSDK} sdk
     * @returns {Promise<CosmoLavaHttpClient>}
     * */
    static create(sdk: LavaSDK): Promise<CosmoLavaHttpClient>;
    /**
     * @param {LavaSDK} instanse
     * **/
    constructor(instanse: LavaSDK);
    url: string;
    headers: {};
    client: LavaSDK;
    currentBlock(): Promise<string>;
    disconnect(): void;
    /**
     * @param {import('@cosmjs/json-rpc').JsonRpcRequest} request
     * @returns {Promise<import('@cosmjs/json-rpc').JsonRpcSuccessResponse>}
     * */
    execute(request: import('@cosmjs/json-rpc').JsonRpcRequest): Promise<import('@cosmjs/json-rpc').JsonRpcSuccessResponse>;
}
/**
 * @param {import('@lavanet/lava-sdk').LavaSDKOptions} params
 * @returns {Promise<CosmoLavaHttpClient>}
 * */
export function createCosmoLavaHttpClient(params: import('@lavanet/lava-sdk').LavaSDKOptions): Promise<CosmoLavaHttpClient>;
import { LavaSDK } from "@lavanet/lava-sdk";
