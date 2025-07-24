import { AppointmentDetails } from "./appointmentDetail";
import { User } from "./user";


export type Application = {
  amount: number;
  appointmentDetails: AppointmentDetails;
  category: string;
  city: string;
  createdAt: string;
  guarantor1Cnic: string;
  guarantor1Email: string;
  guarantor1Location: string;
  guarantor1Name: string;
  guarantor2Cnic: string;
  guarantor2Email: string;
  guarantor2Location: string;
  guarantor2Name: string;
  _id: string;
  monthlyInstallment: number;
  period: number;
  phone: string;
  status: string;
  subcategory: string;
  updatedAt: string;
  userId: User;
}