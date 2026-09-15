
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW, ADMIN_ENQUIRY_SHOW, ADMIN_CONTACTS_GENERAL_SHOW, ADMIN_CONTACTS_SERVICE_SHOW, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_REVIEW_SHOW } from "@/routes/AdminPanelRoute";

const searchData = [
    {
        label: "Dashboard",
        description: "View website analytics and reports",
        url: ADMIN_DASHBOARD,
        keywords: ["dashboard", "overview", "analytics", "insights"]
    },
    {
        label: "Category",
        description: "Manage product categories",
        url: ADMIN_CATEGORY_SHOW,
        keywords: ["category", "product category"]
    },
    {
        label: "Add Category",
        description: "Add new product categories",
        url: ADMIN_CATEGORY_ADD,
        keywords: ["add category", "new category"]
    },
    {
        label: "Product",
        description: "Manage all product listings",
        url: ADMIN_PRODUCT_SHOW,
        keywords: ["products", "product list"]
    },
    {
        label: "Add Product",
        description: "Add a new product to the catalog",
        url: ADMIN_PRODUCT_ADD,
        keywords: ["new product", "add product"]
    },
    {
        label: "Product Variant",
        description: "Manage all product variants",
        url: ADMIN_PRODUCT_VARIANT_SHOW,
        keywords: ["products variants", "variants"]
    },
    {
        label: "Product Enquiries",
        description: "Manage cart/product enquiries and leads",
        url: ADMIN_ENQUIRY_SHOW,
        keywords: ["enquiry", "enquiries", "inquiry", "lead", "leads", "quote", "quotation", "product enquiry", "cart enquiry"]
    },
    {
        label: "General Enquiry",
        description: "Messages from the general contact form",
        url: ADMIN_CONTACTS_GENERAL_SHOW,
        keywords: ["contact", "message", "query", "support", "general enquiry"]
    },
    {
        label: "Service Enquiry",
        description: "Leads for landscape, maintenance, roof & vertical garden services",
        url: ADMIN_CONTACTS_SERVICE_SHOW,
        keywords: ["service enquiry", "service lead", "landscape", "roof garden", "vertical garden", "garden maintenance"]
    },

    {
        label: "Review",
        description: "Manage customer reviews and feedback",
        url: ADMIN_REVIEW_SHOW,
        keywords: ["ratings", "feedback"]
    },

    {
        label: "Media",
        description: "Manage website media files",
        url: ADMIN_MEDIA_SHOW,
        keywords: ["images", "videos"]
    },

];

export default searchData;


