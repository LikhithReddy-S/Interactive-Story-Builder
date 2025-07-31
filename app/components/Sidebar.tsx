import { Card } from "@/components/ui/card"
import DraggableItem from "./DraggableItem"

const emojiCategories = {
  Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  People: ["👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👵", "🧓", "👴", "👸", "🤴", "👮", "👷", "💂"],
  Objects: ["🏠", "🏫", "🏥", "🏪", "🏬", "🏭", "🏯", "🏰", "🗼", "🎪", "🎨", "🎭", "🎪", "🎡", "🎢"],
  Nature: ["🌳", "🌲", "🌴", "🌵", "🌷", "🌸", "🌺", "🌻", "🌞", "🌙", "⭐", "☁️", "🌈", "🔥", "💧"],
  Food: ["🍎", "🍌", "🍊", "🍓", "🍇", "🍉", "🍑", "🥕", "🌽", "🍞", "🧀", "🍕", "🍔", "🍟", "🍰"],
}

export default function Sidebar() {
  return (
    <div className="w-80 bg-white shadow-xl border-r-4 border-purple-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Story Elements</h2>

        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <Card
            key={category}
            className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
          >
            <h3 className="text-lg font-semibold text-purple-700 mb-3 text-center">{category}</h3>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <DraggableItem
                  key={`${category}-${index}`}
                  id={`${category}-${emoji}-${index}`}
                  content={emoji}
                  type="emoji"
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
