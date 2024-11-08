import express from "express";
import cors from "cors";
import countryRoutes from "./routes/countryRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/countries", countryRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
