const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const { appointmentService, emailService, userService, serviceService } = require('../services');

const createAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);

  // Fetch the barber and service details
  const barberDetails = await userService.getUserById(appointment.preferredHairdresser);
  const serviceDetails = await serviceService.getServiceById(appointment.serviceType);

  // Send confirmation email
  if (appointment.email) {
    await emailService.sendAppointmentEmail('confirmation', appointment.email, appointment, barberDetails, serviceDetails);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email address is required for appointment confirmations');
  }

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

  // Fetch the barber and service details
  const barberDetails = await userService.getUserById(appointment.preferredHairdresser);
  const serviceDetails = await serviceService.getServiceById(appointment.serviceType);

  if (req.body.status === 'Cancelled' && appointment.email) {
    // Send cancellation email
    await emailService.sendAppointmentEmail('cancellation', appointment.email, appointment, barberDetails, serviceDetails);
  } else if (appointment.email) {
    // Send update email if appointment status is not cancelled
    await emailService.sendAppointmentEmail('update', appointment.email, appointment, barberDetails, serviceDetails);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email address is required for appointment updates');
  }

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
