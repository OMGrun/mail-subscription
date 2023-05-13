const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const port = process.env.PORT


require('dotenv').config();


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public")); // for css and images thing. It provides the path for our static files



app.get('/', (req,res) =>
{
    res.sendFile(__dirname + "/signup.html")
})

app.post('/',(req,res)=>
{
    const firstName = req.body.fName;
    const LastName = req.body.lName;
    const email = req.body.email;
   
    const data = 
    {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: 
                {
                    FNAME: firstName,
                    LNAME: LastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = process.env.LIST_ID;

    const options =  {
        method: "POST",
        auth: "saint:" + process.env.API_KEY
    } // there is a better way to do this now, but I'm far too lazy to chage it.
    // If it works, don't touch it.



    const request = https.request(url, options, (response) =>
    {
        // console.log(response);
        if (response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else 
        {
            res.sendFile(__dirname + "/failure.html")
        }

        // response.on("data", (data) =>
        // {
        //     console.log(JSON.parse(data));
        // })
    })
    
    request.write(jsonData);
    request.end();

}) // homeroute

app.post('/failure', (req,res) =>
{
    res.redirect("/");
})

app.listen(port)
// add || 3000 or whichever port, if you would like to run on a local server

