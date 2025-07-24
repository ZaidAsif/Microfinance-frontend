import { AppointmentDetails } from "./appointmentDetail";
import { User } from "./user";

export type Appointment = {
  _id: string;
  userId: User;
  loanId: string;
  date: string; 
  time: string; 
  token: string; 
  location: string;
  slipUrl: string; 
  createdAt: Date;
  category: string;
  appointmentDetails: AppointmentDetails
}