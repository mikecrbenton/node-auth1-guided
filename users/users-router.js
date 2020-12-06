const express = require("express")
const Users = require("./users-model")
const bcrypt = require("bcryptjs") // IMPORT BCRYPT
const { restrict } = require('./users-middleware')

const router = express.Router()

router.get("/users", restrict(), async (req, res, next) => {
	try {
      console.log("made it here")
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
         username,
         // hash password with time complexity to the power of( 2^of )
         // need to tweak to 1-2 seconds 
			password: await bcrypt.hash(password,12)  // CALL BCRYPT
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
      
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
      }
      // bcyrpt compares using built-in-functionality
      const passwordValid = await bcrypt.compare(password, user.password)

      if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
      }
      // EXPRESS-SESSION 
      // ( will be true or false depending on password matching the hash )
      req.session.user = user

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", async (req, res, next) => {
	try {
		// deletes the session on the server-side, so the user is no longer authenticated
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router
