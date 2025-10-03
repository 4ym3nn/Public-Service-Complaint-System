"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComplaintSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function ComplaintSearch({ onSearch, placeholder = "Search complaints..." }: ComplaintSearchProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Search Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            {query && (
              <Button type="button" onClick={handleClear} variant="outline" className="bg-transparent">
                Clear
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
