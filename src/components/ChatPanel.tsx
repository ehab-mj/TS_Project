import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
    closeChat,
    receiveMessageFromProvider,
    sendMessageToProvider,
} from '../features/home/uiSlice'
import '../styles/ChatPanel.css'

export default function ChatPanel() {
    const dispatch = useAppDispatch()
    const { isChatOpen, activeChatProvider, messagesByProviderId } = useAppSelector(
        (state) => state.ui
    )
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const activeMessages = activeChatProvider
        ? messagesByProviderId[activeChatProvider.id] ?? []
        : []

    useEffect(() => {
        if (!isChatOpen) return
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeMessages, isChatOpen])

    const handleSend = () => {
        const value = input.trim()
        if (!value || !activeChatProvider) return

        dispatch(
            sendMessageToProvider({
                providerId: activeChatProvider.id,
                text: value,
            })
        )
        setInput('')

        window.setTimeout(() => {
            dispatch(
                receiveMessageFromProvider({
                    providerId: activeChatProvider.id,
                    text: `Thanks for your message. This is ${activeChatProvider.name}, I will reply soon.`,
                })
            )
        }, 700)
    }

    return (
        <>
            <button
                type="button"
                className={`chat-panel__overlay ${isChatOpen ? 'chat-panel__overlay--show' : ''}`}
                onClick={() => dispatch(closeChat())}
                aria-label="Close chat"
            />

            <aside className={`chat-panel ${isChatOpen ? 'chat-panel--show' : ''}`}>
                <div className="chat-panel__grabber" />

                <div className="chat-panel__header">
                    <div className="chat-panel__provider-info">
                        {activeChatProvider?.image ? (
                            <img
                                src={activeChatProvider.image}
                                alt={activeChatProvider.name}
                                className="chat-panel__provider-avatar"
                            />
                        ) : (
                            <div className="chat-panel__provider-avatar chat-panel__provider-avatar--placeholder">
                                {activeChatProvider?.name?.slice(0, 1) ?? 'P'}
                            </div>
                        )}

                        <div>
                            <p className="chat-panel__eyebrow">
                                {activeChatProvider?.category ?? 'Provider'}
                            </p>
                            <h2 className="chat-panel__title">
                                {activeChatProvider?.name ?? 'Provider Chat'}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="chat-panel__close"
                        onClick={() => dispatch(closeChat())}
                        aria-label="Close chat"
                    >
                        ✕
                    </button>
                </div>

                <div className="chat-panel__messages">
                    {activeMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`chat-panel__message chat-panel__message--${message.sender}`}
                        >
                            {message.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-panel__composer">
                    <input
                        type="text"
                        className="chat-panel__input"
                        placeholder={
                            activeChatProvider
                                ? `Message ${activeChatProvider.name}...`
                                : 'Write a message...'
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend()
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="chat-panel__send"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </aside>
        </>
    )
}