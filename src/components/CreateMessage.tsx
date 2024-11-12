"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@prisma/client";

import { createMessage } from "@/lib/actions";
import { SendMessageButton } from "./SendMessageButton";

export const CreateMessage: React.FC<{ user: User }> = ({ user }) => {
  const  receiverId  = user.userId;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('receiverId', receiverId);

    createMessage(formDataToSend);
    router.refresh();
    router.push('/messages/sent');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title"
            className="w-full text-sm lg:text-base p-2 border rounded-md mb-1"
          />
        </p>
        <p className="text-sm lg:text-base">
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Enter the message"
            rows={10}
            className="w-full p-2 border rounded-md"
          />
        </p>
        { formData.title.length > 0 && (
          <SendMessageButton />
        )}
      </form>
    </div>
  );
};

