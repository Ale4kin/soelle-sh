type ModalProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  message?: string;
};

export default function Modal({
  showModal,
  setShowModal,
  message,
}: ModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Success!</h2>
        <p>{message ? message : "Your action was successful."}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
