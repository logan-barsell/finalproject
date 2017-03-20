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