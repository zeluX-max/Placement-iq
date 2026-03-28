/**
 * SkillBadge component for highlighting a single skill
 * @param {string} skill - The name of the skill
 * @param {'have' | 'missing'} type - Whether the user has the skill or is missing it
 */
export default function SkillBadge({ skill, type = 'have' }) {
  const isHave = type === 'have'
  
  return (
    <span 
      className={`
        inline-block px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border
        ${isHave 
          ? 'bg-green-950/50 text-green-400 border-green-800' 
          : 'bg-red-950/50 text-red-400 border-red-900'}
      `}
    >
      {skill}
    </span>
  )
}
