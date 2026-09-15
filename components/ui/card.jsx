import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  interactive = false,
  ...props
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
              // `ring-1 ring-foreground/10` resolves to white/10 in dark mode,
              // which left cards floating with no edge against the page. A real
              // border token separates the surfaces in both themes.
              "group/card flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card py-4 text-sm text-card-foreground shadow-xs has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl transition-[transform,box-shadow,border-color] duration-200 ease-out",
              // Lift is opt-in. Static panels should not animate under the
              // cursor; only cards that are actually a link or a button do.
              interactive &&
                "transform-gpu cursor-pointer hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md motion-reduce:hover:translate-y-0",
          className
        )}
      {...props} />
  );
}

function CardDefaultSm({
  className,
  size = "default-sm",
  ...props
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
                  "group/card relative flex min-h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out",
              "transform-gpu cursor-pointer hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md motion-reduce:hover:translate-y-0",
              className
            )}
      {...props} />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-5 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props} />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 group-data-[size=sm]/card:px-3", className)}
      {...props} />
  );
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-5 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props} />
  );
}

export {
  Card,
  CardDefaultSm,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
