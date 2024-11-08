import express from "express";
import {
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountries,
} from "../controllers/countryController";

const router = express.Router();

router.get("/", getAllCountries);
router.get("/country/:code", getCountryByCode);
router.get("/region/:region", getCountriesByRegion);
router.get("/search", searchCountries);

export default router;
