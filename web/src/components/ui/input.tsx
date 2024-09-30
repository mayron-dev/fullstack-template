import * as React from "react"

import { cn } from "@/lib/utils"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { Button } from "./button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [inputType, setInputType] = React.useState(type)
    if (type === "password") {

    }
    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2">
          {
            type === "password" && (
              <Button 
                variant="ghost"
                type="button" 
                onClick={() => setInputType(inputType === "password" ? "text" : "password")}
              >
                {inputType === "text" ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            )
          }

        </span>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
