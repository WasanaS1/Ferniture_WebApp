const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_DB_URL || "mongodb+srv://wishyCode:1234@cluster0.bewpwrl.mongodb.net/e-commerce";

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB Connected");
        cleanupReviewCount();
    }).catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });

const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));

async function cleanupReviewCount() {
    try {
        console.log("Cleaning up reviewCount field...");
        
        // Remove reviewCount field from all products
        const result = await Product.updateMany(
            {},
            { $unset: { reviewCount: "" } }
        );
        
        console.log(`Updated ${result.modifiedCount} products to remove reviewCount field`);
        
        // Verify cleanup
        const remainingWithReviewCount = await Product.find({ reviewCount: { $exists: true } });
        console.log(`Products still with reviewCount: ${remainingWithReviewCount.length}`);
        
        if (remainingWithReviewCount.length === 0) {
            console.log("✓ reviewCount field successfully removed from all products");
        }
        
    } catch (error) {
        console.error("Cleanup failed:", error);
    } finally {
        mongoose.disconnect();
        console.log("Database connection closed");
    }
}
