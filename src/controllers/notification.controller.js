const catchAsync = require('../utils/catchAsync');
const { sendAppointmentEmail } = require('../services/email.service');
const { sendPushNotification, prepareNotificationPayload } = require('../services/push.service');
const { getUserById } = require('../services/user.service');

const sendAppointmentNotificationToUser = catchAsync(async (params) => {
  const { userId, type, appointmentDetails, barberDetails, serviceDetails, notificationType } = params;
  const user = await getUserById(userId);

  // console.log(`Sending notification to user: ${userId}`);
  // console.log(`User email notifications enabled: ${user.emailNotificationsEnabled}`);
  // console.log(`User push notifications enabled: ${user.pushNotificationsEnabled}`);
  // console.log(`User push subscription: ${user.pushSubscription}`);

  if (user.emailNotificationsEnabled) {
    await sendAppointmentEmail(notificationType, user.email, appointmentDetails, barberDetails, serviceDetails);
  }

  if (user.pushNotificationsEnabled && user.pushSubscription) {
    const payload = prepareNotificationPayload(type, appointmentDetails);
    await sendPushNotification(user.pushSubscription, payload);
  }
});

module.exports = {
  sendAppointmentNotificationToUser,
};
