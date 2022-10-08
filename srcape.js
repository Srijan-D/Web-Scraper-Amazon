const cheerio = require("cheerio");
const axios = require("axios");
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const url = 'https://www.amazon.in/Apple-MacBook-Chip-13-inch-256GB/dp/B08N5XSG8Z/ref=sr_1_3?keywords=macbook&qid=1665235135&qu=eyJxc2MiOiI1LjAwIiwicXNhIjoiNC40NyIsInFzcCI6IjMuNTQifQ%3D%3D&sr=8-3'
const product = { Productname: '', Productprice: '', Producturl: '' };
const getHtml = async () => {
    const response = await axios.get(url);
    // console.log(response);
    const $ = cheerio.load(response.data);
    const itemContainer = $('div#dp-container');
    const itemName = itemContainer.find('span#productTitle').text()
    // console.log(itemName);
    const price = itemContainer.find('span .a-price-whole')
        .first()//returns only the first value that matches
        .text()
        .replace(/[,.]/g, '');
    // console.log(price);
    const priceValue = parseInt(price);
    //string into an integer in order to use comparison operators
    // console.log(priceValue)
    product.Productname = itemName;
    product.Productprice = priceValue;
    product.Producturl = url;
    //notification part:
    if (product.Productprice < 90990) {
        client.messages.create({
            body: `the price of ${itemName} went below ${priceValue} at ${url}`,
            from: "twilio registered phone number",//registered twilio phone number
            to: "your phone number",//type your phone number here
            //it returns a promise
        }).then(message => {
            console.log("message has been sent");
        }).then(err => {
            console.log("error");
        })
    }

}
getHtml();
