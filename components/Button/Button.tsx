import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export default function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <div>
      {disabled ? (
        <button
          disabled={true}
          type="button"
          className={`mb-2 rounded-lg px-5 py-2.5 text-lg text-white opacity-25 focus:outline-none`}
        >
          {children}
        </button>
      ) : (
        <button
          onClick={onClick}
          disabled={false}
          type="button"
          className="mb-2 rounded-lg px-5 py-2.5 text-lg hover:opacity-75 focus:outline-none"
        >
          {children}
        </button>
      )}
    </div>
  );
}
