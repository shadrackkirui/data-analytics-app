# Enumeration Platform

A full-stack web application organized into a client-server architecture.

## Project Structure

*   **client/**: The frontend application (likely React based on dependencies).
*   **server/**: The backend API (Node.js/Express).

## Getting Started

### Prerequisites

*   Node.js
*   MongoDB

### Installation

1.  **Server Setup**

    Navigate to the server directory and install dependencies:

    ```bash
    cd server
    npm install
    ```

    Ensure you have a `.env` file in the `server/` directory with the following keys:
    *   `MONGO_URI`
    *   `JWT_SECRET`
    *   `PORT`

2.  **Client Setup**

    Navigate to the client directory and install dependencies:

    ```bash
    cd client
    npm install
    ```

### Running the Application

*   **Server**: Run `npm start` or `npm run dev` (if using nodemon) inside the `server` folder.
*   **Client**: Run `npm start` inside the `client` folder.

## Tech Stack

*   MongoDB, Express, React, Node.js (MERN Stack)
