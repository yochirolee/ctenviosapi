const genres = require("./routes/genres");
const excel = require("./routes/excel");
const dotenv = require("dotenv");
const express = require("express");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/genres", genres);
app.use("/api/excel", excel);
app.use("/api/tracking", require("./routes/tracking"));
app.use("/", (req, res) => {
	res.send("Welcome to the API");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
