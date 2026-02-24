import { useState } from 'react'
import axios from 'axios'
import FileUpload from './components/FileUpload'
import ResultCards from './components/ResultCards'
import GuidanceTable from './components/GuidanceTable'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      const response = await axios.post('https://research-portal-backend-lsqa.onrender.com/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'research-output.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }} className="min-h-screen bg-stone-50">

      {/* Top Bar */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-0 flex items-stretch justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-4 py-4">
            <div className="w-px h-8 bg-stone-800"></div>
            <div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }} className="text-stone-900 text-lg font-bold">RESEARCH</span>
                <span style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.15em' }} className="text-stone-400 text-xs font-normal uppercase tracking-widest">Portal</span>
              </div>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }} className="text-stone-400 text-xs uppercase tracking-widest mt-0.5">Earnings Intelligence Platform</p>
            </div>
          </div>

          
          {result && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.05em' }}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-700 text-white text-xs uppercase tracking-widest rounded transition-all duration-200"
              >
                Export JSON
              </button>
              <button
                onClick={handleReset}
                style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.05em' }}
                className="px-5 py-2 border border-stone-300 hover:border-stone-500 text-stone-600 hover:text-stone-900 text-xs uppercase tracking-widest rounded transition-all duration-200"
              >
                New Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="h-0.5 bg-gradient-to-r from-stone-800 via-amber-600 to-stone-300"></div>

      <div className="max-w-7xl mx-auto px-8 py-12">

        
        {!result && (
          <div className="max-w-2xl mx-auto">

            
            <div className="mb-10">
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.12em' }} className="text-xs uppercase text-amber-700 font-semibold tracking-widest mb-2">Document Analysis</p>
              <h2 style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }} className="text-3xl font-bold text-stone-900 leading-tight">Upload Earnings Transcript</h2>
              <div className="mt-3 h-px bg-stone-200"></div>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-500 text-sm mt-3 leading-relaxed">
                Upload a PDF earnings call transcript or management commentary. The platform will extract tone assessment, key financials, forward guidance, and strategic highlights.
              </p>
            </div>

            <FileUpload file={file} setFile={setFile} />

            {file && (
              <div className="mt-4 px-4 py-3 bg-white border border-stone-200 rounded flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 border border-red-200 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-sm font-medium text-stone-800">{file.name}</p>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-xs text-stone-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-stone-300 hover:text-red-400 transition-colors ml-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {error && (
              <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }}
              className={`mt-6 w-full py-3.5 rounded text-sm uppercase font-semibold tracking-widest transition-all duration-200
                ${!file || loading
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed border border-stone-200'
                  : 'bg-stone-900 hover:bg-stone-700 text-white cursor-pointer shadow-md hover:shadow-lg'
                }`}
            >
              {loading ? 'Processing Document...' : 'Run Analysis'}
            </button>

            {loading && (
              <div className="mt-8 text-center">
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-2 border-stone-200 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-t-stone-800 rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-600 text-sm">Extracting insights from document</p>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-400 text-xs mt-1">This may take 15–30 seconds</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        
        {result && (
          <div className="space-y-6">

            
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
              <div className="border-l-4 border-amber-600 px-8 py-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.1em' }} className="text-xs uppercase text-stone-400 font-semibold tracking-widest mb-1">Company</p>
                    <h2 style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }} className="text-3xl font-bold text-stone-900">
                      {result.companyName || 'Unknown Company'}
                    </h2>
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-500 text-sm mt-1">
                      {result.reportPeriod || 'Period Not Specified'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ToneBadge tone={result.managementTone?.overall} />
                    <ConfidenceBadge confidence={result.managementTone?.confidenceLevel} />
                  </div>
                </div>
                {result.managementTone?.reasoning && (
                  <div className="mt-5 pt-5 border-t border-stone-100">
                    <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }} className="text-xs uppercase text-stone-400 font-semibold tracking-widest mb-2">Tone Assessment</p>
                    <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-600 text-sm leading-relaxed italic">
                      {result.managementTone.reasoning}
                    </p>
                  </div>
                )}
              </div>
            </div>

            
            <SectionLabel label="Key Findings" />

            
            <ResultCards positives={result.keyPositives} concerns={result.keyConcerns} />

            
            <SectionLabel label="Forward Guidance" />
            <GuidanceTable guidance={result.forwardGuidance} />

            
            {result.capacityUtilization && (
              <>
                <SectionLabel label="Capacity Utilization" />
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm px-8 py-6">
                  <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-700 text-sm leading-relaxed">
                    {result.capacityUtilization}
                  </p>
                </div>
              </>
            )}

            
            {result.growthInitiatives?.length > 0 && (
              <>
                <SectionLabel label="Growth Initiatives" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.growthInitiatives.map((item, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-lg shadow-sm p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200">
                      <div className="w-6 h-0.5 bg-amber-500 mb-3"></div>
                      <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-900 font-semibold text-sm mb-2">{item.initiative}</p>
                      <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-500 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            
            {result.notableQuotes?.length > 0 && (
              <>
                <SectionLabel label="Management Commentary" />
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm px-8 py-6 space-y-5">
                  {result.notableQuotes.map((quote, i) => (
                    <div key={i} className="flex gap-5 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <span style={{ fontFamily: "'Georgia', serif" }} className="text-4xl text-stone-200 leading-none">"</span>
                      </div>
                      <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-600 text-sm leading-relaxed italic pt-2">
                        {quote}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

           
            <div className="h-8"></div>

          </div>
        )}
      </div>
    </div>
  )
}


function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-4 mt-2">
      <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.12em' }} className="text-xs uppercase text-stone-400 font-semibold tracking-widest whitespace-nowrap">{label}</p>
      <div className="flex-1 h-px bg-stone-200"></div>
    </div>
  )
}


function ToneBadge({ tone }) {
  const config = {
    optimistic: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    cautious:   { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200',   dot: 'bg-amber-500' },
    neutral:    { bg: 'bg-stone-100',  text: 'text-stone-700',   border: 'border-stone-300',   dot: 'bg-stone-400' },
    pessimistic:{ bg: 'bg-red-50',     text: 'text-red-800',     border: 'border-red-200',     dot: 'bg-red-500' },
  }
  const key = tone?.toLowerCase() || 'neutral'
  const c = config[key] || config.neutral
  return (
    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold uppercase tracking-widest ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {tone || 'Neutral'}
    </span>
  )
}


function ConfidenceBadge({ confidence }) {
  const config = {
    high:   { bg: 'bg-stone-900', text: 'text-white',      border: 'border-stone-900' },
    medium: { bg: 'bg-stone-100', text: 'text-stone-700',  border: 'border-stone-300' },
    low:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  }
  const key = confidence?.toLowerCase() || 'medium'
  const c = config[key] || config.medium
  return (
    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }}
      className={`inline-flex items-center px-3 py-1.5 rounded border text-xs font-semibold uppercase tracking-widest ${c.bg} ${c.text} ${c.border}`}>
      Confidence: {confidence || 'Medium'}
    </span>
  )
}

export default App