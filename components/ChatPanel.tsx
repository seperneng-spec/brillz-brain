'use client';

import { useState } from 'react';

const initialMessages = [
  { role: 'assistant', content: 'สวัสดี ผมคือ Brillz Brain พร้อมช่วยประมวลผลและจัดการระบบของคุณ' },
  { role: 'assistant', content: 'โปรดระบุว่าคุณต้องการตรวจสอบระบบ ใบสั่งการ หรือสร้าง workflow ใด' },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const submitPrompt = async () => {
    const trimmed = draft.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();
      const reply = data.reply ?? 'ขออภัย ไม่สามารถสร้างคำตอบได้ในตอนนี้';
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch (_error) {
      setMessages([...nextMessages, { role: 'assistant', content: 'เกิดข้อผิดพลาดระหว่างการสื่อสารกับ AI' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <strong>AI Chat</strong>
        <span>{loading ? 'Processing...' : 'Ready'}</span>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          aria-label="Chat input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitPrompt();
          }}
          placeholder="พิมพ์คำสั่งของคุณ..."
        />
        <button type="button" onClick={submitPrompt} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </section>
  );
}
