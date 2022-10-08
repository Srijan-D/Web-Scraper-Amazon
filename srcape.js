const cheerio = require("cheerio");
const axios = require("axios");
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const url = 'https://www.amazon.in/Apple-MacBook-Chip-13-inch-256GB/dp/B08N5XSG8Z/ref=sr_1_3?keywords=macbook&qid=1665235135&qu=eyJxc2MiOiI1LjAwIiwicXNhIjoiNC40NyIsInFzcCI6IjMuNTQifQ%3D%3D&sr=8-3'
const product = { name: '', price: '' };
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
    product.price = priceValue;
    product.name = itemName;
    
    //notifitcation part:
     if (product.price < 88990) {
        client.messages.create({
            body: `the price of ${itemName} went below ${priceValue}`,
            from: "My_Twilio_phone_number",
            to: "My_phone_number",
            //it returns a promise
        }).then(message => {
            console.log("sent");
        }).then(err => {
            console.log("error");
        })
    }

}
getHtml();
