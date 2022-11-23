require('dotenv').config();

const process = require('process');
const express = require('express');
const mongoose = require('mongoose');

const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const { corsOptions, limiterOptions } = require('./src/utils/constants');
const { routes } = require('./src/routes/index');
const centralizedErrorHandling = require('./src/middlewares/centralized-error-handling');

const { PORT_DEV, MONGO_URL_DEV } = require('./src/utils/config');

const { PORT = PORT_DEV, MONGO_URL = MONGO_URL_DEV } = process.env;

const app = express();

app.use(requestLogger);
app.use(rateLimit(limiterOptions));
app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandling);

async function main() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
}

main();
