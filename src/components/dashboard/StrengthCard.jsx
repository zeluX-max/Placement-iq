/**
 * StrengthCard component for displaying student's strengths and urgent actions.
 * @param {string} summary - A brief text summarizing strengths.
 * @param {string[]} urgentActions - An array of short action strings.
 */
export default function StrengthCard({ summary = '', urgentActions = [] }) {
  return (
    <div className="bg-green-950/20 border border-green-900/50 rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div>
          <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-widest">
            Your Strengths
          </span>
          <p className="text-sm md:text-base text-green-200 mt-2 leading-relaxed">
            {summary || "Analyzing your profile to find your biggest strengths..."}
          </p>
        </div>

        {/* Actions Section */}
        {urgentActions && urgentActions.length > 0 && (
          <div className="pt-4 border-t border-green-900/30">
            <h4 className="text-xs md:text-sm font-medium text-green-400 mb-3">
              This week's actions
            </h4>
            <ul className="space-y-2.5">
              {urgentActions.map((action, idx) => (
                <li key={idx} className="flex gap-3 text-xs md:text-sm text-green-300/90 leading-snug">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-900/40 text-green-500 font-bold shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
