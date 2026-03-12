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
      <div className="app-card w-full max-w-md p-4" data-testid={testId}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="btn-secondary px-3 py-1"
            data-testid={`${testId}-close`}
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
