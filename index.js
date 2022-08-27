const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplateCards = require('./modules/replaceTemplate');


const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObject = JSON.parse(data);

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8')
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8')
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8')

const server = http.createServer((req, res) => {
    // console.log(req);
    const { query, pathname } = url.parse(req.url, true)
    // console.log(query)
    console.log(pathname)
    
    // res.end("hello from the server")
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html',
        })

        const cardHTML = dataObject.map(val => replaceTemplateCards(templateCard, val)).join('');
        const finalOutput = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardHTML);
        res.end(finalOutput);

    }
    else if (pathname === '/product') {
        try {
            res.writeHead(200, {
                'content-type': 'text/html',
            })
            const productToBeDisplayed = dataObject[query.id];
            const htmlToBeDisplayed = replaceTemplateCards(templateProduct, productToBeDisplayed);
            res.end(htmlToBeDisplayed);

        } catch (error) {
            res.writeHead(404, {
                'content-type': 'text/html',
            })
            res.end(`<h1>Oops! Page not found</h1>`)

        }

    }
    else if (pathname === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json',
        })
        res.end(data)
    }
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
        })
        res.end(`<h1>Oops! Page not found</h1>`)
    }


})
server.listen('8000', '127.0.0.1', () => {
    console.log('server is running')

})