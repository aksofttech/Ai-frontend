"use client";

import React, { useState } from 'react';
import ChatWithBook from '@/components/features/ChatWithBook';
import SplitWorkspace from '@/components/layout/SplitWorkspace';

export default function StudentChatPage() {
  const [chatReady, setChatReady] = useState(false);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <SplitWorkspace>
        <ChatWithBook onReady={setChatReady} />
      </SplitWorkspace>
    </div>
  );
}
