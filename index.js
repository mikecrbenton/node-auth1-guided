const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
// CODE TO SAVE TO DATABASE==================================
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("./database/config")
//===========================================================
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
// express-session
server.use(session( 
   {
      resave: false,  // AVOID CREATING SESSIONS THAT HAVEN'T CHANGED
      saveUninitialized: false,  // GDPR LAWS AGAINTS AUTOMATICALLY SETTING COOKIES
      secret: "arbitrary_value", //USED TO CRYPTOGRAPHICALLY SIGN THE COOKIE
      // STORE THE SESSION DATA IN THE DATABASE INSTEAD OF MEMORY
	   store: new KnexSessionStore({
		   knex: db, // configured instance of knex
         createtable: true, // if the table does not exist, it will create it automatically
      }),
    }))

server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
