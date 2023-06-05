require('dotenv').config()


let API_KEY = process.env.MAILGUN_API_KEY;

//added sandbox domain because the domain I created required DNS verification to function.
let DOMAIN = process.env.EMAIL_DOMAIN;

const mailgun = require('mailgun-js')
    ({ apiKey: API_KEY, domain: DOMAIN });
 
module.exports.sendMail = function (sender_email, receiver_email,
    email_subject, email_body) {
 
    const data = {
        "from": sender_email,
        "to": receiver_email,
        "subject": email_subject,
        "text": email_body
    };
 
    mailgun.messages().send(data, (error, body) => {
        if (error) console.log(error)
        else console.log(body);
    });
}
 
let sender_email = 'no-reply@tali.com'
let receiver_email = 'sakatia.lise@gmail.com'
let email_subject = 'Mailgun Demo'
let email_body = 'Greetings from tali'
 
// // User-defined function to send email
// sendMail(sender_email, receiver_email,
//     email_subject, email_body)
