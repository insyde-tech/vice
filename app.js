const express = require('express')
const bodyParser = require('body-Parser')
const mongoose = require('mongoose')

const app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs'); 

var port = process.env.port || 6969

mongoose.connect("mongodb://localhost:27017/Vice", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auto_reconnect: true
});
console.log("Database Connection Successful");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})


// SIGN IN
app.post('/signin', function(req, res){
    const signinusername = req.body.signinusername
    const signinpassword = req.body.signinpassword

    // console.log(signinusername, signinpassword)

    User.find({username: signinusername}, function(err, result){
        if(err in result){
            console.log(err)
        }
        else{
            if(result.length > 0){
                result.forEach(function (user){
                    if(user.password = signinpassword){
                        res.sendFile(__dirname + '/main.html')
                        // console.log('Successful Signin')
                    }
                    else{
                        res.sendFile(__dirname + '/signin.html')
                        console.log("Account Not Found")
                    }
                })
            }
            else{
                res.sendFile(__dirname + '/signin.html')
                console.log('Account Does Not Exist')
            }
        }
    })

})


// FORGOT PASSWORD
app.post('/forgot', function(req, res){
    const forgotusername = req.body.forgotusername;
    const forgotphone = req.body.forgotphone;

    User.find({username: forgotusername}, function (err, result){
        if(err in result){
            console.log(err);
        } 

        else{
            if(result.length > 0){
                result.forEach(function (user){
                    if(user.phone == forgotphone){
                            // Node.js Web Scraping

                            res.sendFile(__dirname + '/success.html')  

                            // console.log(user.fullname, user.username, user.email, user.phone, user.password)
                                                        
                    }
                    else{
                        console.log('Not Found');
                        res.sendFile(__dirname + '/forgot.html')
                    }
                });
            }
            else{
                
                console.log('Does Not exist');
                res.sendFile(__dirname + '/forgot.html')   
            }
        } 
    });
})


// SIGN UP
var userScema = new mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    phone: String,
    password: String
})

var User = mongoose.model('User', userScema)

app.post('/signup', function(req, res){
    var fullname = req.body.fullname
    var username = req.body.username
    var email = req.body.email
    var phone = req.body.phone
    var password = req.body.password

    console.log(fullname, username, email, phone, password)

    var user = new User({
        fullname: fullname,
        username: username,
        email: email, 
        phone: phone,
        password: password
    })

    const userArray = [];

    function getPhone() {
        setTimeout(() => {
            User.find((err, res) => {

                if (err) {
                    console.log(err);

                } else {
                    const usersJson = res;
                    usersJson.forEach(elem => {
                        userArray.push((elem.phone));
                    });
                }
            });
        }, 1000);
    }

    function restrictPhone(userArray, phone, callback) {
        setTimeout(() => {
            if (userArray.includes(phone)) {
                console.log('Account Already Exists');
                res.sendFile(__dirname + '/signup.html')
            } 
            
            else {

                user.save();

                res.sendFile(__dirname + '/main.html')
                // console.log('Successful Signup')
            }
        }, 2000);

        callback();
    };

    restrictPhone(userArray, phone, getPhone);
   

})

app.listen(port, () => {
    console.log('Listening On Port ' + port)
}) 