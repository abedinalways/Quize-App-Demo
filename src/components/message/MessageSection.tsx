'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useSelector } from 'react-redux';

interface AuthState {
  user?: { id: string };
  auth?: { user?: { id: string } };
}

interface RootState {
  auth?: AuthState;
}

export default function MessageSection() {
  const { messages } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  const meId = useSelector(
    (s: RootState) => s.auth?.user?.id || s.auth?.auth?.user?.id,
  );

  // ✅ Only auto scroll (no GSAP full re-animation)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex flex-col p-4 overflow-y-auto space-y-2">
      {[...messages]
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map(msg => {
          const isMe = msg?.sender?.id === meId;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isMe && (
                <Image
                  src={ '/images/dashboard/img008.png'}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}

              <div
                className={`
                  relative px-4 py-3 rounded-2xl max-w-[70%] text-sm
                  ${
                    isMe
                      ? 'bg-[#095f48] text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }
                `}
              >
                {/* Message Text */}
                {msg.message && (
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                )}

                {/* Attachments */}
                {msg.attachments?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.attachments.map(file => {
                      const isImage =
                        file.type?.includes('image') ||
                        file.file_url?.match(/\.(jpeg|jpg|png|gif|webp)$/);

                      const isAudio =
                        file.type?.includes('audio') ||
                        file.file_url?.match(/\.(mp3|wav|webm|ogg)$/);

                      if (isImage) {
                        return (
                          <Image
                            key={file.id}
                            src={'/images/dashboard/img008.png'}
                            alt={file.name}
                            width={300}
                            height={200}
                            className="rounded-xl object-cover"
                          />
                        );
                      }

                      if (isAudio) {
                        return (
                          <div
                            key={file.id}
                            className="bg-black/10 rounded-xl p-2"
                          >
                            <audio
                              controls
                              src={file.file_url}
                              className="w-full"
                            />
                          </div>
                        );
                      }

                      return (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          className="text-xs underline"
                        >
                          📎 {file.name}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Time */}
                <div className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

      <div ref={endRef} />
    </div>
  );
}
