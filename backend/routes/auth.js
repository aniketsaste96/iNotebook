const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = "AniketIsCOOLDUDE"
//jwt allows secure communication between client and server





// Route 1:create a User using POST  "api/auth/createuser" doesn't require auth
//No login required
router.post('/createuser', [

    body('name', "enter valid name!!!").isLength({ min: 3 }),
    body('email', "enter valid email!!!").isEmail(),
    body('password', "password must be at least 5 characters!!!").isLength({ min: 5 }),
], async (req, res) => {
    // console.log(req.body);
    // //create new user

    // const user = User(req.body);
    // user.save();


    //if theire are error ,return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user with same email alreday exists
    //error handling
    try {


        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry user with email is already exists!!!" })
        }

        //hasing + salt
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        //create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: user.id
        }
        const authToken = jwt.sign(data, JWT_SECRET);



        res.json({ authToken });
    } catch (error) {
        //if error
        console.log(error.message);
        res.status(500).send("Some error occurred: " + error.message)

    }

})











// Route 2:authenticate User using POST  "api/auth/login"  No login req
router.post('/login', [

    body('email', "enter valid email!!!").isEmail(),
    body('password', "password cannot be blank!!!").exists(),

], async (req, res) => {
    //if theire are error ,return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //use destructuring to get email and password from req.body

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials!!!" })
        }
        //compare password

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Credentials!!!" })
        }

        //if password is correct 
        const data = {
            user: user.id
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })
    } catch (error) {
        //if error
        console.log(error.message);
        res.status(500).send('Internal server error')

    }

})






// Route 3:Get logged in user Details POST  "api/auth/getuser" 
// login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        var userId = req.user
        const user = await User.findById(userId).select("-password")
        res.send(user);


    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error')
    }


})



module.exports = router;