"use client";

import { useFormStatus } from "react-dom";

export const EditPostButton = () => {
  const { pending } = useFormStatus();

  return (
    <button 
      className="bg-blue-500 hover:bg-blue-400 p-2 ml-2 mt-2 rounded-md text-white disabled:bg-blue-300 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-block h-[10px] w-[10px] animate-spin rounded-full border-2 border-white-300 border-solid border-current border-e-transparent text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">
            Updating
          </div>
        </div>
      ) : (
        "Update"
      )}
    </button>
  )
};