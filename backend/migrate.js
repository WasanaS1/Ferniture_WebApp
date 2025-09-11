const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// MongoDB connection string from environment
const mongoURI = process.env.MONGO_DB_URL || "mongodb+srv://wishyCode:1234@cluster0.bewpwrl.mongodb.net/e-commerce";

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB Connected");
        runMigration();
    }).catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });

// Product schema before migration (with both old and new fields)
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }, // This will be removed
    reviews: [{
        id: { type: String, required: true },
        customerName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false }
    }],
    sizes: [{ type: String }], // This will be renamed to specifications
    specifications: [{ type: String }], // New field
    tags: [{ type: String }],
    subcategory: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

async function runMigration() {
    try {
        console.log("Starting migration...");
        
        // Get all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to migrate`);
        
        let migratedCount = 0;
        
        for (const product of products) {
            let needsUpdate = false;
            const updateData = {};
            
            // Migrate sizes to specifications if exists
            if (product.sizes && product.sizes.length > 0 && (!product.specifications || product.specifications.length === 0)) {
                updateData.specifications = product.sizes;
                updateData.$unset = { sizes: 1 }; // Remove sizes field
                needsUpdate = true;
                console.log(`Migrating sizes to specifications for product: ${product.name}`);
            }
            
            // Remove reviewCount field (it will be calculated from reviews array)
            if (product.reviewCount !== undefined) {
                if (!updateData.$unset) updateData.$unset = {};
                updateData.$unset.reviewCount = 1;
                needsUpdate = true;
                console.log(`Removing reviewCount field for product: ${product.name}`);
            }
            
            // Recalculate rating based on reviews if there are reviews
            if (product.reviews && product.reviews.length > 0) {
                const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
                const newRating = totalRating / product.reviews.length;
                if (Math.abs(newRating - (product.rating || 0)) > 0.01) { // Only update if significantly different
                    updateData.rating = newRating;
                    needsUpdate = true;
                    console.log(`Recalculating rating for product: ${product.name} - Old: ${product.rating}, New: ${newRating}`);
                }
            }
            
            if (needsUpdate) {
                await Product.updateOne({ _id: product._id }, updateData);
                migratedCount++;
                console.log(`✓ Updated product: ${product.name}`);
            }
        }
        
        console.log(`\nMigration completed successfully!`);
        console.log(`Total products processed: ${products.length}`);
        console.log(`Products migrated: ${migratedCount}`);
        console.log(`Products unchanged: ${products.length - migratedCount}`);
        
        // Verify migration
        const verifyProducts = await Product.find({});
        const hasOldSizes = verifyProducts.filter(p => p.sizes && p.sizes.length > 0);
        const hasOldReviewCount = verifyProducts.filter(p => p.reviewCount !== undefined);
        
        console.log(`\nVerification:`);
        console.log(`Products still with 'sizes' field: ${hasOldSizes.length}`);
        console.log(`Products still with 'reviewCount' field: ${hasOldReviewCount.length}`);
        
        if (hasOldSizes.length === 0 && hasOldReviewCount.length === 0) {
            console.log("✓ Migration verification passed!");
        } else {
            console.log("⚠ Some products may need manual attention");
        }
        
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.disconnect();
        console.log("Database connection closed");
    }
}
