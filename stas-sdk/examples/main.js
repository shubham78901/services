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
  redeem,
  redeemSplit
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

 
 async function reedem_func(Wif,mergeSplitTxid,index,public_key)
 {
  const mergeSplitTx = await getTransaction(mergeSplitTxid)
 

  var alicePrivateKey= bsv.PrivateKey.fromWIF(Wif);
  var  publicKey=bsv.PublicKey.fromString(public_key);
 
  const redeemHex = await redeem(
    alicePrivateKey,
    publicKey,
    {
      txid: mergeSplitTxid,
      vout: index,
      scriptPubKey: mergeSplitTx.vout[index].scriptPubKey.hex,
      satoshis: bitcoinToSatoshis(mergeSplitTx.vout[index].value)
    },
    null,
    null
  )
  const redeemTxid = await broadcast(redeemHex)
  console.log(`Redeem TX:       ${redeemTxid}`)
  
   }


   async function split_func(BobWif,transferTxid,index,bobAddr)
   {
    const alicePrivateKey = bsv.PrivateKey.fromWIF(BobWif);
    const transferTx = await getTransaction(transferTxid)

    const bobAmount1 = transferTx.vout[index].value / 2
    const bobAmount2 = transferTx.vout[index].value - bobAmount1
    const splitDestinations = []
    splitDestinations[0] = { address: bobAddr, satoshis: bitcoinToSatoshis(bobAmount1) }
    splitDestinations[1] = { address: bobAddr, satoshis: bitcoinToSatoshis(bobAmount2) }

    const splitHex = await split(
      alicePrivateKey,
      {
        txid: transferTxid,
        vout: index,
        scriptPubKey: transferTx.vout[index].scriptPubKey.hex,
        satoshis: bitcoinToSatoshis(transferTx.vout[index].value)
      },
      splitDestinations,
      null,
      null
    )
    const splitTxid = await broadcast(splitHex)
    console.log(`Split TX:        ${splitTxid}`)
    
     }
  
  //  async function merge_func(BobWif,splitTxid,index1,index2,aliceAddr)
  //  {
  //   let  splitHex= await fetch(`https://api.whatsonchain.com/v1/bsv/test/tx/${splitTxid}/hex`)

  
  //   const bobPrivateKey = bsv.PrivateKey.fromWIF(BobWif);
  //   splitHex=await splitHex.json();
 

  //   console.log(splitHex)

  //   const splitTxObj = new bsv.Transaction(splitHex)
  //   console.log(splitTxObj)


  //   const mergeHex = await merge(
  //     bobPrivateKey,
  //     [{
  //       tx: splitTxObj,
  //       vout: 0
  //     },
  //     {
  //       tx: splitTxObj,
  //       vout: 1
  //     }],
  //     aliceAddr,
  //     null,
  //     null
  //   )

  //   const mergeTxid = await broadcast(mergeHex)
  //   console.log(`Merge TX:        ${mergeTxid}`)
    
    
     
  

  
module.exports={
  transfer_func,
  reedem_func,
  split_func,

}