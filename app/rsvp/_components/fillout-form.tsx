'use client'

import { FilloutStandardEmbed } from '@fillout/react'

type FilloutFormProps = {
  filloutId: string
}

export function FilloutForm({ filloutId }: FilloutFormProps) {
  return (
    <FilloutStandardEmbed
      filloutId={filloutId}
      inheritParameters
      dynamicResize
    />
  )
}
