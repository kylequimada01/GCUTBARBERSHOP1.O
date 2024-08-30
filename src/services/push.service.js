const webpush = require('web-push');

webpush.setVapidDetails('mailto:test@example.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending push notification:', error);
  }
};

module.exports = {
  sendPushNotification,
};
