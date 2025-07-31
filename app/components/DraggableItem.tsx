import { useDrag } from "react-dnd"

interface DraggableItemProps {
  id: string
  content: string
  type: "emoji" | "text"
}

export default function DraggableItem({ id, content, type }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "story-item",
    item: { id, content, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`
        w-12 h-12 flex items-center justify-center text-2xl cursor-grab
        bg-white rounded-lg shadow-md border-2 border-purple-200
        hover:shadow-lg hover:scale-110 transition-all duration-200
        ${isDragging ? "opacity-50 rotate-12" : "hover:border-purple-400"}
      `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {content}
    </div>
  )
}
