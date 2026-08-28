import dynamic from 'next/dynamic'
import { getHomeCategories } from '@/lib/services/categoryService'
import { getHomeColors } from '@/lib/services/colorService'

// Split into its own client chunk so it does not block parsing/hydration of
// the critical path.
const ArchiveSectionClient = dynamic(() => import('./ArchiveSectionClient'))

const WRITEUP =
    'Plants, pots, manure and garden implements, grouped the way a gardener actually shops. ' +
    "Not sure what suits your light or space? Our counter staff will help you narrow it down."

const mapCategory = (category) => ({
    // Prefixed so a category id can never collide with a colour key.
    id: `cat-${category.id}`,
    href: category.href,
    name: category.name,
    alt: category.alt,
    previewImage: category.previewImage
})

const mapColor = (color) => ({
    id: `col-${color.id}`,
    href: color.href,
    name: color.name,
    alt: color.name,
    previewImage: color.previewImage
})

const CategoryArchiveSection = async () => {
    const [categories, colors] = await Promise.all([
        getHomeCategories(),
        getHomeColors()
    ])

    const categoryItems = (categories || []).map(mapCategory)
    const colorItems = (colors || []).map(mapColor)

    // Nothing shoppable with an image yet: hide the section entirely rather than
    // render an empty archive on the live storefront.
    if (categoryItems.length === 0 && colorItems.length === 0) return null

    // Interleave categories and colours into one continuous list — Category,
    // Colour, Category, Colour … — with any leftover from the longer list
    // appended at the end.
    const items = []
    const max = Math.max(categoryItems.length, colorItems.length)
    for (let i = 0; i < max; i++) {
        if (categoryItems[i]) items.push(categoryItems[i])
        if (colorItems[i]) items.push(colorItems[i])
    }

    return (
        <ArchiveSectionClient
            title="Categories"
            writeup={WRITEUP}
            items={items}
        />
    )
}

export default CategoryArchiveSection
