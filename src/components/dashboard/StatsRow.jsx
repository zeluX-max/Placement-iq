/**
 * StatsRow component for displaying counts of ready, stretch, and future companies.
 * @param {number} ready - Number of companies user is ready for.
 * @param {number} stretch - Number of companies requiring some skill bridge.
 * @param {number} future - Number of companies in the future target list.
 */
export default function StatsRow({ ready = 0, stretch = 0, future = 0 }) {
  const stats = [
    { label: 'Ready', value: ready, color: 'text-green-400' },
    { label: 'Stretch', value: stretch, color: 'text-amber-400' },
    { label: 'Future', value: future, color: 'text-red-400' }
  ]

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-3 md:p-5 text-center shadow-sm">
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 uppercase font-medium tracking-tighter md:tracking-normal">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
