import {
    addDoc,
    collection,
    doc,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    type Unsubscribe,
} from 'firebase/firestore'
import type { AppUser } from '../types/auth'
import { db } from '../firebase/firebase'

export type ChatMessage = {
    id: string
    text: string
    senderRole: 'guest' | 'provider'
    senderUid: string
    isRead: boolean
}

export type ConversationItem = {
    id: string
    providerId: number
    providerUid: string
    providerName: string
    providerCategory: string
    providerImage: string
    providerStatus: 'active' | 'busy'
    guestKey: string
    guestName: string
    lastMessage: string
    providerUnreadCount: number
    guestUnreadCount: number
}

function getAnonymousGuestKey() {
    const storageKey = 'smart-services-anon-guest-key'
    const existing = localStorage.getItem(storageKey)
    if (existing) return existing

    const created = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem(storageKey, created)
    return created
}

export function getGuestKey(user: AppUser | null) {
    return user?.uid ?? getAnonymousGuestKey()
}

export function getConversationId(providerUid: string, guestKey: string) {
    return `${providerUid}__${guestKey}`
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

type EnsureConversationInput = {
    providerId: number
    providerUid: string
    providerName: string
    providerCategory: string
    providerImage?: string
    providerStatus?: 'active' | 'busy'
    user: AppUser | null
}

export async function ensureConversation(input: EnsureConversationInput) {
    const guestKey = getGuestKey(input.user)
    const conversationId = getConversationId(input.providerUid, guestKey)

    await setDoc(
        doc(db, 'Chat', conversationId),
        {
            providerId: input.providerId,
            providerUid: input.providerUid,
            providerName: input.providerName,
            providerCategory: input.providerCategory,
            providerImage: input.providerImage ?? '',
            providerStatus: input.providerStatus ?? 'active',
            guestKey,
            guestName: input.user?.displayName || 'Guest',
            guestUid: input.user?.uid ?? '',
            guestIsAnonymous: !input.user,
            lastMessage: '',
            lastSenderRole: '',
            providerUnreadCount: 0,
            guestUnreadCount: 0,
            lastMessageAt: serverTimestamp(),
        },
        { merge: true }
    )

    return conversationId
}

type SendGuestMessageInput = {
    providerId: number
    providerUid: string
    providerName: string
    providerCategory: string
    providerImage?: string
    providerStatus?: 'active' | 'busy'
    user: AppUser | null
    text: string
}

export async function sendGuestMessageToProvider(input: SendGuestMessageInput) {
    const cleanText = input.text.trim()
    if (!cleanText) return

    const conversationId = await ensureConversation({
        providerId: input.providerId,
        providerUid: input.providerUid,
        providerName: input.providerName,
        providerCategory: input.providerCategory,
        providerImage: input.providerImage,
        providerStatus: input.providerStatus,
        user: input.user,
    })

    await addDoc(collection(db, 'Chat', conversationId, 'messages'), {
        text: cleanText,
        senderRole: 'guest',
        senderUid: input.user?.uid ?? getGuestKey(input.user),
        isRead: false,
        createdAt: serverTimestamp(),
    })

    await setDoc(
        doc(db, 'Chat', conversationId),
        {
            lastMessage: cleanText,
            lastSenderRole: 'guest',
            lastMessageAt: serverTimestamp(),
            providerUnreadCount: increment(1),
        },
        { merge: true }
    )
}

export function listenToGuestConversations(
    user: AppUser | null,
    callback: (items: ConversationItem[]) => void
): Unsubscribe {
    const guestKey = getGuestKey(user)

    const conversationsQuery = query(
        collection(db, 'Chat'),
        where('guestKey', '==', guestKey)
    )

    return onSnapshot(conversationsQuery, (snapshot) => {
        const items: ConversationItem[] = snapshot.docs.map((docItem) => {
            const data = docItem.data() as Record<string, unknown>

            return {
                id: docItem.id,
                providerId: typeof data.providerId === 'number' ? data.providerId : 0,
                providerUid: typeof data.providerUid === 'string' ? data.providerUid : '',
                providerName: typeof data.providerName === 'string' ? data.providerName : 'Provider',
                providerCategory: typeof data.providerCategory === 'string' ? data.providerCategory : '',
                providerImage: typeof data.providerImage === 'string' ? data.providerImage : '',
                providerStatus: data.providerStatus === 'busy' ? 'busy' : 'active',
                guestKey: typeof data.guestKey === 'string' ? data.guestKey : '',
                guestName: typeof data.guestName === 'string' ? data.guestName : 'Guest',
                lastMessage: typeof data.lastMessage === 'string' ? data.lastMessage : '',
                providerUnreadCount:
                    typeof data.providerUnreadCount === 'number' ? data.providerUnreadCount : 0,
                guestUnreadCount:
                    typeof data.guestUnreadCount === 'number' ? data.guestUnreadCount : 0,
            }
        })

        items.sort((a, b) => b.id.localeCompare(a.id))
        callback(items)
    })
}