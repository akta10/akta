"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backpack_client_1 = require("./backpack_client");

/// EDIT HERE ///
const API_KEY = "5uzqfZ8hgcaN3XNazEEWm2nzboNWCjX1AuaxphpF8N4="
const API_SECRET = "SAOpnzXhAh19CKa7F88MHwk/ZRB1CtSPBqmgcGEhbbg="
/////////////

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMinute = date.getMinutes();
    var strSecond = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
    }
    if (strMinute >= 0 && strMinute <= 9) {
        strMinute = "0" + strMinute;
    }
    if (strSecond >= 0 && strSecond <= 9) {
        strSecond = "0" + strSecond;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHour + seperator2 + strMinute
        + seperator2 + strSecond;
    return currentdate;
}

let successbuy = 0;
let sellbuy = 0;

const init = async (client) => {
    try {
        console.log("\n============================")
        console.log(`Total Buy: ${successbuy} | Total Sell: ${sellbuy}`);
        console.log("============================\n")
        
        console.log(getNowFormatDate(), "Waiting 30 seconds...");
        await delay(30000);

        let userbalance = await client.Balance();
        if (userbalance.USDC.available > 5) {
            await buyfun(client);
        } else {
            await sellfun(client);
            return;
        }
    } catch (e) {
        console.log(getNowFormatDate(), `Try again... (${e.message})`);
        console.log("=======================")

        await delay(3000);
        init(client);

    }
}



const sellfun = async (client) => {
    let GetOpenOrders = await client.GetOpenOrders({ symbol: "WEN_USDC" });
    if (GetOpenOrders.length > 0) {
        let CancelOpenOrders = await client.CancelOpenOrders({ symbol: "WEN_USDC" });
        console.log(getNowFormatDate(), "All pending orders canceled");
    }

    let userbalance2 = await client.Balance();
    console.log(getNowFormatDate(), `My Account Infos: ${userbalance2.WEN.available} $WEN | ${userbalance2.USDC.available} $USDC`, );
    
    let { lastPrice: lastPriceask } = await client.Ticker({ symbol: "WEN_USDC" });
    console.log(getNowFormatDate(), "Price WEN_USDC:", lastPriceask);
    let quantitys = (userbalance2.WEN.available - (userbalance2.WEN.available * 0.02)).toFixed(0).toString();
    console.log(getNowFormatDate(), `Trade... ${quantitys} $WEN to ${(lastPriceask * quantitys).toFixed(2)} $USDC`);
    let orderResultAsk = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastPriceask.toString(),
        quantity: quantitys,
        side: "Ask",
        symbol: "WEN_USDC",
        timeInForce: "IOC"
    })
    if (orderResultAsk?.status == "Filled" && orderResultAsk?.side == "Ask") {
        sellbuy += 1;
        console.log(getNowFormatDate(), "Sold successfully:", `Order number:${orderResultAsk.id}`);
        init(client);
    } else {
        if (orderResultAsk?.status == 'Expired'){
            throw new Error("Sell Order Expired");
        } else{
            
            throw new Error(orderResultAsk?.status);
        }
    }
}

const buyfun = async (client) => {
    let GetOpenOrders = await client.GetOpenOrders({ symbol: "WEN_USDC" });
    if (GetOpenOrders.length > 0) {
        let CancelOpenOrders = await client.CancelOpenOrders({ symbol: "WEN_USDC" });
        console.log(getNowFormatDate(), "All pending orders canceled");
    }
    let userbalance = await client.Balance();
    let balanceSol = 0;
    if (userbalance.WEN) {
        balanceSol = userbalance.WEN.available
    }
    console.log(getNowFormatDate(), `My Account Infos: ${balanceSol} $WEN | ${userbalance.USDC.available} $USDC`, );
    let { lastPrice } = await client.Ticker({ symbol: "WEN_USDC" });
    console.log(getNowFormatDate(), "Price of WEN_USDC:", lastPrice);
    let quantitys = ((userbalance.USDC.available - 2) / lastPrice).toFixed(0).toString();
    console.log(getNowFormatDate(), `Trade ... ${(userbalance.USDC.available - 2).toFixed(2).toString()} $USDC to ${quantitys} $WEN`);
    let orderResultBid = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastPrice.toString(),
        quantity: quantitys,
        side: "Bid",
        symbol: "WEN_USDC",
        timeInForce: "IOC"
    })
    if (orderResultBid?.status == "Filled" && orderResultBid?.side == "Bid") {
        successbuy += 1;
        console.log(getNowFormatDate(), "Bought successfully:", `Order number: ${orderResultBid.id}`);
        init(client);
    } else {
        if (orderResultBid?.status == 'Expired'){
            throw new Error("Buy Order Expired");
        } else{
            throw new Error(orderResultBid?.status);
        }
    }
}

(async () => {
    const apisecret = API_SECRET;
    const apikey = API_KEY;
    const client = new backpack_client_1.BackpackClient(apisecret, apikey);
    init(client);
})()
