const express = require('express');
const cors = require('cors');
const connectDB = require('./config/Db');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const authRoutes = require('./routes/auth.routes');
const brandRoutes = require('./routes/brands.routes');
const categoriesRoutes = require('./routes/categories.routes');
const productRoutes = require('./routes/product.route');
const subcategoriesRoutes = require('./routes/subcategories.routes');
const CertificationRoutes = require('./routes/certification.routes');
const cartRoutes = require('./routes/cart.routes');
const locationRoutes = require('./routes/location.routes');
const EnquiryRoutes = require('./routes/Enquiry.routes');

const app = express();
const PORT = process.env.PORT || 5000;


// Serve static files from the uploads directory
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'], // Add your frontend URLs
  credentials: true
}));
app.use("/auth", authRoutes);
app.use("/brands", brandRoutes);
app.use("/categories", categoriesRoutes); 
app.use("/subcategories", subcategoriesRoutes);  
app.use("/products", productRoutes);
app.use("/certifications", CertificationRoutes);
app.use("/cart", cartRoutes);
app.use("/locations", locationRoutes);
app.use("/enquiries", EnquiryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port - ${PORT}`);
});