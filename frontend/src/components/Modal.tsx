import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  testId: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, testId, children, onClose }: ModalProps) {
  return (
    <div
      className="app-overlay fixed inset-0 flex items-center justify-center p-4"
      data-testid={`${testId}-overlay`}
    >
      <div className="app-dialog-panel" data-testid={testId}>
        <div className="app-dialog-header">
          <h2 className="app-dialog-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-3 py-2 text-sm"
            data-testid={`${testId}-close`}
          >
            Close
          </button>
        </div>
        <div className="app-dialog-body">{children}</div>
      </div>
    </div>
  );
}
