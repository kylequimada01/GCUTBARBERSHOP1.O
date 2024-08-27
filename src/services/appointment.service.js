const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Appointment } = require('../models');

const createAppointment = async (appointmentBody) => {
  return Appointment.create(appointmentBody);
};

const queryAppointments = async (filter, options) => {
  const appointments = await Appointment.paginate(filter, options);
  return appointments;
};

const getAppointmentById = async (id) => {
  return Appointment.findById(id);
};

const updateAppointmentById = async (appointmentId, updateBody) => {
  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  Object.assign(appointment, updateBody);
  await appointment.save();
  return appointment;
};

const deleteAppointmentById = async (appointmentId) => {
  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  await appointment.remove();
  return appointment;
};

module.exports = {
  createAppointment,
  queryAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
};
