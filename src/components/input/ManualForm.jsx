'use client'

import { useState } from 'react'
import { skillCategories } from '@/data/skills'

export default function ManualForm({ onProfileReady }) {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    year: '3rd',
    skills: [],
    projects: 0,
    internship: false
  })

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert cgpa to number
    const profile = {
      ...formData,
      cgpa: parseFloat(formData.cgpa) || 0,
      projects: parseInt(formData.projects) || 0
    }
    onProfileReady(profile)
  }

  const colorMap = {
    purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
    teal: { border: 'border-teal-500', bg: 'bg-teal-500/10', dot: 'bg-teal-500' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
    green: { border: 'border-green-500', bg: 'bg-green-500/10', dot: 'bg-green-500' },
    coral: { border: 'border-orange-500', bg: 'bg-orange-500/10', dot: 'bg-orange-500' } // mapping coral to orange
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-medium">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">Current CGPA</label>
            <input
              type="number"
              required
              step="0.1"
              min="0"
              max="10"
              placeholder="0.0 - 10.0"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">Year of Study</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition-all appearance-none"
            >
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">Number of Projects</label>
            <input
              type="number"
              min="0"
              value={formData.projects}
              onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, internship: !formData.internship })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                formData.internship ? 'bg-[#006633]' : 'bg-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                formData.internship ? 'left-7' : 'left-1'
              }`} />
            </button>
            <span className="text-sm text-gray-300">Have you completed an internship?</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Skills Checklist</h3>
          <span className="text-xs text-purple-400 font-mono">
            {formData.skills.length} skills selected
          </span>
        </div>

        <div className="space-y-8">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${colorMap[cat.color]?.dot || 'bg-gray-500'}`}></span>
                {cat.category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {cat.skills.map((skill) => {
                  const isSelected = formData.skills.includes(skill)
                  const colors = colorMap[cat.color] || colorMap.purple
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`text-xs px-3 py-2 rounded-lg border transition-all text-left min-h-[44px] ${
                        isSelected
                          ? `${colors.border} ${colors.bg} text-white font-medium`
                          : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#006633] hover:bg-green-700 text-white font-medium py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
      >
        Analyze my profile →
      </button>
    </form>
  )
}
