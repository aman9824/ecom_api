import nodemailer from 'nodemailer';

const googleMail = (user, url, txt) => {
  const { log } = console;

  // Step 1
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, //  your gmail account
      pass: process.env.PASSWORD //  your gmail password
    }
  });

  // Step 2
  const mailOptions = {
    from: 'abc@gmail.com', // email sender
    to: user.email, //  email receiver
    subject: 'Account Activation',
    html: `
    <div style="max-width: 700px; margin:auto; padding: 50px 20px; font-size: 110%;" >
    <h2 style="text-align: center; text-transform: uppercase;color: black;">Welcome to Jyven.</h2>
    <p>Congratulations! You're almost set to start using Jyven.
        Just click the button below to validate your email address.
    </p>
    <div style="color: red; display: flex; justify-content: center">
    <a href=${url} style="background: blue;  border-radius: 30px; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;" >${txt}</a>
      </div>

    <p>If the button doesn't work for any reason, you can also click on the link below:</p>

    <div>${url}</div>
    </div>
`
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log('Error occurs');
    }
    return log('Email sent!!!');
  });
};

export default googleMail;
