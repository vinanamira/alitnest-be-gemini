import express from 'express';
import router from '../routes/router.js';
import '../config/database.js';
import cors from 'cors';
import 'dotenv/config'; 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/', router);

app.listen(port, '0.0.0.0',() => {
    console.log(`Example app listening on port ${port}`);
});