import dynamic from 'next/dynamic'
import { getHomeParents } from '@/lib/services/parentService'

// Split into its own client chunk so it does not block parsing/hydration of
// the critical path.
const ArchiveSectionClient = dynamic(() => import('./ArchiveSectionClient'))

const WRITEUP =
    'Plants, pots, manure and garden implements, grouped the way a gardener actually shops.'

const SUBTITLE =
    'Not sure what suits your light or space? Our counter staff will help you narrow it down.'

const CategoryArchiveSection = async () => {
    // Show data of the Parent section end-to-end
    const parentItems = await getHomeParents()

    if (!parentItems || parentItems.length === 0) return null

    return (
        <ArchiveSectionClient
            title="Categories"
            writeup={WRITEUP}
            subtitle={SUBTITLE}
            items={parentItems}
        />
    )
}

export default CategoryArchiveSection
