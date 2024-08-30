const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://localhost:5173/reset-password?token=${token}`;
  const resetPasswordUrl = `https://appointment-management-fe.vercel.app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  // const verificationEmailUrl = `http://localhost:5173/verify-email?token=${token}`;
  const verificationEmailUrl = `https://appointment-management-fe.vercel.app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const formatDateTime = (dateTime) => dayjs(dateTime).format('dddd, MMMM D, YYYY h:mm A');

const generateAppointmentEmailHtml = (type, appointmentDetails, barberDetails, serviceDetails) => {
  const formattedDateTime = formatDateTime(appointmentDetails.appointmentDateTime);

  const emailTypes = {
    confirmation: {
      title: 'Appointment Confirmation - Barbershop',
      message: 'Your appointment has been confirmed with the following details:',
    },
    update: {
      title: 'Appointment Update - Barbershop',
      message: 'Your appointment has been updated with the following details:',
    },
    cancellation: {
      title: 'Appointment Cancellation - Barbershop',
      message:
        'We regret to inform you that your appointment has been cancelled. Here are the details of the cancelled appointment:',
    },
  };

  const { title, message } = emailTypes[type];

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>${title}</h2>
      <p>Dear ${appointmentDetails.firstName} ${appointmentDetails.lastName},</p>
      <p>${message}</p>
      <ul>
        <li><strong>Date & Time:</strong> ${formattedDateTime}</li>
        <li><strong>Barber:</strong> ${barberDetails.firstName} ${barberDetails.lastName}</li>
        <li><strong>Service:</strong> ${serviceDetails.title}</li>
        <li><strong>Contact Number:</strong> ${appointmentDetails.contactNumber}</li>
      </ul>
      ${
        type !== 'cancellation'
          ? `<a href="https://appointment-management-fe.vercel.app/appointments" style="display: inline-block; padding: 10px 20px; background-color: #AF8447; color: #fff; text-decoration: none;">View Appointments</a>`
          : ''
      }
      <p>${
        type === 'cancellation' ? 'We hope to see you soon for a rescheduled appointment.' : 'Looking forward to seeing you!'
      }</p>
    </div>
  `;
};

const sendAppointmentEmail = async (type, to, appointmentDetails, barberDetails, serviceDetails) => {
  const subject = `Appointment ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const html = generateAppointmentEmailHtml(type, appointmentDetails, barberDetails, serviceDetails);
  await sendEmail(to, subject, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAppointmentEmail,
  sendVerificationEmail,
};
