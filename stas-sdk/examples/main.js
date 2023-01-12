const bsv = require('bsv')
const fetch = require('node-fetch');

var prompt = require('prompt-sync')();
require('dotenv').config()


const {
  contract,
  issue,
  transfer,
  split,
  merge,
  mergeSplit,
  redeem
} = require('../index')

const {
  bitcoinToSatoshis,
  getTransaction,
  getFundsFromFaucet,
  broadcast
} = require('../index').utils

 async function transfer_func(BobWif,aliceAddr,issueTxid)
{
  
  // const BobWif=prompt("Enter WIF of bob :")
  
  
  //  const aliceAddr=prompt("Enter Address of Alice :")
  

  //  const issueTxid=prompt("Enter previous Transaction-id output of which  u are going to spend: ")
  console.log("transfer function called")
    
    const NETWORK = 'testnet';

    
 
const bsvNetwork = 'testnet';
  



  const bobPrivateKey = bsv.PrivateKey.fromWIF(BobWif);
  const issueTx = await getTransaction(issueTxid)

  const transferHex = await transfer(
    bobPrivateKey,
    {
      txid: issueTxid,
      vout: 1,
      scriptPubKey: issueTx.vout[1].scriptPubKey.hex,
      satoshis: bitcoinToSatoshis(issueTx.vout[1].value)
    },
    aliceAddr,
    null,
    null
  )
  let transferTxid
  try {
    transferTxid = await broadcast(transferHex)
  } catch (e) {
    console.log(e)
    return
  }
  console.log(`Transfer TX:     ${transferTxid}`)
  const transferTx = await getTransaction(transferTxid)

 
  }

  //  transfer_func(BobWif,aliceAddr,issueTx)
  
module.exports={
  transfer_func
}