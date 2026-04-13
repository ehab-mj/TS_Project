import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Place } from '../home/homeSlice'

export type ChatMessage = {
    id: number
    sender: 'user' | 'provider'
    text: string
}

export type ChatProvider = {
    id: number
    uid?: string
    name: string
    category: string
    image?: string
    status?: 'active' | 'busy'
}

type UiState = {
    isChatOpen: boolean
    activeChatProvider: ChatProvider | null
    messagesByProviderId: Record<number, ChatMessage[]>
    providersById: Record<number, ChatProvider>
}

const initialState: UiState = {
    isChatOpen: false,
    activeChatProvider: null,
    messagesByProviderId: {},
    providersById: {},
}

function makeProvider(place: Place): ChatProvider {
    return {
        id: place.id,
        uid: place.uid,
        name: place.name,
        category: place.category,
        image: place.image,
        status: place.status,
    }
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openProviderChat: (state, action: PayloadAction<Place>) => {
            const provider = makeProvider(action.payload)

            state.isChatOpen = true
            state.activeChatProvider = provider
            state.providersById[provider.id] = provider

            if (!state.messagesByProviderId[provider.id]) {
                state.messagesByProviderId[provider.id] = [
                    {
                        id: Date.now(),
                        sender: 'provider',
                        text: `Hi, this is ${provider.name}. How can I help you?`,
                    },
                ]
            }
        },

        openExistingChatByProviderId: (state, action: PayloadAction<number>) => {
            const providerId = action.payload
            const provider = state.providersById[providerId]

            if (!provider) return

            state.activeChatProvider = provider
            state.isChatOpen = true
        },

        closeChat: (state) => {
            state.isChatOpen = false
        },

        sendMessageToProvider: (
            state,
            action: PayloadAction<{ providerId: number; text: string }>
        ) => {
            const { providerId, text } = action.payload

            if (!state.messagesByProviderId[providerId]) {
                state.messagesByProviderId[providerId] = []
            }

            state.messagesByProviderId[providerId].push({
                id: Date.now(),
                sender: 'user',
                text,
            })
        },

        receiveMessageFromProvider: (
            state,
            action: PayloadAction<{ providerId: number; text: string }>
        ) => {
            const { providerId, text } = action.payload

            if (!state.messagesByProviderId[providerId]) {
                state.messagesByProviderId[providerId] = []
            }

            state.messagesByProviderId[providerId].push({
                id: Date.now(),
                sender: 'provider',
                text,
            })
        },
    },
})

export const {
    openProviderChat,
    openExistingChatByProviderId,
    closeChat,
    sendMessageToProvider,
    receiveMessageFromProvider,
} = uiSlice.actions

export default uiSlice.reducer