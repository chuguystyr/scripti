"use client";

import { useFormStatus } from "react-dom";

const SubmitButton: React.FC<{ text: string }> = ({ text }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn-filled block mx-auto"
      disabled={pending}
    >
      {pending ? "Submitting..." : text}
    </button>
  );
};

export default SubmitButton;
