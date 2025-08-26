# VitalEyes - Real-Time Health Monitoring Dashboard

<div align="center">

**Live Website:** **[vitalyse-website-frontend-rss4.vercel.app](https://vitalyse-website-frontend-rss4.vercel.app/)**

**Backend API Repository:** **[github.com/sp4m-08/vitalyse-website-backend](https://github.com/sp4m-08/vitalyse-website-backend)**

</div>

---

## 📋 Overview

**VitalEyes** is a full-stack web application designed for real-time health monitoring. It features a responsive and dynamic frontend dashboard that displays live sensor data, including heart rate, SpO2, body temperature, and more. The application also includes an AI-powered chat assistant, powered by the Gemini API, which can interpret health data and answer user questions.

The backend is a robust Node.js and Express server that ingests, processes, and serves data from a Supabase PostgreSQL database, providing a seamless connection between IoT devices and the user interface.

---

## ✨ Features

- **Real-Time Data Visualization**: Live updates for vital signs like Heart Rate, SpO2, and Body Temperature.
- **Dynamic ECG Chart**: Renders a live ECG signal for detailed cardiac monitoring.
- **Facial Emotion Analysis**: Displays the latest detected emotion and stress level.
- **AI Health Assistant**: An integrated chat powered by the Gemini API to provide insights into the displayed health data.
- **Responsive Design**: A clean, modern UI that works seamlessly on both desktop and mobile devices.
- **Scroll Animations**: Subtle scroll-reveal animations for an engaging user experience.
- **Scalable Backend**: Built with Node.js, Express, and Supabase for reliable and scalable data handling.

---

## 🛠️ Tech Stack

This project is built with a modern, full-stack technology set.

### **Frontend**

- **Framework**: React (with TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animations**: React Awesome Reveal
- **Charts**: Recharts
- **Deployment**: Vercel

### **Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Render

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

- Node.js (v18 or later)
- npm or yarn
- A Supabase account
- A Google AI Studio account for the Gemini API key

### **Backend Setup**

1.  **Clone the backend repository:**

    ```sh
    git clone [https://github.com/sp4m-08/vitalyse-website-backend.git](https://github.com/sp4m-08/vitalyse-website-backend.git)
    cd vitalyse-website-backend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root and add your Supabase and Gemini credentials.

    ```env
    DATABASE_URL="your_supabase_connection_string"
    GEMINI_API_KEY="your_gemini_api_key"
    PORT=3001
    ```

4.  **Run the server:**
    ```sh
    npm run dev
    ```

### **Frontend Setup**

1.  **Clone the frontend repository:**

    ```sh
    git clone [https://github.com/your-username/vitalyse-website-frontend.git](https://github.com/your-username/vitalyse-website-frontend.git)
    cd vitalyse-website-frontend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the development server:**
    The frontend is configured to connect to the deployed backend on Render. No `.env` file is needed for the frontend.
    ```sh
    npm run dev
    ```
    Open [http://localhost:5174](http://localhost:5174) to view it in your browser.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
