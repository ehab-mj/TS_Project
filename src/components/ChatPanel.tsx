import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { closeChat } from '../features/home/uiSlice'
import { selectAuthUser } from '../features/auth/selectors'
import {
    ensureConversation,
    listenToConversationMessages,
    sendGuestMessageToProvider,
    type ChatMessage,
} from '../services/chatService'
import '../styles/ChatPanel.css'

export default function ChatPanel() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectAuthUser)
    const { isChatOpen, activeChatProvider } = useAppSelector((state) => state.ui)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [conversationId, setConversationId] = useState('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let unsubscribe: (() => void) | null = null

        const start = async () => {
            if (!isChatOpen || !activeChatProvider?.uid) {
                setMessages([])
                setConversationId('')
                return
            }

            const id = await ensureConversation({
                providerId: activeChatProvider.id,
                providerUid: activeChatProvider.uid,
                providerName: activeChatProvider.name,
                providerCategory: activeChatProvider.category,
                providerImage: activeChatProvider.image,
                providerStatus: activeChatProvider.status,
                user,
            })

            setConversationId(id)
            unsubscribe = listenToConversationMessages(id, setMessages)
        }

        start().catch((error) => {
            console.error('Failed to start chat:', error)
        })

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [isChatOpen, activeChatProvider, user])

    useEffect(() => {
        if (!isChatOpen) return
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isChatOpen])

    const handleSend = async () => {
        const value = input.trim()
        if (!value || !activeChatProvider?.uid) return

        await sendGuestMessageToProvider({
            providerId: activeChatProvider.id,
            providerUid: activeChatProvider.uid,
            providerName: activeChatProvider.name,
            providerCategory: activeChatProvider.category,
            providerImage: activeChatProvider.image,
            providerStatus: activeChatProvider.status,
            user,
            text: value,
        })

        setInput('')
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
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`chat-panel__message chat-panel__message--${message.senderRole === 'provider' ? 'provider' : 'user'
                                }`}
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
                        disabled={!conversationId && !activeChatProvider?.uid}
                    >
                        Send
                    </button>
                </div>
            </aside>
        </>
    )
}