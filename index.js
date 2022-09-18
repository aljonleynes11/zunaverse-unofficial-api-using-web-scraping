const express = require('express');
const { resolve } = require('path');
const { send } = require('process');
const puppeteer = require('puppeteer')
const scraper = require('./scraper.js');
const app = express();
app.use(express.urlencoded({ extended: false }));
const port = 8000


async function homePage() {
    
    let url = 'https://zunaverse.io/explorer';
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let nfts = [];
    sleep(2000);

    for (let i = 1; i <= 24; i++) {
        const nameTag = `/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div[${i}]/div/div/h6`;
        const [nameContainer] = await page.$x(nameTag);
        const nameElement = await nameContainer.getProperty('innerHTML');
        const name = await nameElement.jsonValue();

        const imgTag = `/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div[${i}]/div/a/button/img`;
        const [imgContainer] = await page.$x(imgTag);
        const imgElement = await imgContainer.getProperty('src');
        const image = await imgElement.jsonValue();

        const slugTag = `/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div[${i}]/div/a`;
        const [slugContainer] = await page.$x(slugTag);
        const slugElement = await slugContainer.getProperty('href');
        const slug = await slugElement.jsonValue();

        const ownerTag = `/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div[${i}]/div/div/a/div/div/p`;
        const [ownerContainer] = await page.$x(ownerTag);
        const ownerElement = await ownerContainer.getProperty('innerHTML');
        const owner = await ownerElement.jsonValue();

        const ownerImageTag = `/html/body/div[1]/div/div[2]/div/div[2]/div/div[1]/div[${i}]/div/div/a/div/img`;
        const [ownerImageContainer] = await page.$x(ownerImageTag);
        const ownerImageElement = await ownerImageContainer.getProperty('src');
        const ownerImage = await ownerImageElement.jsonValue();

        const user = {
            "name": owner,
            "image": ownerImage,
        }
        const nft = {
            "name": name,
            "image": image,
            "slug": slug,
            "owner": user,
        };

        nfts.push(nft);
    }


    browser.close();

    return new Promise((resolve, reject) => {
        if (nfts.length>0) {
            resolve(nfts);
        } else {
            reject(nfts);
        }
    });
}


app.listen(process.env.PORT || port, () => {
    console.log(`listening on port ${port}`)
});

app.get('/', async function (req, res) {
    try {
        await homePage().then((response) => {
            console.log(response);
            res.send({
                "status": true,
                "message": response
            });
        });
    } catch (error) {
        console.log(error);
        res.send({
            "status": false,
            "message": 'Scraping failed',
        })
    }
})

app.get('/nft', async function (req, res) {
    try {
        await homePage().then((response) => {
            res.send({
                "status": true,
                "message": response
            });
        });
    } catch (error) {
        console.log(error);
        res.send({
            "status": false,
            "message": 'Scraping failed',
        })
    }
})


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}