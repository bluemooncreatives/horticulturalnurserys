'use client'
import * as React from "react";
import { useState } from "react";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function Select({
   options = [],
   selected,
   setSelected,
   placeholder = "Select options",
   // Optional leading label for the trigger, e.g. `Parent` renders
   // "Parent: Orchids" so a filter chip says what it is filtering on. Only
   // shown once something is selected, so the placeholder stays clean.
   prefix,
   isMulti = false,
   className = "",
   // Opt-in: lets the user commit whatever they typed as a new value when it
   // is not already in the list. Off by default so existing pickers, whose
   // options are closed sets, keep rejecting unknown input.
   creatable = false,
   createLabel = (value) => `Add "${value}"`,
}) {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState("");
   const safeOptions = Array.isArray(options) ? options : [];

   const handleSelect = (option) => {
       if (isMulti) {
           const current = Array.isArray(selected) ? selected : [];
           if (current.includes(option.value)) {
               setSelected(current.filter((s) => s !== option.value));
           } else {
               setSelected([...current, option.value]);
           }
       } else {
           setSelected(option.value);
           setOpen(false);
       }
   };

   const handleRemove = (value, e) => {
       e?.stopPropagation?.();
       if (isMulti) {
           const current = Array.isArray(selected) ? selected : [];
           setSelected(current.filter((s) => s !== value));
       } else {
           setSelected(null);
       }
   };

   const handleClearAll = (e) => {
       e?.stopPropagation?.();
       setSelected(isMulti ? [] : null);
   };

   const handleCreate = () => {
       const value = query.trim();
       if (!value) return;
       if (isMulti) {
           const current = Array.isArray(selected) ? selected : [];
           if (!current.includes(value)) setSelected([...current, value]);
       } else {
           setSelected(value);
           setOpen(false);
       }
       setQuery("");
   };

   const isArraySelected = Array.isArray(selected) && selected.length > 0;
   const selectedOption = !isMulti && selected
       ? safeOptions.find((o) => o.value === selected)
         // A created value is not in options yet - render it as-is so the
         // trigger never falls back to the placeholder for a real selection.
         || { label: selected, value: selected }
       : null;
   const hasValue = isMulti ? isArraySelected : Boolean(selected);

   return (
       <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery(""); }}>
           <PopoverTrigger asChild>
               <Button
                   variant="outline"
                   role="combobox"
                   aria-expanded={open}
                   className={cn(
                       "h-auto min-h-9 w-full justify-between px-3 py-1.5 text-left font-normal transition-colors hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary",
                       className
                   )}
               >
                   <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 pr-2">
                       {prefix && hasValue ? (
                           <span className="shrink-0 text-sm text-muted-foreground">{prefix}:</span>
                       ) : null}
                       {isMulti && isArraySelected ? (
                           selected.map((value) => {
                               const option = safeOptions.find((o) => o.value === value);
                               return (
                                   <Badge
                                       key={value}
                                       variant="secondary"
                                       className="h-6 max-w-[14rem] gap-1 rounded-md px-2 py-0.5 text-xs font-normal border border-border/60 bg-muted/70 text-foreground hover:bg-muted"
                                   >
                                       <span className="truncate">{option?.label ?? value}</span>
                                       <span
                                           role="button"
                                           tabIndex={0}
                                           onClick={(e) => handleRemove(value, e)}
                                           onKeyDown={(e) => {
                                               if (e.key === "Enter" || e.key === " ") {
                                                   handleRemove(value, e);
                                               }
                                           }}
                                           className="rounded-full p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
                                           aria-label={`Remove ${option?.label ?? value}`}
                                       >
                                           <XIcon className="h-3 w-3" />
                                       </span>
                                   </Badge>
                               );
                           })
                       ) : selectedOption ? (
                           <span className="block min-w-0 truncate text-sm font-medium text-foreground" title={selectedOption.label}>
                               {selectedOption.label}
                           </span>
                       ) : (
                           <span className="block min-w-0 truncate text-sm text-muted-foreground">{placeholder}</span>
                       )}
                   </div>

                   <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                       {hasValue && (
                           <span
                               role="button"
                               tabIndex={0}
                               onClick={handleClearAll}
                               onKeyDown={(e) => {
                                   if (e.key === "Enter" || e.key === " ") {
                                       handleClearAll(e);
                                   }
                               }}
                               className="rounded p-0.5 transition hover:bg-muted hover:text-foreground cursor-pointer"
                               aria-label="Clear selection"
                           >
                               <XIcon className="h-3.5 w-3.5" />
                           </span>
                       )}
                       <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
                   </div>
               </Button>
           </PopoverTrigger>
           <PopoverContent
               align="start"
               className="w-[var(--radix-popover-trigger-width)] min-w-[220px] max-w-[min(20rem,calc(100vw-2rem))] p-0 shadow-lg border-border"
           >
               <Command>
                   <CommandInput
                       placeholder={creatable ? "Search or type a new value..." : "Search..."}
                       className="h-9 text-sm"
                       value={query}
                       onValueChange={setQuery}
                   />
                   <CommandList className="max-h-[min(15rem,50vh)] overflow-y-auto admin-scroll">
                       <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                           {creatable && query.trim() ? (
                               <button
                                   type="button"
                                   onClick={handleCreate}
                                   className="mx-auto flex items-center gap-1.5 rounded px-2 py-1 text-foreground hover:bg-muted"
                               >
                                   <PlusIcon className="h-3.5 w-3.5" />
                                   {createLabel(query.trim())}
                               </button>
                           ) : (
                               "No options found."
                           )}
                       </CommandEmpty>
                       <CommandGroup>
                           {safeOptions.map((option) => {
                               const isSelected = isMulti
                                   ? Array.isArray(selected) && selected.includes(option.value)
                                   : selected === option.value;
                               return (
                                   <CommandItem
                                       key={option.value}
                                       value={option.label}
                                       onSelect={() => handleSelect(option)}
                                       className="flex items-center justify-between gap-2 text-sm py-2 px-2.5 cursor-pointer aria-selected:bg-muted"
                                   >
                                       <span className="min-w-0 truncate" title={option.label}>{option.label}</span>
                                       <CheckIcon
                                           className={cn(
                                               "h-4 w-4 text-primary transition-opacity",
                                               isSelected ? "opacity-100" : "opacity-0"
                                           )}
                                       />
                                   </CommandItem>
                               );
                           })}
                       </CommandGroup>
                       {creatable
                           && query.trim()
                           && !safeOptions.some((o) => o.value.toLowerCase() === query.trim().toLowerCase()) && (
                           <CommandGroup>
                               <CommandItem
                                   value={`__create__${query}`}
                                   onSelect={handleCreate}
                                   className="flex items-center gap-1.5 text-sm py-2 px-2.5 cursor-pointer aria-selected:bg-muted"
                               >
                                   <PlusIcon className="h-3.5 w-3.5" />
                                   <span>{createLabel(query.trim())}</span>
                               </CommandItem>
                           </CommandGroup>
                       )}
                   </CommandList>
               </Command>
           </PopoverContent>
       </Popover>
   );
}

export default Select;
