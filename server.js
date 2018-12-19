const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

const port = process.env.PORT || 5000; // environment varible for Heroku to set
const app = express()

hbs.registerPartials(`${__dirname}/views/partials`) // directory to contain all partials
app.set('view engine', 'hbs') // tell express which view engine we are using
// takes the middleware function u wanna use and does soemthing with the arguments - static takes the absolute path to the folder.

// middleware that logs info about the request
app.use((req, res, next) => {
  const now = new Date().toString()
  const log = `${now}: ${req.method} ${req.url}`

  console.log(log)
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  })
  // next() tells us when your middleware is done
  next()
})

// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

app.use(express.static(`${__dirname}/public`))

// Helpers
// first argument is name of the helper, second is the function to run
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  }) // pass in the page you are rendering, second argument is an object which properties can be added to hbs template
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Bad Request'
  })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
