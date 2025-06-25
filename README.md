# Holiday-Planner

Holiday-Planner is a web application designed to help users plan their holidays efficiently by leveraging AI-generated itineraries and seamless management of destinations, bookings, and schedules. The project is built with a modern tech stack and features dual backends for enhanced functionality.

## 🚀 Tech Stack

- **Frontend:**  
  - HTML  
  - CSS  
  - JavaScript

- **Backends:**  
  - **Python (AI Generation):** Handles AI-based itinerary and suggestion generation.
  - **Node.js / Express (DB & User Auth):** Manages user authentication, database operations, and core API endpoints.

## ✨ Features

- AI-powered holiday and itinerary suggestions.
- User authentication and profile management.
- Destination, booking, and schedule management.
- Modern and responsive web UI.

## 🛠️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Turbash/Holiday-Planner.git
cd Holiday-Planner
```

### 2. Frontend

No build step required if serving static files. If using a bundler, run the relevant build commands.

### 3. Backend Setup

#### Python AI Backend

1. Navigate to the Python backend directory (e.g., `backend-ai/`).
2. Create a `.env` file as needed for environment variable (i.e. API_KEY).
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Start the AI backend server:
    ```bash
    python app.py
    ```

#### Node.js/Express Backend

1. Navigate to the Node backend directory (e.g., `backend-node/`).
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file as needed for environment variables (i.e. database URI, JWT secret, AI_BACKEND_URL, API_KEY).
4. Start the backend server:
    ```bash
    npm start
    ```

### 4. Configuration

- Ensure both backends are running on their respective ports.
- Update the frontend/API endpoints if necessary to match local server addresses.

### 5. Access the App

Open `index.html` or your entry point in a browser. Follow any additional instructions in the backend directories' README files for API usage.

## 👥 Contributors

- [Turbash](https://github.com/Turbash)
- [kartikrastogi18](https://github.com/kartikrastogi18)
- [shikhar-ag87](https://github.com/shikhar-ag87)
- [Rahul](https://github.com/Rahul3106)

## 📄 License

This project is licensed under the MIT License.

---

Happy planning! 🎉
