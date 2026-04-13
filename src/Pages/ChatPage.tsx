import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { openExistingChatByProviderId } from '../features/home/uiSlice'
import '../styles/ChatsPage.css'

function getLastMessage(messages: { text: string }[]) {
    if (!messages.length) return 'No messages yet'
    return messages[messages.length - 1]?.text ?? 'No messages yet'
}

export default function ChatsPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { messagesByProviderId, providersById } = useAppSelector((state) => state.ui)

    const conversations = Object.entries(messagesByProviderId)
        .map(([providerId, messages]) => {
            const numericId = Number(providerId)
            const provider = providersById[numericId]

            if (!provider) return null

            return {
                provider,
                messages,
                lastMessage: getLastMessage(messages),
                lastMessageId: messages[messages.length - 1]?.id ?? 0,
            }
        })
        .filter(Boolean)
        .sort((a, b) => (b?.lastMessageId ?? 0) - (a?.lastMessageId ?? 0))

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
                    {conversations.map((conversation) => {
                        if (!conversation) return null

                        const { provider, lastMessage, messages } = conversation

                        return (
                            <article
                                key={provider.id}
                                className="chat-row"
                                onClick={() => {
                                    dispatch(openExistingChatByProviderId(provider.id))
                                    navigate('/')
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        dispatch(openExistingChatByProviderId(provider.id))
                                        navigate('/')
                                    }
                                }}
                            >
                                {provider.image ? (
                                    <img
                                        src={provider.image}
                                        alt={provider.name}
                                        className="chat-row__avatar"
                                    />
                                ) : (
                                    <div className="chat-row__avatar chat-row__avatar--placeholder">
                                        {provider.name.slice(0, 1)}
                                    </div>
                                )}

                                <div className="chat-row__content">
                                    <div className="chat-row__top">
                                        <h2 className="chat-row__name">{provider.name}</h2>
                                        <span
                                            className={`chat-row__status chat-row__status--${provider.status ?? 'active'}`}
                                        >
                                            {provider.status === 'busy' ? 'Busy' : 'Active'}
                                        </span>
                                    </div>

                                    <p className="chat-row__category">{provider.category}</p>
                                    <p className="chat-row__preview">{lastMessage}</p>
                                </div>

                                <div className="chat-row__count">
                                    {messages.length}
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}