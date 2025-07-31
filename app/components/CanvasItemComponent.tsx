"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import type { CanvasItem } from "../page"
import { Button } from "@/components/ui/button"

interface CanvasItemComponentProps {
  item: CanvasItem
  onUpdate: (updates: Partial<CanvasItem>) => void
  onRemove: () => void
}

export default function CanvasItemComponent({ item, onUpdate, onRemove }: CanvasItemComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [editValue, setEditValue] = useState(item.content)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(item.content)
  }, [item.content])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (item.type === "text" && !isEditing && !isDragging) {
      console.log("Starting text edit for:", item.id)
      setIsEditing(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isEditing) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)
      onUpdate({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const handleTextSubmit = () => {
    if (editValue.trim()) {
      onUpdate({ content: editValue.trim() })
    }
    setIsEditing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === "Enter") {
      handleTextSubmit()
    } else if (e.key === "Escape") {
      setEditValue(item.content)
      setIsEditing(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Removing item:", item.id)
    onRemove()
  }

  return (
    <div
      className={`absolute select-none group ${isDragging ? "z-50" : "z-10"}`}
      style={{
        left: item.x,
        top: item.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleItemClick}
    >
      {/* Remove button */}
      <Button
        size="sm"
        variant="destructive"
        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
        onClick={handleRemove}
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Item content */}
      {item.type === "emoji" ? (
        <div
          className={`text-4xl p-2 bg-white rounded-lg shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all duration-200 ${
            isDragging ? "rotate-12 scale-110" : "hover:scale-105"
          }`}
        >
          {item.content}
        </div>
      ) : (
        <div className="relative">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleInputKeyDown}
              className="min-w-[100px] bg-white border-2 border-purple-400 rounded-lg shadow-lg font-semibold text-purple-800 px-3 py-2"
              style={{ fontSize: item.fontSize || 16 }}
            />
          ) : (
            <div
              className={`px-3 py-2 bg-white rounded-lg shadow-lg border-2 border-purple-200 font-semibold text-purple-800 hover:shadow-xl transition-all duration-200 cursor-text ${
                isDragging ? "rotate-2 scale-105" : "hover:scale-105"
              }`}
              style={{ fontSize: item.fontSize || 16 }}
            >
              {item.content}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
