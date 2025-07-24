export type Appointment = {
  _id: string;
  userId: string;
  loanId: string;
  date: string; 
  time: string; 
  token: string; 
  location: string;
  slipUrl: string; 
  createdAt: Date;
}