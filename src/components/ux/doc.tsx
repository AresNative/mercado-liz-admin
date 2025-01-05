"use client"

import React, { useState } from 'react'
import { Button, Textarea } from "@nextui-org/react"
import { Bold, Italic, List, ListOrdered } from 'lucide-react'

// Componente para las opciones de modificado de texto
const TextOptions = ({ onFormat }: { onFormat: (format: string) => void }) => {
    return (
        <div className="flex items-center space-x-2 mb-4">
            <Button
                isIconOnly
                variant="light"
                onClick={() => onFormat('bold')}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                isIconOnly
                variant="light"
                onClick={() => onFormat('italic')}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                isIconOnly
                variant="light"
                onClick={() => onFormat('bulletList')}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                isIconOnly
                variant="light"
                onClick={() => onFormat('orderedList')}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
        </div>
    )
}

// Función para aplicar formato al texto
const applyFormat = (text: string, format: string): string => {
    switch (format) {
        case 'bold':
            return `<strong>${text}</strong>`
        case 'italic':
            return `<em>${text}</em>`
        case 'bulletList':
            return `<ul><li>${text}</li></ul>`
        case 'orderedList':
            return `<ol><li>${text}</li></ol>`
        default:
            return text
    }
}

// Componente principal que combina las opciones de texto, el área de texto y la vista previa
export default function SimplifiedDocEditor() {
    const [content, setContent] = useState('')

    const handleFormat = (format: string) => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const selectedText = range.toString()
            const formattedText = applyFormat(selectedText, format)
            const newContent = content.substring(0, range.startOffset) + formattedText + content.substring(range.endOffset)
            setContent(newContent)
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <TextOptions onFormat={handleFormat} />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">Editor</h2>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing your document here..."
                        minRows={15}
                        maxRows={30}
                        className="w-full font-mono text-sm"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">Preview</h2>
                    <div
                        className="border rounded-lg p-4 min-h-[300px] prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>
        </div>
    )
}

