type ConfirmDialogProps = {
  message: string;
  testId: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ message, testId, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div
      className="app-overlay fixed inset-0 flex items-center justify-center p-4"
      data-testid={`${testId}-overlay`}
    >
      <div className="app-dialog-panel" data-testid={testId}>
        <div className="app-dialog-body mt-0">
          <p className="text-sm">{message}</p>
        </div>
        <div className="app-dialog-actions">
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-sm"
            onClick={onCancel}
            data-testid={`${testId}-cancel`}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger px-3 py-2 text-sm"
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
