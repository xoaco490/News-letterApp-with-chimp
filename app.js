//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const express = require("express");
const app = express();
//const got =  require("got");
const https = require("https");
//const { url } = require("inspector");
//REQUEST IS DEPRECATED
//const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
//Setting up MailChimp
mailchimp.setConfig({
    //*****************************API KEY HERE******************************
    apiKey: "ApiKey",
    //*****************************API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "Prefix"
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    //*****************************LIST ID HERE******************************
    const listId = "ListID";
    //Creating an object with the users data
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    //Running the function and catching the errors (if any)
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req,res){
    res.redirect("/");
});