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
	db = new sequelize('spreadthelove', process.env.POSTGRES_USER, process.env.POSTGRESS_PASSWORD, {
		host: 'localhost',
		dialect: 'postgres'
	})
	// Creates an 'individuals' table in db
	individual = db.define('individual', {
		firstname: sequelize.STRING,
		lastname: sequelize.STRING,
		email: sequelize.STRING,
		password: sequelize.STRING
	})
	// Creates an 'organizations' table in db
	organization = db.define('organization', {
		orgname: sequelize.STRING,
		type: sequelize.STRING,
		email: sequelize.STRING,
		password: sequelize.STRING
	})



// Tells express where to find views
app.set('views', __dirname+'/views')
// Sets view engine to pug
.set('view engine', 'pug')

.use(session({
  secret: 'secure as fuck',
  saveUninitialized: false,
  resave: false,
  cookie: {
  	secure: false,
  	maxAge: 1000 * 60 * 60 * 60 * 60
   }
}))

// Middleware that only parses urlencoded bodies
.use(bodyParser.urlencoded({extended:true}))
// Serves static files
.use('/static', express.static(__dirname+"/static"))

.get('/', (req, res) => {
	res.render('index', {
		individual: req.session.individual,
		organization: req.session.organization
	})
})

// Registers an individual
.post('/newindividual', (req, res) => {
	var newindividual = req.body.result
	individual.create({
		firstname: newindividual.firstname,
		lastname: newindividual.lastname,
		email: newindividual.email,
		password: newindividual.password
	}).then((individual) => {
		req.session.individual = individual
		res.redirect('/')
	})
})

// Registers an organization
.post('/neworganization', (req, res) => {
	var neworganization = req.body.result
	organization.create({
		orgname: neworganization.orgname,
		type: neworganization.category,
		email: neworganization.email,
		password: neworganization.password
	}).then((organization) => {
		req.session.organization = organization
		res.redirect('/')
	})
})

.post('/login', (req, res) => {
	if (req.body.thetype == 'individual')
		individual.findOne({
			where:{
				email: req.body.enteremail,
				password: req.body.enterpassword
			}
		}).then( theindividual => {
			req.session.individual = theindividual
			res.redirect('/')
		})	
	if (req.body.type == 'organization')
		organization.findOne({
			where:{
				email: req.body.enteremail,
				password: req.body.enterpassword
			}
		}).then( theorganization => {
			req.session.individual = theorganization
			res.redirect('/')
		})	
})

db.sync({force: true}).then( f => {
	return individual.create({
		firstname: "Logan",
		lastname: "Barsell",
		email: "loganjbars@gmail.com",
		password: "password"
	})
}).catch( console.log.bind( console ) )


// Make the server listen on port 3000
app.listen(3000, f=> {
console.log('Server Running!')
})


























