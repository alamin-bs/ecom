const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendResponseError } = require('../middleware/middleware');
const { checkPassword, newToken } = require('../utils/utility.function');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const signUpUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 8);

    await User.create({ ...req.body, password: hash });
    res.status(201).send('Sucessfully account opened ');
    return;
  } catch (err) {
    console.log('Eorror : ', err);
    sendResponseError(500, 'Something wrong please try again', res);
    return;
  }
};

const signInUser = async (req, res) => {
  const { password, email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!!!user) {
      sendResponseError(400, 'You have to Sign up first !', res);
    }

    const same = await checkPassword(password, user.password);
    if (same) {
      let token = newToken(user);
      res.status(200).send({ status: 'ok', token });
      return;
    }
    sendResponseError(400, 'InValid password !', res);
  } catch (err) {
    console.log('EROR', err);
    sendResponseError(500, `Error ${err}`, res);
  }
};

const getUser = async (req, res) => {
  res.status(200).send({ user: req.user });
};

const sendMail = async (req, res) => {
  console.log('req ', req.body);
  // let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    name: 'example.com',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'bethany.bayer71@ethereal.email', // generated ethereal user
      pass: 'U2gv3P6e26fM51xtqB', // generated ethereal password
    },
  });
  let mailOptions = {
    from: 'emonkabir95@gmail.com',
    to: 'ahmadwork01@gmail.com, alamin@brainstaion-23.com',
    subject: 'Test Email',
    text: 'This is a test email.',
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    }
  });
  res.json('ok');
};

const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

const getBill = (req, res) => {
  const { name, email, data } = req.body;

  let config = {
    service: 'gmail',
    auth: {
      user: 'noreply235813@gmail.com',
      pass: 'hlxrwkxkvcpxdkhl',
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'E-Commerce (powered by Niloy)',
      link: 'https://www.facebook.com/neloyss',
    },
  });

  let response = {
    body: {
      name,
      intro: `Your bill has arrived! Your Place ID is ${genRand(5)}`,
      table: {
        data,
      },
      outro: 'Looking forward to do more business',
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: 'noreply235813@gmail.com',
    to: email,
    subject: 'Place Order',
    text: 'received',
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: 'you should receive an email',
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  // res.status(201).json("getBill Successfully...!");
};
module.exports = { signUpUser, signInUser, getUser, sendMail, getBill };
