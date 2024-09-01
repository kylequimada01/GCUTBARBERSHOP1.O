const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const { appointmentService, userService, serviceService } = require('../services');
const { sendAppointmentNotificationToUser } = require('./notification.controller');

const createAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);

  const barberDetails = await userService.getUserById(appointment.preferredHairdresser);
  const serviceDetails = await serviceService.getServiceById(appointment.serviceType);

  await sendAppointmentNotificationToUser({
    userId: appointment.userId,
    type: 'Confirmation',
    appointmentDetails: appointment,
    barberDetails,
    serviceDetails,
    notificationType: 'confirmation',
  });

  res.status(httpStatus.CREATED).send(appointment);
});

const getAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.queryAppointments(req.query, {});
  res.send(result);
});

const getAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  res.send(appointment);
});

const updateAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateAppointmentById(req.params.appointmentId, req.body);

  const barberDetails = await userService.getUserById(appointment.preferredHairdresser);
  const serviceDetails = await serviceService.getServiceById(appointment.serviceType);

  let notificationType = 'update';
  let type = 'Update';

  if (req.body.status === 'Cancelled') {
    notificationType = 'cancellation';
    type = 'Cancellation';
  } else if (req.body.status === 'Past') {
    notificationType = 'feedback';
    type = 'Feedback';
  }

  await sendAppointmentNotificationToUser({
    userId: appointment.userId,
    type,
    appointmentDetails: appointment,
    barberDetails,
    serviceDetails,
    notificationType,
  });

  res.send(appointment);
});

const deleteAppointment = catchAsync(async (req, res) => {
  await appointmentService.deleteAppointmentById(req.params.appointmentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
