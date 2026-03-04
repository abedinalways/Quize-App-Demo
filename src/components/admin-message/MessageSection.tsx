'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';

export default function MessageSection() {
  const { messages, isTyping } = useChat();

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 },
      );
    }
  }, [messages.length]);

  return (
    <div ref={containerRef} className="p-3 overflow-y-auto">
      {messages.map(msg => {
        const isMe = msg.sender?.id === msg.sender?.id; 

        return (
          <div
            key={msg.id}
            className={`flex gap-3 ${isMe ? 'justify-end' : ''}`}
          >
            {!isMe && (
              <div className="flex items-start">
                <Image
                  src={
                    msg.sender?.avatar || '/images/dashboard/message/doctor.png'
                  }
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            )}

            <div
              className={`p-4 rounded-xl max-w-md text-sm ${
                isMe ? 'bg-[#095f48] text-white' : 'bg-gray-100'
              }`}
            >
              {msg.message}

              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map(file => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      className="text-xs underline opacity-80"
                    >
                      📎 {file.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {isMe && (
              <div className="flex items-end">
                <Image
                  src="/images/dashboard/message/me.png"
                  alt="me"
                  width={12}
                  height={12}
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}

      {isTyping && (
        <p className="text-sm text-gray-400">Someone is typing...</p>
      )}

      <div ref={endRef} />
    </div>
  );
}
