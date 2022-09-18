const puppeteer = require('puppeteer');
const utils = require('./utils.js');

const homePage = async () => {

    function sleep() {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < 2000);
    }


    let url = 'https://zunaverse.io/explorer';
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let nfts = [];
    sleep();

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
        if (nfts.length > 0) {
            resolve(nfts);
        } else {
            reject(nfts);
        }
    });
}



// EXPORTS====================================================



module.exports.homePage = homePage();