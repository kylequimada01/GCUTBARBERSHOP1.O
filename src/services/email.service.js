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
 * @param {string} html
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

/**
 * Format the appointment date and time
 * @param {Date} dateTime
 * @returns {string}
 */
const formatDateTime = (dateTime) => dayjs(dateTime).format('dddd, MMMM D, YYYY h:mm A');

/**
 * Generate the action link based on the email type
 * @param {string} type
 * @returns {string}
 */
const generateActionLink = (type) => {
  if (type === 'confirmation' || type === 'update') {
    return `<a href="https://appointment-management-fe.vercel.app/appointments" style="display: inline-block; padding: 10px 20px; background-color: #AF8447; color: #fff; text-decoration: none;">View Appointments</a>`;
  }
  if (type === 'feedback') {
    return `<a href="https://appointment-management-fe.vercel.app/reviews" style="display: inline-block; padding: 10px 20px; background-color: #AF8447; color: #fff; text-decoration: none;">Leave a Review</a>`;
  }
  return '';
};

/**
 * Generate the closing message based on the email type
 * @param {string} type
 * @returns {string}
 */
const generateClosingMessage = (type) => {
  switch (type) {
    case 'cancellation':
      return 'We hope to see you soon for a rescheduled appointment.';
    case 'feedback':
      return 'Thank you for choosing our service!';
    default:
      return 'Looking forward to seeing you!';
  }
};

/**
 * Generate the HTML content for the appointment email
 * @param {string} type
 * @param {Object} appointmentDetails
 * @param {Object} barberDetails
 * @param {Object} serviceDetails
 * @returns {string}
 */
const generateAppointmentEmailHtml = (type, appointmentDetails, barberDetails, serviceDetails) => {
  const formattedDateTime = formatDateTime(appointmentDetails.appointmentDateTime);
  const actionLink = generateActionLink(type);
  const closingMessage = generateClosingMessage(type);

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
    feedback: {
      title: 'We Value Your Feedback - Barbershop',
      message:
        'Your appointment has passed. We would love to hear your feedback on the service provided. Please consider leaving a review:',
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
      ${actionLink}
      <p>${closingMessage}</p>
    </div>
  `;
};

/**
 * Send appointment-related emails
 * @param {string} type
 * @param {string} to
 * @param {Object} appointmentDetails
 * @param {Object} barberDetails
 * @param {Object} serviceDetails
 * @returns {Promise<void>}
 */
const sendAppointmentEmail = async (type, to, appointmentDetails, barberDetails, serviceDetails) => {
  const subject = `Appointment ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const html = generateAppointmentEmailHtml(type, appointmentDetails, barberDetails, serviceDetails);
  await sendEmail(to, subject, html);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
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
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `https://appointment-management-fe.vercel.app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAppointmentEmail,
  sendVerificationEmail,
};
