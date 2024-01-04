//this is our server
const PORT = process .env.PORT || 8000 // For deploying on heroku
const express = require('express') //initialising express as the constant 'express'
const axios = require('axios') //initialising axios as the constant 'axios'
const cheerio = require('cheerio') //initialsing cheerio a the constant 'cheerio'
const app = express() //calling express using the constsnt 'app' so we can use all the capabilities of the function

const guides = [
    {
        name: 'courses',
        address: 'https://thomasjfrank.com/courses/',
        base: 'https://thomasjfrank.com/'
    },
    {
        name: 'learning',
        address: 'https://thomasjfrank.com/notion/',
        base: 'https://thomasjfrank.com/'
    },
    {
        name: 'templates',
        address: 'https://thomasjfrank.com/templates/',
        base: 'https://thomasjfrank.com/'
    }
] //creating an empty array for data to be stored

const tutorials = [] //creating an empty array for data to be stored

guides.forEach(guide => {
    axios.get(guide.address) //visit the url
        .then(response => {
            const html = response.data //saves the response we get from the url
            //console.log(html) //shouldl see the html of the url coming back to us.
            const $ = cheerio.load(html) //passing the response data saved to htm into cheerio. Thus will allow us to pick out specific html elements
            
            $('a:contains("Notion")', html).each(function () { //this looks for any <a> take elements within the html containing the work trending
                const title = $(this).text() //saves the text within <a> element as title
                const url = $(this).attr('href') //getting the href attribute from the <a> element
                
                tutorials.push({ //pushig things into the array
                    title, //adding the title (saved text from website)
                    url: guide.base + url, //adding the url (attribute)
                    source: guide.address
                })
            })
        })    
})

//passing through path
app.get('/', (req, res) => { //we listen out for whenever we visit the homepage '/'
    res.json('Welcome to my Thomas Frank Notion Guides API!') //if we visit the homepage we get the welcome response
})

//scraping the internet for data
app.get('/tutorials', (req, res) => {
    res.json(tutorials)
})

app.get('/tutorials/:guideId', (req, res) => { //we listen out for whenever we visit the homepage '/'
    const guideId = req.params.guideId
    const guideAddress = guides.filter(guide => guide.name == guideId)[0].address
    const guideBase = guides.filter(guide => guide.name == guideId)[0].base
    
    axios.get(guideAddress) //visit the url
        .then(response => {
            const html = response.data //saves the response we get from the url
            //console.log(html) //shouldl see the html of the url coming back to us.
            const $ = cheerio.load(html) //passing the response data saved to htm into cheerio. Thus will allow us to pick out specific html elements
            const specificTutorials = []

            $('a:contains("Notion")', html).each(function () { //this looks for any <a> take elements within the html containing the work trending
                const title = $(this).text() //saves the text within <a> element as title
                const url = $(this).attr('href') //getting the href attribute from the <a> element
                
                specificTutorials.push({ //pushig things into the array
                    title, //adding the title (saved text from website)
                    url: guideBase + url, //adding the url (attribute)
                    source: guideId
                })
            })
            res.json(specificTutorials) //shows the deals array in the /deals webpage
        }).catch((err) => console.log(err)) //if we visit the homepage we get the welcome response
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) //Listening out for the port which the server is running on and that it's working fine



