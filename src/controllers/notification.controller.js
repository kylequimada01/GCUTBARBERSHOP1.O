// src/controllers/notification.controller.js

const catchAsync = require('../utils/catchAsync');
const { sendAppointmentNotification } = require('../services/email.service');
const { sendPushNotification } = require('../services/push.service');
const { getUserById } = require('../services/user.service');

const sendAppointmentNotificationToUser = catchAsync(async (req, res) => {
  const { userId, title, message } = req.body;
  const user = await getUserById(userId);

  if (user.emailNotificationsEnabled) {
    await sendAppointmentNotification(user.email, title, message);
  }

  if (user.pushNotificationsEnabled && user.pushSubscription) {
    const payload = JSON.stringify({ title, message });
    await sendPushNotification(user.pushSubscription, payload);
  }

  res.status(200).send({ message: 'Notification sent successfully' });
});

module.exports = {
  sendAppointmentNotificationToUser,
};
