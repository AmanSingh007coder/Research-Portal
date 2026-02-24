function GuidanceTable({ guidance }) {
  if (!guidance) return null

  const rows = [
    { label: 'Revenue Outlook', value: guidance.revenue },
    { label: 'Margin Outlook', value: guidance.margin },
    { label: 'Capex Outlook', value: guidance.capex },
    { label: 'Other Guidance', value: guidance.otherGuidance },
  ]

  const hasAnyData = rows.some(r => r.value)
  if (!hasAnyData) return null

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="border-t-4 border-amber-500 px-8 py-4 border-b border-stone-100">
        <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.1em' }}
          className="text-xs font-semibold uppercase tracking-widest text-stone-700">
          Forward Guidance
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }}
                className="text-left text-stone-400 text-xs font-semibold uppercase tracking-widest px-8 py-3 w-44">
                Metric
              </th>
              <th style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: '0.08em' }}
                className="text-left text-stone-400 text-xs font-semibold uppercase tracking-widest px-8 py-3">
                Management Commentary
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors duration-100">
                <td style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
                  className="px-8 py-4 text-stone-500 text-xs font-semibold uppercase tracking-wide">
                  {row.label}
                </td>
                <td style={{ fontFamily: "'Georgia', serif" }} className="px-8 py-4 text-stone-700 text-sm leading-relaxed">
                  {row.value || (
                    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="text-stone-300 italic text-xs">Not mentioned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GuidanceTable