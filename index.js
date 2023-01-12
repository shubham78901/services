const express = require('express')
const fetch = require('node-fetch');
var transfer_function=require('./stas-sdk/examples/main')

const cors = require("cors")
const app = express();
app.use(express.json())


app.use(cors());
app.get("/",(req,res)=>
{

  res.send("Server running fine")

})


app.post("/address", async (req, res) => {


    var address=req.body.address;
    var network=req.body.network;
    console.log(address)

    let  result = await fetch(`https://api.whatsonchain.com/v1/bsv/${network}/address/${address}/tokens/unspent`)

    result=await result.json();
    console.log(result)

    res.send(result)
})

app.post("/transfer", async (req, res) => {


     var wifi=req.body.wif;
     var txid=req.body.txid;
  
    var addr=req.body.transfer_to;

    transfer_function.transfer_func(wifi,addr,txid)

    


    res.send("transfer function working")
})








app.listen(3000)