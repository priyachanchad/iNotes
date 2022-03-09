const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Pr!yai$aG00dgirl"

//Route 1: Create a user using: POST '/api/auth/createuser. No login required

router.post('/createuser', [
    body('username', 'Username must be 3 characters Long').isLength({min: 3}),
    body('email', 'Inavalid email').isEmail(),
    body('password', 'Password must be strong').isLength({ min: 5 }),
], async (req,res)=>{
  let success = false;
    //If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    //Check wether the user with this email exist already
    try{
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({success, error: "Sorry! User with this email exists already"})
    }

    const salt = await  bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    //Create a new User
    user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass
      })
      
      const data = {
          user:{
              id: user.id
          }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//Route 2: Authenticate a user using: POST '/api/auth/login. No login required

router.post('/login', [
    body('email', 'Inavalid email').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req,res)=>{
    //If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try{
    let user = await User.findOne({email})
    if(!user){
      success = false;
        return res.status(400).json({success, error: "Please login with correct credentials"})
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      success = false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"})
    }

    //Create a new User
   
      const data = {
          user:{
              id: user.id
          }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports = router;