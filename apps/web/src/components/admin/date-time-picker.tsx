"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cx } from "~/utils/cva"
import { Button } from "~/components/admin/ui/button"
import { Calendar } from "~/components/admin/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/admin/ui/popover"
import { Input } from "~/components/admin/ui/input"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // Ensure we have a valid date object
  const dateValue = value instanceof Date && !isNaN(value.getTime()) ? value : new Date()
  
  // Format the date and time parts
  const date = format(dateValue, "PPP")
  const time = format(dateValue, "HH:mm")

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":")
    const newDate = new Date(dateValue)
    newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    onChange(newDate)
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cx(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              if (date) {
                const newDate = new Date(date)
                newDate.setHours(dateValue.getHours(), dateValue.getMinutes())
                onChange(newDate)
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-[120px]"
      />
    </div>
  )
} 