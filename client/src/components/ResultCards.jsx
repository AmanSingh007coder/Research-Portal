function ResultCards({ positives, concerns }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="border-t-4 border-emerald-500 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.1em' }}
            className="text-xs font-semibold uppercase tracking-widest text-stone-700">
            Key Positives
          </h3>
          {positives?.length > 0 && (
            <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
              className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {positives.length}
            </span>
          )}
        </div>
        <div className="px-6 py-4 space-y-3">
          {positives?.length > 0 ? (
            positives.map((item, i) => (
              <div key={i} className="group border-l-2 border-stone-200 hover:border-emerald-400 pl-4 py-1 transition-all duration-150">
                <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-900 font-semibold text-sm mb-0.5">{item.point}</p>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-500 text-xs leading-relaxed">{item.detail}</p>
              </div>
            ))
          ) : (
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-400 text-sm italic">No positives identified in this document.</p>
          )}
        </div>
      </div>

      
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="border-t-4 border-red-400 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.1em' }}
            className="text-xs font-semibold uppercase tracking-widest text-stone-700">
            Key Concerns
          </h3>
          {concerns?.length > 0 && (
            <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
              className="ml-auto text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              {concerns.length}
            </span>
          )}
        </div>
        <div className="px-6 py-4 space-y-3">
          {concerns?.length > 0 ? (
            concerns.map((item, i) => (
              <div key={i} className="group border-l-2 border-stone-200 hover:border-red-400 pl-4 py-1 transition-all duration-150">
                <p style={{ fontFamily: "'Georgia', serif" }} className="text-stone-900 font-semibold text-sm mb-0.5">{item.point}</p>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-500 text-xs leading-relaxed">{item.detail}</p>
              </div>
            ))
          ) : (
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-400 text-sm italic">No concerns identified in this document.</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default ResultCards