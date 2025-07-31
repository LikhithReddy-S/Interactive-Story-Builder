"use client"

import type React from "react"
import { useCallback, useRef } from "react"
import { useDrop } from "react-dnd"
import type { CanvasItem } from "../page"
import CanvasItemComponent from "./CanvasItemComponent"

interface CanvasProps {
  items: CanvasItem[]
  onAddItem: (item: CanvasItem) => void
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void
  onRemoveItem: (id: string) => void
}

export default function Canvas({ items, onAddItem, onUpdateItem, onRemoveItem }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop(() => ({
    accept: "story-item",
    drop: (item: { id: string; content: string; type: "emoji" | "text" }, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = canvasRef.current?.getBoundingClientRect()

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top

        const newItem: CanvasItem = {
          id: `${item.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          type: item.type,
          content: item.content,
          x: Math.max(0, Math.min(x - 25, canvasRect.width - 50)),
          y: Math.max(0, Math.min(y - 25, canvasRect.height - 50)),
          fontSize: item.type === "text" ? 16 : undefined,
        }

        console.log("Adding new item:", newItem) // Debug log
        onAddItem(newItem)
      }
    },
  }))

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only add text if clicking directly on the canvas background
      if (e.target === e.currentTarget) {
        e.preventDefault()
        e.stopPropagation()

        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const newTextItem: CanvasItem = {
            id: `text-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            type: "text",
            content: "Click to edit",
            x: Math.max(0, Math.min(x - 50, rect.width - 100)),
            y: Math.max(0, Math.min(y - 10, rect.height - 30)),
            fontSize: 16,
          }

          console.log("Adding text item:", newTextItem) // Debug log
          onAddItem(newTextItem)
        }
      }
    },
    [onAddItem],
  )

  return (
    <div className="flex-1 p-4">
      <div className="h-full bg-white rounded-2xl shadow-xl border-4 border-dashed border-purple-300 relative overflow-hidden canvas-area">
        <div
          ref={(node) => {
            drop(node)
            canvasRef.current = node
          }}
          className="w-full h-full relative cursor-crosshair bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          onClick={handleCanvasClick}
        >
          {/* Helper text when canvas is empty */}
          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-purple-400 text-xl font-semibold">
                <div className="text-6xl mb-4">🎨</div>
                <div>Drag emojis here or click to add text!</div>
                <div className="text-sm mt-2 opacity-75">Create your amazing story</div>
              </div>
            </div>
          )}

          {/* Render canvas items */}
          {items.map((item) => (
            <CanvasItemComponent
              key={item.id}
              item={item}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
