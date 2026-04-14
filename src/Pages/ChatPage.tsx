import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectAuthUser } from '../features/auth/selectors'
import { openExistingChatByProviderId } from '../features/home/uiSlice'
import { listenToGuestConversations, type ConversationItem } from '../services/chatService'
import '../styles/ChatsPage.css'

export default function ChatsPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectAuthUser)
    const [conversations, setConversations] = useState<ConversationItem[]>([])

    useEffect(() => {
        const unsubscribe = listenToGuestConversations(user, setConversations)
        return () => unsubscribe()
    }, [user])

    return (
        <section className="chats-page">
            <div className="chats-page__header">
                <span className="chats-page__eyebrow">Inbox</span>
                <h1 className="chats-page__title">Chats</h1>
                <p className="chats-page__text">
                    Your recent conversations with providers.
                </p>
            </div>

            {conversations.length === 0 ? (
                <div className="chats-empty">
                    <div className="chats-empty__icon">💬</div>
                    <h2 className="chats-empty__title">No chats yet</h2>
                    <p className="chats-empty__text">
                        Open any provider card and press chat to start a conversation.
                    </p>
                </div>
            ) : (
                <div className="chats-list">
                    {conversations.map((conversation) => (
                        <article
                            key={conversation.id}
                            className="chat-row"
                            onClick={() => {
                                dispatch(
                                    openExistingChatByProviderId(conversation.providerId)
                                )
                                navigate('/')
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    dispatch(
                                        openExistingChatByProviderId(conversation.providerId)
                                    )
                                    navigate('/')
                                }
                            }}
                        >
                            {conversation.providerImage ? (
                                <img
                                    src={conversation.providerImage}
                                    alt={conversation.providerName}
                                    className="chat-row__avatar"
                                />
                            ) : (
                                <div className="chat-row__avatar chat-row__avatar--placeholder">
                                    {conversation.providerName.slice(0, 1)}
                                </div>
                            )}

                            <div className="chat-row__content">
                                <div className="chat-row__top">
                                    <h2 className="chat-row__name">{conversation.providerName}</h2>
                                    <span
                                        className={`chat-row__status chat-row__status--${conversation.providerStatus}`}
                                    >
                                        {conversation.providerStatus === 'busy' ? 'Busy' : 'Active'}
                                    </span>
                                </div>

                                <p className="chat-row__category">{conversation.providerCategory}</p>
                                <p className="chat-row__preview">
                                    {conversation.lastMessage || 'No messages yet'}
                                </p>
                            </div>

                            <div className="chat-row__count">
                                {conversation.providerUnreadCount}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}