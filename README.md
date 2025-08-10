# HeartScribe – Frontend

The HeartScribe Frontend is a responsive web application built with Vue 3 and TypeScript. It provides a user interface for managing guestbooks, submitting entries, and viewing content in real time. The application integrates seamlessly with the HeartScribe backend via RESTful APIs and WebSockets.

## Features

- User login and registration interface
- Create and manage guestbooks
- Submit guest entries with optional images
- Responsive design with mobile-friendly layout
- Real-time updates through WebSockets
- Visual feedback for user actions (e.g., shake effect on failed login)
- Custom floating emoji background effect

## Technologies Used

- Vue 3 (Options API)
- TypeScript
- Pinia (state management)
- Vue Router / Stateful Pinia Page switching
- Axios (HTTP client)
- Socket.IO Client
- Vite (development and build tool)

## Project Structure

.src<br/>
├── components/ # Reusable Vue components <br/>
├── views/ # Page views (login, user, admin, etc.) <br/>
├── stores/ # Pinia store modules <br/>
├── services/ # Axios and helper services <br/>
├── assets/ # Static assets and images (optional) <br/>
├── App.vue # Root component <br/>
├── main.ts # App entry point <br/>
├── router.ts # Vue Router setup <br/>

- **Registered Users**

  - Can create and manage multiple guestbooks.
  - Can share automatically generated guestbook links with friends.

- **Visitors**
  - Can post text messages (optionally with images) to a guestbook.
  - Are guided through a sequence of onboarding steps:
    1. Guest Welcome Page
    2. Name Entry Page
    3. Post Message Page
    4. Gallery Page

---

You may also watch a brief video demonstration: [https://youtu.be/VJ9aTijd5Rg](https://youtu.be/VJ9aTijd5Rg)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Superbogger/heartscribe-frontend.git
cd heartscribe-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create and adjust a ".env"-file

```bash
VITE_BACKEND_URL=http://localhost:3001
```

### 4. Install Dependencies

```bash
npm run dev
or
npm start
```
