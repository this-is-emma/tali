// require our mailgun dependencies
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

// auth with our mailgun API key and domain
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.EMAIL_DOMAIN
  }
}

// export our send mail function
module.exports.sendMail = (user, req, res) => {
    // send an email to the user's email with a provided template
    nodemailerMailgun.sendMail({
        from: 'no-reply@example.com',
        to: user.email, // An array if you have multiple recipients.
        subject: 'item Purchased!',
        template: {
            name: 'email.handlebars',
            engine: 'handlebars',
            context: user
        }
    // One mail is sent, redirect to the purchased item's page
    }).then(info => {
        console.log('Response: ' + info);
        res.redirect(`/items/${req.params.id}`);
    // Catch error and redirect to the purchased item's page
    }).catch(err => {
        console.log('Error: ' + err);
        res.redirect(`/items/${req.params.id}`);
    });
}

// create a mailer
const nodemailerMailgun = nodemailer.createTransport(mg(auth));
