const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const PORT = 3000;

app.use(cors());
app.route('/').get((req, res) => {
    res.send('Hello World!');
});

const connectDB = require('./src/config/db');
connectDB();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 