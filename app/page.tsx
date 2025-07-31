"use client"

import { useState, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Sidebar from "./components/Sidebar"
import Canvas from "./components/Canvas"
import html2canvas from "html2canvas"

export interface CanvasItem {
  id: string
  type: "emoji" | "text"
  content: string
  x: number
  y: number
  fontSize?: number
}

export interface Slide {
  id: string
  title: string
  items: CanvasItem[]
}

export default function StoryBuilder() {
  const [slides, setSlides] = useState<Slide[]>([{ id: "1", title: "Slide 1", items: [] }])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [storyTitle, setStoryTitle] = useState("My Amazing Story")

  const currentSlide = slides[currentSlideIndex]

  const addNewSlide = useCallback(() => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      items: [],
    }
    setSlides((prev) => [...prev, newSlide])
    setCurrentSlideIndex(slides.length)
  }, [slides.length])

  const removeSlide = useCallback(() => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, index) => index !== currentSlideIndex)
      setSlides(newSlides)

      // Adjust current slide index if necessary
      if (currentSlideIndex >= newSlides.length) {
        setCurrentSlideIndex(newSlides.length - 1)
      }
    }
  }, [slides, currentSlideIndex])

  const clearCanvas = useCallback(() => {
    setSlides((prev) => prev.map((slide, index) => (index === currentSlideIndex ? { ...slide, items: [] } : slide)))
  }, [currentSlideIndex])

  const saveStory = useCallback(async () => {
    const canvasElement = document.querySelector(".canvas-area") as HTMLElement
    if (canvasElement) {
      try {
        const canvas = await html2canvas(canvasElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        })

        const link = document.createElement("a")
        link.download = `${storyTitle.replace(/\s+/g, "_")}_slide_${currentSlideIndex + 1}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } catch (error) {
        console.error("Error saving image:", error)
      }
    }
  }, [storyTitle, currentSlideIndex])

  const addItemToCurrentSlide = useCallback(
    (newItem: CanvasItem) => {
      console.log("Adding item to slide:", newItem)
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides]
        newSlides[currentSlideIndex] = {
          ...newSlides[currentSlideIndex],
          items: [...newSlides[currentSlideIndex].items, newItem],
        }
        console.log("Updated slides:", newSlides[currentSlideIndex].items)
        return newSlides
      })
    },
    [currentSlideIndex],
  )

  const updateItemInCurrentSlide = useCallback(
    (itemId: string, updates: Partial<CanvasItem>) => {
      console.log("Updating item:", itemId, updates)
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides]
        newSlides[currentSlideIndex] = {
          ...newSlides[currentSlideIndex],
          items: newSlides[currentSlideIndex].items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item,
          ),
        }
        return newSlides
      })
    },
    [currentSlideIndex],
  )

  const removeItemFromCurrentSlide = useCallback(
    (itemId: string) => {
      console.log("Removing item:", itemId)
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides]
        newSlides[currentSlideIndex] = {
          ...newSlides[currentSlideIndex],
          items: newSlides[currentSlideIndex].items.filter((item) => item.id !== itemId),
        }
        return newSlides
      })
    },
    [currentSlideIndex],
  )

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white shadow-lg border-b-4 border-purple-200 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Input
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="text-2xl font-bold text-purple-800 border-2 border-purple-200 focus:border-purple-400 bg-purple-50"
                placeholder="Story Title"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={addNewSlide}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Slide
              </Button>
              {slides.length > 1 && (
                <Button
                  onClick={removeSlide}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Remove Slide
                </Button>
              )}
              <Button
                onClick={saveStory}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Save as PNG
              </Button>
              <Button
                onClick={clearCanvas}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear Canvas
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <Canvas
              items={currentSlide.items}
              onAddItem={addItemToCurrentSlide}
              onUpdateItem={updateItemInCurrentSlide}
              onRemoveItem={removeItemFromCurrentSlide}
            />
          </div>
        </div>

        {/* Bottom Slide Navigation */}
        <div className="bg-white border-t-4 border-purple-200 p-4 shadow-lg">
          <div className="flex items-center justify-center space-x-4 max-w-4xl mx-auto">
            <Button
              onClick={goToPreviousSlide}
              disabled={currentSlideIndex === 0}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2 overflow-x-auto max-w-md">
              {slides.map((slide, index) => (
                <Card
                  key={slide.id}
                  className={`min-w-[120px] p-3 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                    index === currentSlideIndex
                      ? "bg-purple-500 text-white shadow-lg ring-4 ring-purple-300"
                      : "bg-white hover:bg-purple-50 shadow-md"
                  }`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm">{slide.title}</div>
                    <div className="text-xs opacity-75 mt-1">{slide.items.length} items</div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              onClick={goToNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center mt-2">
            <span className="text-purple-600 font-semibold">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
