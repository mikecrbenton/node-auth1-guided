const bcrypt = require("bcryptjs")
const Users = require("./users-model")

function restrict() {
	// Create a middleware function that restricts routes to authorized users only.
   // It should get the username and password from the request headers.
   return async (req,res,next) => {
      try{

         // -----DON'T NEED BECAUSE OF EXPRESS-SESSION-----
         // const { username, password } = req.headers

         // //MAKE SURE NOT EMPTY
         // if(!username || !password) {
         //    return res.status(401).json({message:"Invalid Credentials"})
         // }
         // // VERIFY USER IN DATABASE   
         // const user = await Users.findBy({ username }).first()

         // if (!user) {
         //    return res.status(401).json({message:"Username Not Found"})
         // }
         // // CHECK PASSWORD
         // const passwordValid = await bcrypt.compare(password, user.password)

         // if(!passwordValid) {
         //    return res.status(401).json({message:"Invalid Password"})
         // }

            if(!req.session || !req.session.user) {
               return res.status(401).json({message:"Invalid Credentials"})
            }

         // EVERYTHING VALIDATED -  DON'T FORGET NEXT!!
         next()

      }catch(err) {
         next(err)
      }
   }
}

module.exports = {
	restrict,
}