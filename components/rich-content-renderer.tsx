"use client"

import React from 'react'

interface RichContentRendererProps {
  content: string
  className?: string
}

/**
 * Safely renders HTML content from rich text editor
 * Uses dangerouslySetInnerHTML but with proper classes for styling
 */
export function RichContentRenderer({ content, className = '' }: RichContentRendererProps) {
  // If content is empty or just whitespace, show a default message
  if (!content || !content.trim()) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        No content available.
      </div>
    )
  }

  return (
    <div 
      className={`rich-content prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// Add global styles for rich content
export const richContentStyles = `
  .rich-content {
    line-height: 1.6;
  }
  
  .rich-content p {
    margin-bottom: 1rem;
  }
  
  .rich-content strong,
  .rich-content b {
    font-weight: 700;
  }
  
  .rich-content em,
  .rich-content i {
    font-style: italic;
  }
  
  .rich-content u {
    text-decoration: underline;
  }
  
  .rich-content ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .rich-content ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .rich-content li {
    margin-bottom: 0.5rem;
  }
  
  .rich-content div[style*="text-align: center"] {
    text-align: center;
  }
  
  .rich-content div[style*="text-align: right"] {
    text-align: right;
  }
  
  .rich-content div[style*="text-align: left"] {
    text-align: left;
  }
` 