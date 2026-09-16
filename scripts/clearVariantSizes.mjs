/**
 * One-off maintenance: clear the `size` field on a fixed set of product
 * variants (nursery stock that has no meaningful size).
 *
 * Size is an optional String stored as '' when absent - see
 * models/ProductVariant.model.js - so "deleting" a size means setting it back
 * to '', not $unset, so every query/UI path keeps its uniform string.
 *
 * Dry run (default):  node scripts/clearVariantSizes.mjs
 * Apply:              node scripts/clearVariantSizes.mjs --apply
 */
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SKUS = [
    'HDC-OT-POL-LON-1', // Saracca Indica
    'HDC-FP-ALO-POL-1', // Alocasia Polly - African Mask Plant
    'HDC-FT-TAB-YEL-1', // Yellow Tabebuia - Golden Trumpet Tree
    'HDC-FP-ANT-JEN-1', // Anthurium Foliage - Cardboard Plant
    'HDC-PA-CYP-ALT-1', // Umbrella Palm
    'HDC-FP-PHI-CEY-1', // Philodendron Ceylon Golden
    'HDC-OT-CON-ERE-1', // Damas Tree (Conocarpus erectus)
    'HDC-FT-CAS-FIS-1', // Cassia fistula - Golden Shower Tree
    'HDC-FT-DEL-REG-1', // Gulmohar Tree (Delonix regia)
    'HDC-FP-DRA-REF-1', // Song of India (Dracaena reflexa)
    'HDC-FT-LAG-SPE-1', // Lagerstroemia speciosa - Queen's Crape Myrtle
    'HDC-SG-MEX-LAW-1', // Mexican Grass
    'HDC-VC-PET-BAM-1', // Creeper Plant
    'HDC-SG-CUR-ROW-1', // Dischidia (String of Pearls)
]

const apply = process.argv.includes('--apply')

const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8')
const mongodbUri = envContent
    .split('\n')
    .map(l => l.trim())
    .find(l => l.startsWith('MONGODB_URI='))
    ?.replace('MONGODB_URI=', '')
    .replace(/^["']|["']$/g, '')
    .trim()

if (!mongodbUri) {
    console.error('MONGODB_URI not found in .env')
    process.exit(1)
}

await mongoose.connect(mongodbUri, { dbName: 'YT-NEXTJS-ECOMMERCE' })
const variants = mongoose.connection.collection('productvariants')
const products = mongoose.connection.collection('products')

const matched = await variants.find({ sku: { $in: SKUS } }).toArray()
const byProduct = new Map()
for (const v of matched) byProduct.set(String(v.product), null)

const productDocs = await products
    .find({ _id: { $in: matched.map(v => v.product) } })
    .project({ name: 1 })
    .toArray()
for (const p of productDocs) byProduct.set(String(p._id), p.name)

console.log(`\nTarget SKUs: ${SKUS.length}   Matched variants: ${matched.length}\n`)
for (const v of matched) {
    console.log(
        `  ${v.sku.padEnd(18)} size=${JSON.stringify(v.size ?? null).padEnd(6)} ` +
        `color=${String(v.color).padEnd(8)} ${byProduct.get(String(v.product)) ?? '(product missing)'}`
    )
}

const missing = SKUS.filter(s => !matched.some(v => v.sku === s))
if (missing.length) console.log(`\n  NOT FOUND: ${missing.join(', ')}`)

// Other variants under the same products - reported only, never touched.
const siblings = await variants
    .find({
        product: { $in: [...new Set(matched.map(v => v.product))] },
        sku: { $nin: SKUS },
        size: { $nin: ['', null] },
    })
    .toArray()
if (siblings.length) {
    console.log(`\n  Sibling variants with a size (left untouched):`)
    for (const v of siblings) {
        console.log(`    ${v.sku.padEnd(18)} size=${JSON.stringify(v.size)} ${byProduct.get(String(v.product)) ?? ''}`)
    }
}

if (!apply) {
    console.log('\nDRY RUN - nothing written. Re-run with --apply to clear these sizes.\n')
} else {
    const res = await variants.updateMany(
        { sku: { $in: SKUS }, size: { $nin: ['', null] } },
        { $set: { size: '', updatedAt: new Date() } }
    )
    console.log(`\nAPPLIED - matched ${res.matchedCount}, modified ${res.modifiedCount}\n`)
}

await mongoose.disconnect()
