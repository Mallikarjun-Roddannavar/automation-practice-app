type ConfirmDialogProps = {
  message: string;
  testId: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ message, testId, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="app-overlay fixed inset-0 flex items-center justify-center p-4" data-testid={`${testId}-overlay`}>
      <div className="app-card w-full max-w-sm p-4" data-testid={testId}>
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="btn-secondary px-3 py-1"
            onClick={onCancel}
            data-testid={`${testId}-cancel`}
          >
            Cancel
          </button>
          <button
            className="btn-danger px-3 py-1"
            onClick={onConfirm}
            data-testid={`${testId}-confirm`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
