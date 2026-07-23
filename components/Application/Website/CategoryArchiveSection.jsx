import dynamic from 'next/dynamic'
import { getHomeCategories } from '@/lib/services/categoryService'
import { getHomeColors } from '@/lib/services/colorService'

// Interactive hover-preview logic is split into its own client chunk so it
// does not block parsing/hydration of the critical path.
const ArchiveSectionClient = dynamic(() => import('./ArchiveSectionClient'))

const WRITEUP =
    'Everything a garden needs, grouped the way a gardener actually shops. Ornamental trees, shrubs, ' +
    'shade-loving indoor plants, hanging varieties, creepers and topiary sit alongside summer and winter ' +
    'seasonal flowers, carpet grass for lawns, and seedlings and seeds released in their proper months. ' +
    'Beyond the plants you will find organic and inorganic manure, insecticides, earthen and fibre pots, ' +
    'hanging and vertical biowall planters, hand implements, cocopeat, garden soil, cowdung, decorative ' +
    'pebbles, and geotextile net and drain cell for roof gardens. If you are unsure what suits your light, ' +
    'soil or season, our counter staff will help you narrow it down.'

const mapCategory = (category) => ({
    // Prefixed so a category id can never collide with a colour key.
    id: `cat-${category.id}`,
    href: category.href,
    name: category.name,
    metaLabel: category.collectionLabel,
    secondaryLabel: String(category.year),
    previewImage: category.previewImage
})

const mapColor = (color) => ({
    id: `col-${color.id}`,
    href: color.href,
    name: color.name,
    metaLabel: color.stylesLabel,
    secondaryLabel: String(color.year),
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
            columns={{ name: 'Category', meta: 'Collection', secondary: 'Year' }}
            items={items}
        />
    )
}

export default CategoryArchiveSection
