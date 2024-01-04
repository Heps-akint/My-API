//this is our server

const PORT = 8000
const express = require('express') //initialising express as the constant 'express'
const axios = require('axios') //initialising axios as the constant 'axios'
const cheerio = require('cheerio') //initialsing cheerio a the constant 'cheerio'

const urlweb = 'https://www.theguardian.com/environment/climate-crisis' //input a url

//initialising using express below

const app = express() //calling express using the constsnt 'app' so we can use all the capabilities of the function
const articles = [] //creating an empty array for deals to be stored

//passing through path
app.get('/', (req, res) => { //we listen out for whenever we visit the homepage '/'
    res.json('Welcome to my Climate Change News API') //if we visit the homepage we get the welcome response
})

//scraping the internet for data
app.get('/news', (req, res) => {

    axios.get(urlweb) //visit the url
        .then((response) => {
            const html = response.data //saves the response we get from the url
            //console.log(html) //shouldl see the html of the url coming back to us.
            const $ = cheerio.load(html) //passing the response data saved to htm into cheerio. Thus will allow us to pick out specific html elements

            $('a:contains("climate")', html).each(function () { //this looks for any <a> take elements within the html containing the work trending
                const title = $(this).text() //saves the text within <a> element as title
                const url = $(this).attr('href') //getting the href attribute from the <a> element
                
                articles.push({ //pushig things into the array
                    title, //adding the title (saved text from website)
                    url //adding the url (attribute)
                })
            })
            res.json(articles) //shows the deals array in the /deals webpage
        }).catch((err) => console.log(err))

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) //Listening out for the port which the server is running on and that it's working fine



