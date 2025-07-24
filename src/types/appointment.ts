import { Application } from "./application";
import { AppointmentDetails } from "./appointmentDetail";

export interface Appointment extends Application {
  appointmentDetails: AppointmentDetails;
}