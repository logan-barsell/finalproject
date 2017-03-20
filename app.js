	// Requires the main express library
const express = require('express'),
	// Creates app from the library
	app = express (),
	// Creates a session middleware for making cookie settings
	session = require('express-session'),
	// enables use of pug for view engine
	pug = require('pug'),
	// enables fs module for file operations
	fs = require('fs'),
	// extracts data from request stream and exposes it on req.body
	bodyParser = require('body-parser'),
	// Accesses Postgres server
	pg = require('pg')
	// Sets up a connection to communicate with the database 
	sequelize = require('sequelize')
	// Initializes hover.css

	// Creates database finalproject
	db = new sequelize('finalproject', process.env.POSTGRES_USER, process.env.POSTGRESS_PASSWORD, {
		host: 'localhost',
		dialect: 'postgres'
	})
	// Creates a user table with username and password
	user = db.define('user', {
		firstname: sequelize.STRING,
		lastname: sequelize.STRING,
		email: sequelize.STRING,
		password: sequelize.STRING
	})

// Tells express where to find views
app.set('views', __dirname+'/views')
// Sets view engine to pug
.set('view engine', 'pug')

// Middleware that only parses urlencoded bodies
.use(bodyParser.urlencoded({extended:true}))
// Serves static files
.use('/static', express.static(__dirname+"/static"))


.use(session({
  secret: 'secure as f*ck',
  saveUninitialized: false,
  resave: false,
  cookie: { secure: false },
  maxAge: 1000 * 60 * 60
}))

.get('/', (req, res) => {
	res.render('index')
})

// Make the server listen on port 3000
app.listen(3000, f=> {
console.log('Server Running!')
})


























