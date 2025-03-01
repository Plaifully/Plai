"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { cx } from "~/utils/cva"

type ActionVariant = "default" | "destructive"

interface Action {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?: ActionVariant
  external?: boolean
}

interface DataTableRowActionsProps {
  actions: Action[]
}

export function DataTableRowActions({ actions }: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          aria-label="Open menu"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => {
          const menuItem = (
            <DropdownMenuItem
              key={action.label}
              onClick={action.onClick}
              className={cx(
                "cursor-pointer",
                action.variant === "destructive" && "text-destructive focus:text-destructive"
              )}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          )

          return action.href ? (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
            >
              {menuItem}
            </Link>
          ) : (
            React.cloneElement(menuItem, { key: action.label })
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 