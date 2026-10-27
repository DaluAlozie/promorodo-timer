import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Accessible name and tooltip, for buttons that only show an icon
  label?: string;
  // Keyboard shortcut announced to screen readers and shown in the tooltip
  shortcut?: string;
};
export default function Button({
  children,
  onClick,
  disabled = false,
  label,
  shortcut,
}: ButtonProps) {
  const title = label && shortcut ? `${label} (${shortcut})` : label;
  return (
    <div>
      {disabled ? (
        <button
          disabled={true}
          type="button"
          aria-label={label}
          aria-keyshortcuts={shortcut}
          title={title}
          className={`mb-2 rounded-lg px-5 py-2.5 text-lg text-white opacity-25 focus:outline-none`}
        >
          {children}
        </button>
      ) : (
        <button
          onClick={onClick}
          disabled={false}
          type="button"
          aria-label={label}
          aria-keyshortcuts={shortcut}
          title={title}
          className="mb-2 rounded-lg px-5 py-2.5 text-lg hover:opacity-75 focus:outline-none"
        >
          {children}
        </button>
      )}
    </div>
  );
}
