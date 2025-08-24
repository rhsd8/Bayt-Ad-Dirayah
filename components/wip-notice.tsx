"use client"

import React from "react"
import { CardContent } from "@/components/ui/card"

export function WipNoticeCard() {
  return (
    <section className="w-full flex items-center justify-center min-h-[40vh]">
      
      <CardContent className="py-10">
        <p className="flex items-center justify-center w-full mt-8">
          This page is a work in progress. Please check back soon!
        </p>
      </CardContent>
    </section>
  )
}
