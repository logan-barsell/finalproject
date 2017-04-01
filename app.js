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
	// Handles multi-part/form-data, enables the uploading of files
	multer  = require('multer'),
	upload = multer({ dest: 'uploads/' }),
	// Enables hashing of passwords
	passwordHash = require('password-hash')
	// Accesses Postgres server
	pg = require('pg'),
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
		password: sequelize.STRING,
		profilepic: sequelize.STRING,
		type: sequelize.STRING
	})
	// Creates an 'collectives' table in db
	collective = db.define('collective', {
		name: sequelize.STRING,
		email: sequelize.STRING,
		password: sequelize.STRING,
		profilepic: sequelize.STRING,
		type: sequelize.STRING
	})
	// Creates a 'nonprofits' table in db
	nonprofit = db.define('nonprofit', {
		name: sequelize.STRING,
		email: sequelize.STRING,
		password: sequelize.STRING,
		profilepic: sequelize.STRING,
		type: sequelize.STRING
	})
	// Creates an 'odd jobs' table in db
	oddjob = db.define('oddjob', {
		jobtitle: sequelize.STRING,
		jobdescription: sequelize.TEXT,
	})
	// Creates a 'collectivejobs' table in db
	collectivejob = db.define('collectivejob', {
		jobtitle: sequelize.STRING,
		jobdescription: sequelize.TEXT,
		postpic: sequelize.STRING,
	})
	// Creates a 'nonprofitjobs' table in db
	nonprofitjob = db.define('nonprofitjob', {
		jobtitle: sequelize.STRING,
		jobdescription: sequelize.TEXT,
		postpic: sequelize.STRING,
	})
	// Creates an 'initiatives' table in db
	initiative = db.define('initiative', {
		initname: sequelize.STRING,
		initgoal: sequelize.TEXT,
		postpic: sequelize.STRING
	})

oddjob.belongsTo(individual)
individual.hasMany(oddjob)

collectivejob.belongsTo(collective)
collective.hasMany(collectivejob)

nonprofitjob.belongsTo(nonprofit)
nonprofit.hasMany(nonprofitjob)

initiative.belongsTo(individual)
individual.hasMany(initiative)
initiative.belongsTo(collective)
collective.hasMany(initiative)
initiative.belongsTo(nonprofit)
nonprofit.hasMany(initiative)



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

// Renders the main page
.get('/', (req, res) => {
	Promise.all([
		oddjob.findAll({
			include: [{model: individual}]
		}),
		collectivejob.findAll({
			include: [{model: collective}]
		}),
		nonprofitjob.findAll({
			include: [{model: nonprofit}]
		}),
		initiative.findAll({
			include: [{model: individual}, {model: collective}, {model: nonprofit}]
		})
	]).then( foundall => {
		console.log(foundall)
		res.render('index', {
			user: req.session.user || { type: 'none'},
			oddjobs: foundall[0],
			collectivejobs: foundall[1],
			nonprofitjobs: foundall[2],
			initiatives: foundall[3]
		})
	})
})

// Registers an individual and starts a session
.post('/newindividual', (req, res) => {
	var newindividual = req.body.result
	individual.create({
		firstname: newindividual.firstname,
		lastname: newindividual.lastname,
		email: newindividual.email,
		password: passwordHash.generate(newindividual.password),
		profilepic: newindividual.profilepic
	}).then((individual) => {
		individual.type = 'individual'
		req.session.user = individual
		res.send('/')
		console.log('newindividual', req.session)
	})
})

// Registers an collective and starts a session
.post('/newcollective', (req, res) => {
	var newcollective = req.body.result
	collective.create({
		name: newcollective.orgname,
		email: newcollective.email,
		password: newcollective.password,
		profilepic: newcollective.profilepic,
		type: 'collective'
	}).then((collective) => {
		collective.type = 'collective'
		req.session.user = collective
		res.send('/')
	})
})

// Registers an nonprofit and starts a session
.post('/newnonprofit', (req, res) => {
	var newnonprofit = req.body.result
	nonprofit.create({
		name: newnonprofit.orgname,
		email: newnonprofit.email,
		password: newnonprofit.password,
		profilepic: 'none',
		type: 'nonprofit'
	}).then((nonprofit) => {
		nonprofit.type = 'nonprofit'
		req.session.user = nonprofit
		res.send('/')
	})
})

.post('/newprofilepic', upload.single('pic'), (req, res, next) => {
	consolelog(req.file)
})

.post('/newoddjob', (req, res) => {
	oddjob.create({
		jobtitle: req.body.jobtitle,
		jobdescription: req.body.jobdescription,
		individualId: req.session.user.id
	}).then( newoj => {
		res.redirect('/#oddjobs')
	})
})

.post('/newcollectivejob', (req, res) => {
	collectivejob.create({
		jobtitle: req.body.jobtitle,
		jobdescription: req.body.jobdescription,
		collectiveId: req.session.user.id
	}).then( newcj => {
		res.redirect('/#collectives')
	})
})

.post('/newnonprofitjob', (req, res) => {
	nonprofitjob.create({
		jobtitle: req.body.jobtitle,
		jobdescription: req.body.jobdescription,
		nonprofitId: req.session.user.id
	}).then( newnpj => {
		res.redirect('/#nonprofits')
	})
})

.post('/newinitiative', (req, res) => {
	initiative.create({
		initname: req.body.initname,
		initgoal: req.body.initgoal,
		initiativeId: req.session.user.id
	}).then( newinit => {
		res.redirect('/#initiatives')
	})
})

// Logs in users and starts a session
.post('/login', (req, res) => {
	Promise.all([
		individual.findAll({ where: { email: req.body.enteremail } }),
		collective.findAll({ where: { email: req.body.enteremail } }),
		nonprofit.findAll({ where: { email: req.body.enteremail } })
	]).then( allusers => {
		for (var i = allusers.length - 1; i >= 0; i--) {
			if( allusers[i].length != 0 ) {
				switch(i) {
					case 0: allusers[i][0].type = 'individual'; break;
					case 1: allusers[i][0].type = 'collective'; break;
					case 2: allusers[i][0].type = 'nonprofit';
				}
				return allusers[i][0]
			}
		}
	}).then(founduser => {
		passwordHash.verify(req.body.enterpassword, founduser.password)
		req.session.user = founduser
		res.redirect('/')
	}).catch(console.log.bind(console))
})

// Logs out users and ends the session
.get('/logout', (req, res) => {
	req.session.destroy()
	res.redirect('/')
})

db.sync({force: true}).then( f => {
	return Promise.all([
		// Creates some individual users
		individual.create({
			firstname: 'Logan',
			lastname: 'Barsell',
			email: 'loganjbars@gmail.com',
			password: passwordHash.generate('pass1'),
			profilepic: '/static/css/images/logan.jpg',
			type: 'individual'
		}),
		individual.create({
			firstname: 'Clover',
			lastname: 'Kitty',
			email: 'Clover@gmail.com',
			password: passwordHash.generate('pass2'),
			profilepic: '/static/css/images/clover.jpg',
			type: 'individual'
		}),
		individual.create({
			firstname: 'Crimson',
			lastname: 'Cat',
			email: 'crimson@gmail.com',
			password: passwordHash.generate('pass3'),
			profilepic: '/static/css/images/crimson.jpg',
			type: 'individual'
		}),
		// Creates some collective users
		collective.create({
			name: 'Binnenpret MKZ',
			email: 'MKZ@binnenpret.com',
			password: passwordHash.generate('pass4'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'collective'
		}),
		collective.create({
			name: 'Collective 2',
			email: 'collective2@gmail.com',
			password: passwordHash.generate('pass5'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'collective'
		}),
		collective.create({
			name: 'Collective 3',
			email: 'collective3@gmail.com',
			password: passwordHash.generate('pass6'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'collective'
		}),
		// Creates some non-profit users
		nonprofit.create({
			name: 'Non-profit 1',
			email: 'nonprofit1@gmail.com',
			password: passwordHash.generate('pass7'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'nonprofit'
		}),
		nonprofit.create({
			name: 'Non-profit 2',
			email: 'nonprofit2@gmail.com',
			password: passwordHash.generate('pass8'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'nonprofit'
		}),
		nonprofit.create({
			name: 'Non-profit 3',
			email: 'nonprofit3@gmail.com',
			password: passwordHash.generate('pass9'),
			profilepic: '/static/css/images/MKZ.jpg',
			type: 'nonprofit'
		})
	])	
}).then( userscreated => {
	Promise.all([
		// Creates some odd jobs
		userscreated[0].createOddjob({
			jobtitle: 'Lorem Ipsmum',
			jobdescription: 'lorem ipsum t enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			postpic: userscreated[0].profilepic
		}),
		userscreated[1].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[1].profilepic
		}),
		userscreated[2].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[2].profilepic
		}),
		// Creates some collective jobs
		userscreated[3].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[3].profilepic
		}),
		userscreated[4].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[4].profilepic
		}),
		userscreated[5].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[5].profilepic
		}),
		// Creates some non-profit jobs
		userscreated[6].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[6].profilepic
		}),
		userscreated[7].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[7].profilepic
		}),
		userscreated[8].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[8].profilepic
		}),
		// Creates som initiatives
		userscreated[0].createInitiative({
			initname: 'Beach Clean-up',
			initgoal: 'To remove all of the trash from our beautiful beaches.',
			postpic: userscreated[0].profilepic,
		}),
		userscreated[1].createInitiative({
			initname: 'Food drive',
			initgoal: 'We are doing a food drive to help feed the homeless, all food donations graciously accepted!',
			postpic: userscreated[1].profilepic
		}),
		userscreated[3].createInitiative({
			initname: 'Initiative 3',
			initgoal: 'initiative 3 goalllllllzzzzzzzzz',
			postpic: userscreated[3].profilepic
		}),
		userscreated[0].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[0].profilepic
		}),
		userscreated[1].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[1].profilepic
		}),
		userscreated[2].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[2].profilepic
		}),
		// Creates some collective jobs
		userscreated[3].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[3].profilepic
		}),
		userscreated[4].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[4].profilepic
		}),
		userscreated[5].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[5].profilepic
		}),
		// Creates some non-profit jobs
		userscreated[6].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[6].profilepic
		}),
		userscreated[7].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[7].profilepic
		}),
		userscreated[8].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[8].profilepic
		}),
		// Creates som initiatives
		userscreated[0].createInitiative({
			initname: 'Beach Clean-up',
			initgoal: 'To remove all of the trash from our beautiful beaches.',
			postpic: userscreated[0].profilepic
		}),
		userscreated[1].createInitiative({
			initname: 'Food drive',
			initgoal: 'We are doing a food drive to help feed the homeless, all food donations graciously accepted!',
			postpic: userscreated[1].profilepic
		}),
		userscreated[3].createInitiative({
			initname: 'Initiative 3',
			initgoal: 'initiative 3 goalllllllzzzzzzzzz',
			postpic: userscreated[3].profilepic
		}),
		userscreated[0].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[0].profilepic
		}),
		userscreated[1].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[1].profilepic
		}),
		userscreated[2].createOddjob({
			jobtitle: 'dothislater',
			jobdescription: 'dothislatertoo and maybe add more stuff',
			postpic: userscreated[2].profilepic
		}),
		// Creates some collective jobs
		userscreated[3].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[3].profilepic
		}),
		userscreated[4].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[4].profilepic
		}),
		userscreated[5].createCollectivejob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[5].profilepic
		}),
		// Creates some non-profit jobs
		userscreated[6].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[6].profilepic
		}),
		userscreated[7].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[7].profilepic
		}),
		userscreated[8].createNonprofitjob({
			jobtitle: 'do this later',
			jobdescription: 'do this later too and more stuff maybe idk',
			postpic: userscreated[8].profilepic
		}),
		// Creates som initiatives
		userscreated[0].createInitiative({
			initname: 'Beach Clean-up',
			initgoal: 'To remove all of the trash from our beautiful beaches.',
			postpic: userscreated[0].profilepic
		}),
		userscreated[1].createInitiative({
			initname: 'Food drive',
			initgoal: 'We d!',
			postpic: userscreated[1].profilepic
		}),
		userscreated[3].createInitiative({
			initname: 'Initiative 3',
			initgoal: 'initiative 3 goalllllllzzzzzzzzz',
			postpic: userscreated[3].profilepic
		})
	])
}).catch(console.log.bind(console))


// Make the server listen on port 3000
app.listen(3000, f=> {
console.log('Server Running!')
})


























