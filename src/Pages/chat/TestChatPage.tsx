// import { useEffect, useState } from 'react'
// import {
//     listenToConversationMessages,
//     sendMessage,
//     type ChatMessage,
// } from '../../services/chatService'

// export default function TestChatPage() {
//     const [messages, setMessages] = useState<ChatMessage[]>([])
//     const [text, setText] = useState('')

//     const conversationId = 'Nin7X1snzYBgnnmY0Cux'

//     useEffect(() => {
//         const unsubscribe = listenToConversationMessages(conversationId, (items) => {
//             setMessages(items)
//         })

//         return () => unsubscribe()
//     }, [conversationId])

//     const handleSend = async () => {
//         if (!text.trim()) return

//         await sendMessage({
//             conversationId,
//             text,
//             senderRole: 'guest',
//             senderUid: 'guest123',
//         })

//         setText('')
//     }

//     return (
//         <section
//             style={{
//                 minHeight: '100vh',
//                 background: '#141414',
//                 color: '#fff',
//                 padding: '24px',
//             }}
//         >
//             <div
//                 style={{
//                     maxWidth: '800px',
//                     margin: '0 auto',
//                     background: '#1c1c20',
//                     border: '1px solid rgba(255,255,255,0.06)',
//                     borderRadius: '24px',
//                     padding: '20px',
//                 }}
//             >
//                 <h1 style={{ marginTop: 0 }}>Test Chat</h1>

//                 <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
//                     {messages.length === 0 ? (
//                         <p>No messages found.</p>
//                     ) : (
//                         messages.map((message) => (
//                             <div
//                                 key={message.id}
//                                 style={{
//                                     padding: '12px 14px',
//                                     borderRadius: '16px',
//                                     background:
//                                         message.senderRole === 'provider'
//                                             ? 'rgba(192, 32, 62, 0.18)'
//                                             : 'rgba(255,255,255,0.06)',
//                                 }}
//                             >
//                                 <p style={{ margin: '0 0 6px', fontSize: '12px', opacity: 0.7 }}>
//                                     {message.senderRole}
//                                 </p>
//                                 <p style={{ margin: 0 }}>{message.text}</p>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     <input
//                         type="text"
//                         value={text}
//                         onChange={(event) => setText(event.target.value)}
//                         placeholder="Write a message..."
//                         style={{
//                             flex: 1,
//                             height: '48px',
//                             borderRadius: '14px',
//                             border: '1px solid rgba(255,255,255,0.08)',
//                             background: '#111214',
//                             color: '#fff',
//                             padding: '0 14px',
//                             outline: 'none',
//                         }}
//                     />

//                     <button
//                         type="button"
//                         onClick={handleSend}
//                         style={{
//                             minWidth: '110px',
//                             height: '48px',
//                             border: 'none',
//                             borderRadius: '14px',
//                             background: '#c0203e',
//                             color: '#fff',
//                             fontWeight: 700,
//                             cursor: 'pointer',
//                         }}
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </section>
//     )
// }