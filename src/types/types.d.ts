import('@cosmjs/json-rpc')

type tendermintMethods = 
  "abci_info"           |
  "abci_query"          | 
  "blockchain"          |   
  "block"               | 
  "block_results"       | 
  "block_search"        | 
  "broadcast_tx_async"  | 
  "broadcast_tx_sync"   | 
  "broadcast_tx_commit" | 
  "commit"              | 
  "genesis"             | 
  "health"              |
  "num_unconfirmed_txs" | 
  "status"              | 
  "subscribe"           |
  "tx_search"           | 
  "validators"          | 
  "net_info"            | 
  "unsubscribe"

export interface JsonParsedRpcRequest {
  readonly jsonrpc: "2.0";
  readonly id: JsonRpcId;
  readonly method: tendermintMethods;
  params: {
    [key in tendermintMethods]: JsonCompatibleValue
  };
}
