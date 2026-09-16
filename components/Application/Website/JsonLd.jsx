// Renders a schema.org JSON-LD block. `data` is trusted, server-built content
// (business facts, product data from our own DB) - never raw user input.
const JsonLd = ({ data }) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
)

export default JsonLd
