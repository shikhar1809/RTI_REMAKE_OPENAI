import { X, Globe2, ShieldCheck, Info } from "lucide-react";

interface PublicConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PublicConsentModal({ isOpen, onClose, onConfirm }: PublicConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-green-600 p-6 text-white flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Globe2 size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Public Archive Consent</h2>
              <p className="text-green-100 text-sm font-medium mt-1">Share your RTI to help others</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
            <Info size={20} className="shrink-0 mt-0.5 text-blue-600" />
            <p>
              <strong>You can turn this off at any time.</strong> If you change your mind later, you can instantly hide this RTI from the public by toggling it off in your tracking dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">What happens when I publish?</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-600 items-start">
                <ShieldCheck size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span>Your RTI's subject, problem summary, and the authority's reply (if any) will be visible to the public.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600 items-start">
                <ShieldCheck size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span>Your personal details (Name, Address, Phone) will be automatically <strong>anonymized and hidden</strong>.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600 items-start">
                <ShieldCheck size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span>Other citizens can use your RTI as a reference or template to fight similar issues in their state.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <button onClick={onClose} className="btn-secondary flex-1 py-3 text-base">
              Cancel
            </button>
            <button onClick={() => { onConfirm(); onClose(); }} className="btn-primary flex-1 py-3 text-base">
              I Agree, Publish It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
