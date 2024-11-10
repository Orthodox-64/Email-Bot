const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// Set up Handlebars as the template engine
app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Render the contact form on the homepage
app.get("/", (req, res) => {
    res.render("contact");
});

// Handle form submission
app.post("/send", (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // Configure the nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your mail',
            pass: 'pass'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Set up email options
    let mailOptions = {
        from: '"Nodemailer Contact" <pangalsachin208@gmail.com>',
        to: 'RECEIVEREMAILS',
        subject: 'Node Contact Request',
        text: 'Hey From RizzLord 💀',
        html: output
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("contact", { msg: "Email has been sent" });
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server has been started on http://localhost:3000");
});
