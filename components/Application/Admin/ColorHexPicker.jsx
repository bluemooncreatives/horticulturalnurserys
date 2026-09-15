'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { isValidHex, COLOR_HEX_MAP } from '@/lib/colorMap'
import { normalizeColor } from '@/lib/utils'
import { Pipette } from 'lucide-react'

const ColorHexPicker = ({ value = '', onChange, colorName = '' }) => {
    const suggested = COLOR_HEX_MAP[normalizeColor(colorName)?.toLowerCase?.()] || ''
    const pickerValue = isValidHex(value) ? value : (suggested || '#1D4020')

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex h-9 items-center gap-2 rounded-lg border border-input bg-card px-2.5 shadow-xs transition-colors hover:border-primary/50">
                <label className="relative flex size-5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border shadow-xs">
                    <span
                        className="size-full rounded-full"
                        style={{ backgroundColor: pickerValue }}
                    />
                    <input
                        type="color"
                        aria-label="Pick swatch color"
                        value={pickerValue}
                        onChange={(event) => onChange(event.target.value)}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                </label>
                <Pipette className="size-3.5 text-muted-foreground" aria-hidden />
            </div>

            <div className="w-36">
                <Input
                    type="text"
                    placeholder="#2C5E30"
                    value={value || ''}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-9 font-mono text-xs uppercase"
                />
            </div>

            {!value && suggested && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(suggested)}
                    className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                    <span
                        className="size-2.5 rounded-full border border-border"
                        style={{ backgroundColor: suggested }}
                    />
                    Use suggested ({suggested})
                </Button>
            )}
        </div>
    )
}

export default ColorHexPicker
