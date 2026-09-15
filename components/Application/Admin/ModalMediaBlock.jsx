import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }) => {
    const handleCheck = () => {
        let newSelectedMedia = []
        const isSelected = selectedMedia.find(m => m._id === media._id) ? true : false
        if (isMultiple) {
            // select multiple media 
            if (isSelected) {
                //   remove selected media from array 
                newSelectedMedia = selectedMedia.filter(m => m._id !== media._id)
            } else {
                // add new media into array 

                newSelectedMedia = [...selectedMedia, {
                    _id: media._id,
                    url: media.secure_url
                }]
            }

            setSelectedMedia(newSelectedMedia)

        } else {
            // select single media 
            setSelectedMedia([{ _id: media._id, url: media.secure_url }])
        }
    }
    return (
        <label
            htmlFor={media._id}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-muted/40 transition-all hover:border-primary/50 hover:shadow-2xs has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:ring-2 has-[button[data-state=checked]]:ring-primary/40"
        >
            <div className="absolute top-2 left-2 z-20 rounded-md bg-background/90 p-1 shadow-2xs backdrop-blur-xs transition-transform group-hover:scale-105">
                <Checkbox
                    id={media._id}
                    checked={selectedMedia.some((m) => m._id === media._id)}
                    onCheckedChange={handleCheck}
                    className="cursor-pointer"
                />
            </div>
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={media.secure_url}
                    alt={media.alt || 'Media item'}
                    width={300}
                    height={300}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-[150px] h-[100px]"
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock