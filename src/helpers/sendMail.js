import mailgun from 'mailgun-js';
import dotenv from 'dotenv';

dotenv.config();

const sendActivationEmail = (user, url, txt) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
  const data = {
    from: 'no-reply@jyven.com',
    to: user.email,
    subject: txt,
    html: `
    <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to Jyven.</h2>
    <p>Congratulations! You're almost set to start using Jyven.
        Just click the button below to validate your email address.
    </p>
    
    <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>

    <p>If the button doesn't work for any reason, you can also click on the link below:</p>

    <div>${url}</div>
    </div>
`
  };
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
};

export default sendActivationEmail;
