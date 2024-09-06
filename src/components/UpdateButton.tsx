"use client";

import { useFormStatus } from "react-dom";

export const UpdateButton = () => {
  const { pending } = useFormStatus();
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-700 p-2 mt-2 rounded-md text-white disabled:bg-opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
}