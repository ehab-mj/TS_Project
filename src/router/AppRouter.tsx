import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from '../Pages/HomeScreen'
import CalendarPage from '../Pages/CalendarPage'
import FavoritesPage from '../Pages/FavoritesPage'
import ProfilePage from '../Pages/ProfilePage'

import AppLayout from '../Layouts/AppLayout'
import ChatsPage from '../Pages/ChatPage'
import RegisterPage from '../Pages/Auth/RegisterPage'
import LoginPage from '../Pages/Auth/LoginPage'
import GuestDashboardPage from '../Pages/Dashboards/GuestDashboardPage'
import ProviderDashboardPage from '../Pages/Dashboards/ProviderDashboardPage'
import ProviderSetupPage from '../Pages/Dashboards/ProviderSetupPage'
import ProtectedRoute from './ProtectedRoute'
import ProviderProfilePage from '../Pages/ProviderProfilePage'
// import TestChatPage from '../Pages/chat/TestChatPage'


const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'calendar',
                element: <CalendarPage />,
            },
            {
                path: 'favorites',
                element:
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'chats',
                element: <ChatsPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'guest-dashboard',
                element: <GuestDashboardPage />,
            },
            {
                path: 'provider-dashboard',
                element: <ProviderDashboardPage />,
            },
            {
                path: '/provider-setup',
                element: <ProviderSetupPage />,
            },
            {
                path: '/provider/:id',
                element: <ProviderProfilePage />,
            },
            // {
            //     path: '/test-chat',
            //     element: <TestChatPage />,
            // },
        ],
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}