const express = require('express')
const router = express.Router()
const multer = require('multer')
const PDFParser = require('pdf2json')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const buildPrompt = require('../utils/prompt')


const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  }
})


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const extractTextFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err.parserError)
    })

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const pages = pdfData.Pages || []
        let fullText = ''

        pages.forEach((page) => {
          const texts = page.Texts || []
          texts.forEach((textItem) => {
            textItem.R?.forEach((r) => {
              try {
                fullText += decodeURIComponent(r.T) + ' '
              } catch (e) {
                fullText += r.T + ' '
              }
            })
          })
          fullText += '\n'
        })

        resolve(fullText.trim())
      } catch (e) {
        reject(e)
      }
    })

    pdfParser.parseBuffer(buffer)
  })
}

router.post('/analyze', upload.single('pdf'), async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' })
    }

    console.log('PDF received:', req.file.originalname)

    // Extract text
    const extractedText = await extractTextFromBuffer(req.file.buffer)

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        error: 'Could not extract text from PDF. File may be scanned or image-based.'
      })
    }

    console.log('Text extracted, characters:', extractedText.length)

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = buildPrompt(extractedText)

    const result = await model.generateContent(prompt)
    const rawText = result.response.text().trim()

    console.log('Gemini responded successfully')

   
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    let parsedResult
    try {
      parsedResult = JSON.parse(cleaned)
    } catch (parseError) {
      console.error('JSON parse failed:', cleaned)
      return res.status(500).json({
        error: 'AI returned invalid format. Please try again.'
      })
    }

    // Send to frontend
    res.json({ success: true, data: parsedResult })

  } catch (error) {
    console.error('Error in /analyze:', error.message)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
})

module.exports = router