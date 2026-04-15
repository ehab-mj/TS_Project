# 🚀 Smart Local Services

A modern **full-stack service booking platform** built with React, Firebase, and Redux.
Users can find local service providers, book services, chat in real-time, and manage requests.

---

## 🌟 Features

### 👤 Guest Users

* Browse nearby service providers on an interactive map
* View provider profiles (image, bio, phone, location)
* Book services using Calendar
* Send real-time chat messages to providers
* Track booking status:

  * ⏳ Pending
  * ✅ Accepted
  * ❌ Denied

---

### 🧑‍🔧 Providers

* Create and manage business profile
* Add:

  * Service category
  * Phone number
  * City & location
  * Business image
* Receive booking requests
* Accept or deny requests
* Chat with users in real-time

---

### 💬 Real-Time Chat

* Guest ↔ Provider messaging
* Firebase Firestore based
* Conversation per provider-user pair
* Unread messages tracking

---

### 🗺️ Map Integration

* Built with Leaflet
* Displays providers with:

  * Custom markers
  * Tooltip previews
  * Images on hover

---

## 🧱 Tech Stack

### Frontend

* React + Vite
* TypeScript (strict mode)
* Redux Toolkit
* React Router v6
* CSS Modules / Custom CSS (no Bootstrap)

### Backend (Serverless)

* Firebase Authentication
* Firebase Firestore (Database)
* Firebase Storage (optional for images)

### APIs

* Google Maps (optional)
* OpenStreetMap (Leaflet tiles)

---

## 📁 Project Structure

```bash
src/
│
├── app/                # Redux store & hooks
├── components/         # Shared UI components
├── features/           # Redux slices (auth, bookings, providers, UI)
├── pages/
│   ├── home/
│   ├── chat/
│   ├── provider/
│   ├── auth/
│
├── services/           # Firebase & API services
├── styles/             # Global styles
└── firebase/           # Firebase config
```

---

## 🔥 Core Modules

### 📅 Booking System

* Guests create bookings
* Stored in Redux + Firestore
* Includes:

  ```ts
  providerUid
  status: 'pending' | 'accepted' | 'denied'
  ```

---

### 📩 Requests System (Provider)

* Replaces Calendar for providers
* Shows only:

  ```ts
  booking.providerUid === provider.uid
  ```
* Actions:

  * Accept
  * Deny

---

### 💬 Chat System

* Conversations stored in Firestore:

```bash
Chat/
  └── {conversationId}
        └── messages/
```

* Message structure:

```ts
{
  text: string
  senderRole: 'guest' | 'provider'
  senderUid: string
  createdAt: timestamp
}
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run project

```bash
npm run dev
```

---

### 3. Firebase Setup

Create a Firebase project and enable:

* Authentication (Email/Password)
* Firestore Database

Then create:

```ts
src/firebase/firebase.ts
```

Example:

```ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
```

---

## 🔑 Environment Variables

Create `.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## 📱 Responsive Design

* Mobile-first design
* Bottom navigation for phones
* Sidebar layout for desktop
* Optimized for all screen sizes

---

## 🎯 Future Improvements

* 🔔 Notifications system
* 💳 Payments integration
* 📸 Image upload via Firebase Storage
* ⭐ Reviews & ratings
* 🧠 AI-based provider recommendations

---

## 👨‍💻 Author

Built with ❤️ by Ehab

---
