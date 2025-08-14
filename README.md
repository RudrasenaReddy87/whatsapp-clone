# WhatsApp Web Clone
<p align="left">

  
  <a href="https://whatsapp-clone-1-7uzd.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Live_App-WhatsApp_Clone-brightgreen?style=flat-square&logo=vercel&logoColor=white" alt="WhatsApp Clone" />
  </a>

  <!-- GitHub Repository -->
  <a href="https://github.com/RudrasenaReddy87/Weather-forecasting-app" target="_blank">
    <img src="https://img.shields.io/badge/Repository-Weather_App-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>

  <!-- GitHub Profile -->
  <a href="https://github.com/RudrasenaReddy87" target="_blank">
    <img src="https://img.shields.io/badge/Profile-RudrasenaReddy87-333?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>

   <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square&logo=open-source-initiative&logoColor=white" alt="License" />
  </a>

  <!-- LinkedIn -->
  <a href="https://www.linkedin.com/in/bodireddyrudrasenareddy" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>

  <!-- Email -->
  <a href="mailto:b.rudrasenareddy@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Email-b.rudrasenareddy@gmail.com-d14836?style=flat-square&logo=gmail&logoColor=white" alt="Email" />
  </a>
A full-stack WhatsApp Web clone built with React and Node.js.
<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/429019f8-52fb-435f-81b3-39e852d0404e" />


## Project Structure

```
whatsapp-web-clone/
├── frontend/          # React application
├── backend/           # Node.js/Express server
├── build.sh          # Build script for deployment
└── README.md
```

## Deployment on Render

### Prerequisites
1. MongoDB Atlas account with a cluster set up
2. GitHub repository with your code
3. Render account

### Step-by-Step Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service**
   - **Name**: `whatsapp-clone` (or your preferred name)
   - **Root Directory**: Leave blank
   - **Environment**: `Node`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `node backend/src/server.js`

4. **Add Environment Variables**
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: `10000`

5. **Configure MongoDB Atlas**
   - Go to Network Access in MongoDB Atlas
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
```

## Local Development

1. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

2. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Features

- Real-time chat interface
- Message sending and receiving
- WhatsApp-like UI design
- Mobile responsive
- MongoDB data persistence
- Message status indicators

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB Atlas
- **Deployment**: Render
