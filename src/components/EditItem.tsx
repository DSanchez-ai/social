"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";

import { addCartItem, updateItem } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";
import { OrderButton } from "./OrderButton";

export const EditItem: React.FC<{ item: any }> = ({ item }) => {
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const [ img, setImg ] = useState<any>();  
  const [formData, setFormData] = useState({
    title: item.title || '',
    desc: item.desc || '',
    url: item.url || '',
    prize: item.prize || 0,
  });

  const [orderData, setOrderData] = useState({
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('quantity', orderData.quantity.toString());

    addCartItem(formDataToSend, item);
    router.refresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    let url = "";
    if(!img?.secure_url) {
      url = item.video || item.img || "";
    } else {
      url = img.secure_url;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('url', formData.url);
    formDataToSend.append('prize', formData.prize);

    updateItem(formDataToSend, url, item);
    router.refresh();
  };

  return (
    <div>
      { /* USER */ }
      {currentUserId === item.userId ? (
        <form onSubmit={handleSubmit}>
        <CldUploadWidget 
          uploadPreset="slsocial" 
          onSuccess={(result, {widget}) => {
            if (result.info) {
              setImg(result.info);
            }
            widget.close();
          }}
          >      
          {({ open }) => { 
            return (  
              <div className="w-full relative">
                {item.video ? (
                  <div
                    className="w-full relative"
                  >
                    <video
                      controls
                      loop
                      preload="auto"
                      playsInline
                    >
                      <source src={item.video} type="video/mp4" />
                    </video>
                    <span 
                      onClick={() => open()}
                      className="text-blue-500 text-xs hover:underline cursor-pointer">Change</span>
                  </div>
                ) : (
                  <>
                    {item.img ? (
                      <Image 
                        onClick={() => open()}
                        src={item.img || ""}
                        alt=""
                        width={670}
                        height={670}
                        className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
                      />
                    ) : (
                      <span 
                        onClick={() => open()}
                        className="text-blue-500 text-xs hover:underline cursor-pointer"
                      >
                        Add Photo/Video
                      </span>                      
                    )}
                  </>
                )}
              </div> 
            )}}
          </CldUploadWidget>             
          <p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-sm lg:text-base p-2 border rounded-md mb-1"
            />
          </p>
          <p className="text-sm lg:text-base">
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://"
              className="w-full p-2 border text-blue-500 rounded-md mb-1"
            />
          </p> 
          <p>
            <input
              type="number"
              name="prize"
              value={formData.prize}
              onChange={handleChange}
              placeholder="Prize"
              className="w-[140px] text-sm lg:text-base p-2 border rounded-md mb-1"
            />
          </p>         
          <p className="text-sm lg:text-base">
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Enter the description"
              rows={10}
              className="w-full p-2 border rounded-md"
            />
          </p>
          { formData.title.length > 0 && (
            <EditPostButton />
          )}
        </form>
      ) : (
        <form onSubmit={handleOrder}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm md:text-lg xl:text-xl">{item.title}</h2>
              {item.url && (
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {item.url}
                </a>
              )}                                           
            </div>
            { item.prize && (
              <a
                href={`/market/${item.id}`} 
                className="text-sm text-green-800 font-semibold bg-green-200 p-2 rounded-xl shadow-md w-[120px] cursor-pointer hover:bg-green-300 flex items-center justify-center"
              >
                Prize: ${item.prize.toFixed(2)}
              </a>
            )}            
            <div className="flex flex-col gap-4">
              <div className="w-full relative">
                {item.desc && (
                  <p>
                    {item.desc}
                  </p>
                ) }
              </div>  
              { /* IMAGE / VIDEO */}        
              {item.video ? (
                <video
                  controls
                  loop
                  preload="auto"
                  playsInline
                >
                  <source src={item.video} type="video/mp4" />
                </video>          
              ) : (
                <>
                  {item.img && (
                    <Image 
                      src={item.img || ""}
                      alt=""
                      width={670}
                      height={670}
                      className="object-contain rounded-md"
                    />
                  )}
                </>
              )}                          
            </div>
            { item.prize && (
              <div className="mb-4 flex items-center justify-center">
                <OrderButton />
              </div>
            )}            
          </div>
        </form>
      )}
    </div>
  );
};

