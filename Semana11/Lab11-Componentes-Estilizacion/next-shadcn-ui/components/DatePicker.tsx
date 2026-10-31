"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate, fromDateValue, toDateValue } from "@/lib/dates"

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = fromDateValue(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 size-4 text-violet-600" />
          {selected ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return
            onChange(toDateValue(date))
            setOpen(false)
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}
