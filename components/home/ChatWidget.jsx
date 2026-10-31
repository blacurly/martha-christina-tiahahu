'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import FormattedText from './FormattedText'

export default function ChatWidget () {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage (event) {
    event?.preventDefault()
    const message = input.trim()
    if (!message || loading) return

    setMessages(prev => [...prev, { role: 'user', content: message }])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/tanya-sycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Permintaan gagal')
      }
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.answer || 'Belum ada jawaban.' }
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Maaf, terjadi kendala: ${error.message}`
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3'>
      {isOpen && (
        <section
          className='flex h-[min(700px,80dvh)] w-[calc(100vw-2rem)] max-w-[480px] flex-col overflow-hidden rounded-[24px] border border-[#F0D4DF] bg-[#FFF8FB] shadow-[0_12px_45px_rgba(120,70,90,0.20)] sm:h-[500px]'
          aria-label='Chat Tanya SYCLE'
        >
          {/* Header */}
          <header className='flex items-center gap-3 bg-[#F8E8EF] p-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B84E73] text-white shadow-sm'>
              <Heart size={23} fill='currentColor' />
            </div>

            <div className='min-w-0 flex-1'>
              <h2 className='font-bold text-[#332A35]'>Tanya SYCLE</h2>
              <p className='text-xs text-[#765866]'>
                Teman memahami lingkungan dan kesehatan perempuan
              </p>
            </div>

            <button
              type='button'
              onClick={() => setIsOpen(false)}
              aria-label='Tutup chat'
              className='rounded-full p-2 text-[#765866] transition hover:bg-white/70 hover:text-[#8E3E5E]'
            >
              <X size={19} />
            </button>
          </header>

          {/* Chat messages */}
          <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-4'>
            <div className='flex items-start gap-2'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-[#B84E73]'>
                <Sparkles size={17} />
              </div>

              <div className='max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm leading-relaxed text-[#493D49] shadow-sm'>
                Hai! 💗 Aku Tanya SYCLE.
                <p className='mt-2'>
                  Aku akan membantumu memahami hubungan lingkungan dengan
                  kesehatan perempuan. Apa yang ingin kamu ketahui hari ini?
                </p>
              </div>
            </div>

            {messages.map((item, index) => (
              <div
                key={index}
                className={`max-w-[88%] rounded-2xl p-3 text-sm leading-relaxed ${
                  item.role === 'user'
                    ? 'self-end rounded-tr-sm bg-[#B84E73] text-white'
                    : 'self-start rounded-tl-sm bg-white text-[#493D49] shadow-sm'
                }`}
              >
                {item.role === 'user' ? (
                  <p className='whitespace-pre-wrap font-semibold text-white'>{item.content}</p>
                ) : (
                  <FormattedText text={item.content} />
                )}
              </div>
            ))}
            {loading && (
              <p style={{ color: '#D1D5DB', fontSize: 13 }}>
                Sedang mencari informasi…
              </p>
            )}
          </div>

          {/* Message input */}
          <form
            onSubmit={sendMessage}
            className='border-t border-[#F0D4DF] bg-white p-3'
          >
            <div className='flex items-center gap-2 rounded-2xl border border-[#EADCE3] bg-[#FFF8FB] p-1.5 focus-within:border-[#B84E73]'>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                type='text'
                placeholder='Tulis pertanyaanmu...'
                aria-label='Tulis pesan'
                className='min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#332A35] outline-none placeholder:text-[#A3949E]'
              />

              <button
                type='submit'
                disabled={loading || !input.trim()}
                aria-label='Kirim pesan'
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B84E73] text-white transition hover:bg-[#8E3E5E] disabled:cursor-not-allowed disabled:opacity-40'
              >
                <Send size={17} />
              </button>
            </div>

            <p className='mt-2 text-center text-[10px] leading-relaxed text-[#8A7A85]'>
              Hindari memasukkan data pribadi atau informasi kesehatan yang
              sensitif.
            </p>
          </form>
        </section>
      )}

      {/* Floating button */}
      <button
        type='button'
        onClick={() => setIsOpen(previous => !previous)}
        aria-label={isOpen ? 'Tutup Tanya SYCLE' : 'Buka Tanya SYCLE'}
        aria-expanded={isOpen}
        className='group flex items-center gap-2 rounded-full border border-white/80 bg-[#B84E73] py-3 pl-4 pr-5 text-white shadow-[0_6px_24px_rgba(184,78,115,0.32)] transition duration-200 hover:-translate-y-1 hover:bg-[#8E3E5E] hover:shadow-[0_10px_28px_rgba(184,78,115,0.35)] active:translate-y-0'
      >
        {isOpen ? (
          <X size={21} />
        ) : (
          <span className='relative flex'>
            <MessageCircle size={22} />
            <Heart
              size={10}
              fill='currentColor'
              className='absolute -right-1 -top-1'
            />
          </span>
        )}

        <span className='text-sm font-bold'>
          {isOpen ? 'Tutup Chat' : 'Tanya SYCLE'}
        </span>
      </button>
    </div>
  )
}
