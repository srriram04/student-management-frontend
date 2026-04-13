import { AlertTriangle, Loader2 } from 'lucide-react';  
import Modal from './Modal';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>
        <p className="text-slate-600 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 w-full pt-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={20} /> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
