'use client';
import { ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, isPending }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-sm">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
  disabled={isPending}
  onClick={onConfirm}
  className={`px-3 py-1 text-sm text-white rounded ${
    isPending ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
  }`}
>
  {isPending ? 'Deleting...' : 'Confirm'}
</button>
        </div>
      </div>
    </div>
  );
}
