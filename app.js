const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const usersRouter = require("./routes/usersRoute");
const reviewsRouter = require("./routes/reviewsRoute");
const settingsRouter = require("./routes/settingsRoute");
const offersRouter = require("./routes/offersRoute");
const productsRouter = require("./routes/productsRoute");
const categoriesRouter = require("./routes/categoriesRoute");
const authRouter = require("./routes/authRoute");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const app = express();
app.use(cors());
app.options("*", cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/", limiter);
// Body purser, reading data from bodu into req.body in this case bodies larger than 10kb  will now be accepted
app.use(express.json({ limit: "10kb" }));
// Date sanitization against NoSQL query injection
app.use(mongoSanitize());
// Date sanitization against xxs
app.use(xss());
app.use(express.static(`${__dirname}/public`));
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
//////////////////////////////////////////////////////////////
// Start Main Routes
app.use("/moka/api/users", usersRouter);
app.use("/moka/api/products", productsRouter);
app.use("/moka/api/reviews", reviewsRouter);
app.use("/moka/api/offers", offersRouter);
app.use("/moka/api/settings", settingsRouter);
app.use("/moka/api/categories", categoriesRouter);
app.use("/moka/api/auth", authRouter);
// End Main Routes
//////////////////////////////////////////////////////////////
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
