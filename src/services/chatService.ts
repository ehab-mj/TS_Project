import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    doc,
    type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

export type ChatMessage = {
    id: string
    text: string
    senderRole: 'guest' | 'provider'
    senderUid: string
    isRead: boolean
}

export function listenToConversationMessages(
    conversationId: string,
    callback: (messages: ChatMessage[]) => void
): Unsubscribe {
    const messagesRef = collection(db, 'Chat', conversationId, 'messages')
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'))

    return onSnapshot(messagesQuery, (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs.map((docItem) => {
            const data = docItem.data() as Record<string, unknown>

            return {
                id: docItem.id,
                text: typeof data.text === 'string' ? data.text : '',
                senderRole: data.senderRole === 'provider' ? 'provider' : 'guest',
                senderUid: typeof data.senderUid === 'string' ? data.senderUid : '',
                isRead: typeof data.isRead === 'boolean' ? data.isRead : false,
            }
        })

        callback(messages)
    })
}

type SendMessageInput = {
    conversationId: string
    text: string
    senderRole: 'guest' | 'provider'
    senderUid: string
}

export async function sendMessage(input: SendMessageInput) {
    const cleanText = input.text.trim()
    if (!cleanText) return

    const messagesRef = collection(db, 'Chat', input.conversationId, 'messages')

    await addDoc(messagesRef, {
        text: cleanText,
        senderRole: input.senderRole,
        senderUid: input.senderUid,
        isRead: false,
        createdAt: serverTimestamp(),
    })

    const conversationRef = doc(db, 'Chat', input.conversationId)

    await updateDoc(conversationRef, {
        lastMessage: cleanText,
        lastSenderRole: input.senderRole,
        ...(input.senderRole === 'guest'
            ? { providerUnreadCount: 1 }
            : { guestUnreadCount: 1 }),
    })
}