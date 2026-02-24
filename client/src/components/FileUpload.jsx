import { useRef, useState } from 'react'

function FileUpload({ file, setFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped)
    }
  }

  const handleChange = (e) => {
    const selected = e.target.files[0]
    if (selected) setFile(selected)
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-14 text-center cursor-pointer transition-all duration-200
        ${dragging
          ? 'border-amber-500 bg-amber-50'
          : 'border-stone-300 hover:border-stone-500 bg-white hover:bg-stone-50'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />

      
      <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-200
        ${dragging ? 'bg-amber-100' : 'bg-stone-100'}`}>
        <svg className={`w-6 h-6 transition-colors ${dragging ? 'text-amber-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-800 font-semibold text-base mb-1">
        {dragging ? 'Release to upload' : 'Drop your PDF here'}
      </p>
      <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-400 text-sm">
        or <span className="text-amber-700 underline underline-offset-2">browse files</span>
      </p>
      <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.06em' }} className="text-stone-300 text-xs uppercase tracking-widest mt-4">
        PDF only &nbsp;·&nbsp; Max 10 MB
      </p>
    </div>
  )
}

export default FileUpload