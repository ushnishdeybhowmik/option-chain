const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const fs = require("fs");

const url = "https://www.nseindia.com/option-chain#optionChainTable-indices";
let callsOI = [];
let putsOI = [];
let strikePrice = [];
let data_row = [];
const scrapeData = async () => {
    try {
        const {data} = await axios.get(url);
        await fs.writeFile("out.txt", data, (err) => {
            console.log(err);
        })

        console.log("File Saved.");
        const $ = cheerio.load(data);

        const listItems = $(".optionChainTable table tbody tr");
        listItems.each((idx, el) => {
            console.log("Pass");
            let call_OI = $(el).children("td").get(1);
            let strike_pr = $(el).children("td").get(11);
            let put_OI = $(el).children("td").get(21);
            console.log(`Open Interest (Calls) ${call_OI}, Open Interest (Puts) ${put_OI} for Strk Price ${strike_pr}`);
            let row = {
                callOI: call_OI,
                strikePr : strike_pr,
                putOI: put_OI
            };
            data_row.push(row);
            callsOI.push(call_OI);
            putsOI.push(put_OI);
            strikePrice.push(strike_pr);
        });
    } catch(err) {
        console.log(err);
    }
}
scrapeData();