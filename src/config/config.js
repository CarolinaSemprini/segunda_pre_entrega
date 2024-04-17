import dotenv from 'dotenv';

dotenv.config();
const config = {

    persistence: process.env.PERSISTENCE,
    MONGO_URL: process.env.MONGO_URL,
    PORT: 8080,
};

export default config;