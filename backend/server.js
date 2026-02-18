const app = require('./src/app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const PORT = 3000;

app.use(cors());

const userRoutes = require('./src/routes/user.Routes');
app.use('/api', userRoutes);

// const connectDB = require('./src/config/db');
// connectDB();

mongoose.connect("mongodb://admin:admin123@localhost:27017/blogs?authSource=admin")
  .then(() => console.log("Connected to blogs DB"))
  .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 