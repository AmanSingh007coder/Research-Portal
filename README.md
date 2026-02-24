# Research Portal — Earnings Intelligence Platform

> An AI-powered web platform that instantly analyzes earnings call transcripts and delivers structured, analyst-grade financial intelligence — tone assessment, key risks, forward guidance, and strategic highlights — in seconds.

---

## What This Does

Upload any earnings call transcript PDF. The platform reads it, sends it to an AI model, and returns a fully structured research brief — the kind of output a junior analyst would spend hours producing manually.

**What gets extracted automatically:**
- Management tone (optimistic / cautious / neutral / pessimistic) with confidence level and reasoning
- Key positives and key concerns, each with a headline and supporting detail
- Forward guidance across revenue, margins, capex, and other metrics
- Capacity utilization trends
- Growth initiatives mentioned by management
- Notable verbatim quotes from the transcript

Tested successfully on real Infosys Investor Day transcripts and ACME Corp sample documents.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| AI Model | Google Gemini 2.5 Flash (free tier) |
| PDF Parsing | pdf2json |
| HTTP Client | Axios |
| File Upload | Multer (in-memory, no disk storage) |

---

## Project Structure

```
research-portal/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx  # Drag-and-drop PDF upload
│   │   │   ├── ResultCards.jsx # Key positives & concerns display
│   │   │   └── GuidanceTable.jsx # Forward guidance table
│   │   ├── App.jsx             # Main app, state management, API calls
│   │   └── index.css           # Tailwind base styles
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── routes/
│   │   └── analyze.js          # PDF upload → text extraction → Gemini → JSON
│   ├── utils/
│   │   └── prompt.js           # Structured extraction prompt for Gemini
│   ├── index.js                # Express server setup
│   ├── .env                    # API key (not committed to git)
│   └── package.json
│
└── README.md
```

---

## How It Works — End to End

```
User uploads PDF
      ↓
Frontend (React) sends PDF as multipart/form-data to POST /api/analyze
      ↓
Backend (Express + Multer) receives file as in-memory buffer — never written to disk
      ↓
pdf2json parses the PDF buffer and extracts raw text
      ↓
Extracted text is injected into a structured analyst prompt
      ↓
Prompt is sent to Google Gemini 1.5 Flash via the Gemini API
      ↓
Gemini returns a JSON object following a strict schema
      ↓
Backend validates and parses the JSON, strips any markdown formatting
      ↓
JSON is returned to the frontend
      ↓
React renders the result across structured UI components
      ↓
User can Export JSON for downstream use
```

---

## Local Setup

### Prerequisites

- Node.js v18+
- A free Gemini API key from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/research-portal.git
cd research-portal
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` folder:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

### 5. Run both servers

In one terminal:
```bash
cd server
node index.js
```

In another terminal:
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Reference

### `POST /api/analyze`

Accepts a PDF file and returns structured financial analysis.

**Request:** `multipart/form-data` with field `pdf`

**Response:**
```json
{
  "success": true,
  "data": {
    "companyName": "Infosys Limited",
    "reportPeriod": "Investor Day 2025",
    "managementTone": {
      "overall": "optimistic",
      "confidenceLevel": "high",
      "reasoning": "Management repeatedly emphasized the scale of the AI opportunity..."
    },
    "keyPositives": [
      { "point": "Mission AI Opportunity", "detail": "..." }
    ],
    "keyConcerns": [
      { "point": "AI Deployment Gap", "detail": "..." }
    ],
    "forwardGuidance": {
      "revenue": "...",
      "margin": "...",
      "capex": "...",
      "otherGuidance": null
    },
    "capacityUtilization": "...",
    "growthInitiatives": [
      { "initiative": "Topaz Platform", "description": "..." }
    ],
    "notableQuotes": ["...", "..."]
  }
}
```

---

## Key Design Decisions

**No database.** Documents are processed entirely in memory and discarded after analysis. No transcript data is ever stored on disk or in a database. This keeps the system stateless, fast, and privacy-respecting.

**Hallucination prevention.** The Gemini prompt explicitly instructs the model to return `null` for any field not present in the document — never guess, never fabricate. Missing fields render as "Not mentioned" in the UI rather than showing inaccurate data.

**In-memory PDF parsing.** Multer is configured with `memoryStorage()` so uploaded files exist only as a buffer in RAM during the request lifecycle. Nothing touches the filesystem.

**Structured JSON schema.** The prompt enforces a rigid JSON schema, making the AI output directly mappable to UI components without any post-processing logic beyond JSON parsing.

**Professional prompt engineering.** The AI is instructed to behave as a senior analyst at an institutional investment firm — no emoji, no casual language, no markdown — producing output suitable for an actual research report.

---

## Limitations

- Works best with text-based PDFs. Scanned or image-based PDFs (where text is embedded as images) will fail to extract correctly.
- File size is capped at 10 MB.
- Processing time is typically 15–30 seconds depending on document length and Gemini API latency.
- Gemini free tier has rate limits. For high-volume use, consider upgrading to a paid tier.
- The quality of extraction depends on the structure and clarity of the source transcript. Poorly formatted documents may yield incomplete results.

---

## Future Improvements

- Support for scanned PDFs using OCR (e.g. Tesseract)
- Comparison mode to diff two quarters side by side
- Historical analysis storage with a database
- Export to PDF report format
- Support for Excel and Word document uploads
- User authentication and saved analysis history

---

## Built With

This project was built as part of an internship assignment to demonstrate full-stack development, AI API integration, and product thinking around a real financial research use case.