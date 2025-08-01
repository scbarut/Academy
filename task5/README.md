# DataForge - Synthetic Data Generator

A modern web application for generating synthetic datasets using AI. Built with React, TypeScript, and FastAPI.


## Features

- 🎨 **Modern UI Design** - Beautiful gradient interface with animations
- 🤖 **AI-Powered Generation** - Uses Google Gemini AI for intelligent data creation
- 📊 **Interactive Preview** - View first 5 rows of generated data in a table
- 📥 **CSV Download** - Download complete dataset as CSV file
- 🎯 **Customizable Size** - Generate 10, 20, 30, 40 or 50 rows of data
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Feedback** - Loading states and error handling

## Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Styling framework
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Python web framework
- **LangChain** - AI framework
- **Google Gemini AI** - Language model
- **Pandas** - Data manipulation
- **Python-dotenv** - Environment variables

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Python** (version 3.8 or higher)
- **pip** (Python package manager)
- **Google AI API Key** (for Gemini AI)

## Installation & Setup

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Verify installation
npm list
```

### 2. Backend Setup

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn langchain langchain-google-genai pandas python-dotenv

# Or install from requirements file if available
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_ai_api_key_here
```

**To get your Google AI API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in your `.env` file

## Running the Application

### Run Both Servers Separately (Recommended)

**Terminal 1 - Backend Server:**
```bash
# Navigate to project root
cd /path/to/your/project

# Activate virtual environment (if using)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start FastAPI server
uvicorn api.main:app --reload
```

**Terminal 2 - Frontend Server:**
```bash
# Navigate to project root (new terminal)
cd /path/to/your/project

# Start React development server
npm run dev
```

## Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Usage

1. **Open the application** in your browser at `http://localhost:5173`
2. **Enter a description** of the dataset you want to generate (e.g., "Employee data with names, ages, and salaries")
3. **Select the number of rows** (10, 20, or 30)
4. **Click "Generate"** to create your synthetic dataset
5. **Preview the data** in the table that appears
6. **Download the CSV** file using the download button

## API Endpoints

### POST `/`
Generate synthetic data based on description and row count.

**Request Body:**
```json
{
  "text": "Description of the dataset",
  "row": 10
}
```

**Response:**
```json
{
  "jsonData": [...],  // Array of generated data objects
  "csvData": "..."    // CSV formatted string
}
```
## Docker Deployment

### Using Docker Compose 

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

## Project Structure

```
dataforge-synthetic-data-generator/
├── api/
│   └── main.py              # FastAPI backend server
├── src/
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles and animations
│   └── vite-env.d.ts       # Vite type definitions
├── public/
│   └── vite.svg            # Vite logo
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
├── requirements.txt        # Frontend requirements documentation
└── README.md              # This file
```
