require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { NotFoundError } = require('./errors/NotFoundError');
const {
  PORT,
  NODE_ENV,
  MONGO_URL,
  MONGO_URL_DEV,
} = require('./utils/constants');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://movies.yanaaboch.nomoredomains.club',
  credentials: true,
}));

app.use(requestLogger);

app.use(limiter);

app.use(helmet());
app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
