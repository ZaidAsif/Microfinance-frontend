import { Application } from "@/types/application";

type ModalProps = {
  showModal: boolean;
  closeModal: () => void;
  application: Application | null;
};

export default function AppDetailModal({ showModal, closeModal, application }: ModalProps) {
  if (!application) return null;

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${!showModal && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Application Details</h3>
        <p><strong>Time:</strong> {application.appointmentDetails.time}</p>
        <p><strong>User:</strong> {application.userId.name}</p>
        <p><strong>Email:</strong> {application.userId.email}</p>
        <p><strong>Loan Category:</strong> {application.category}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p><strong>Amount:</strong> ${application.amount}</p>
        <p><strong>Guarantors:</strong></p>
        <ul>
          <li>{application.guarantor1Name} — {application.guarantor1Cnic}</li>
          <li>{application.guarantor2Name} — {application.guarantor2Cnic}</li>
        </ul>
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">Close</button>
      </div>
    </div>
  );
};
