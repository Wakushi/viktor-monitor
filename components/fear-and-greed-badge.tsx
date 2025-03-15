import React from "react"

function FearGreedBadge({ fearAndGreedIndex }: { fearAndGreedIndex: number }) {
  const index = Math.max(0, Math.min(100, fearAndGreedIndex))

  let bgColor, textColor, name

  if (index < 20) {
    bgColor = "bg-red-600"
    textColor = "text-white"
    name = "Extreme fear"
  } else if (index < 40) {
    bgColor = "bg-orange-500"
    textColor = "text-white"
    name = "Fear"
  } else if (index < 60) {
    bgColor = "bg-yellow-400"
    textColor = "text-black"
    name = "Neutral"
  } else if (index < 80) {
    bgColor = "bg-lime-500"
    textColor = "text-white"
    name = "Greed"
  } else {
    bgColor = "bg-green-600"
    textColor = "text-white"
    name = "Extreme greed"
  }

  return (
    <div className="inline-flex items-center">
      <span
        className={`inline-flex items-center justify-center px-2 py-1 text-sm font-semibold rounded-lg ${bgColor} ${textColor}`}
        title={name}
      >
        {index}
      </span>
    </div>
  )
}

export default FearGreedBadge
