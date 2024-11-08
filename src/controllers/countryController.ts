import { Request, Response } from "express";
import axios from "axios";
import cache from "../utils/cache";

const REST_COUNTRIES_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cacheKey = "all_countries";
  if (cache.has(cacheKey)) {
    res.json(cache.get(cacheKey));
    return;
  }

  try {
    const response = await axios.get(`${REST_COUNTRIES_URL}/all`);
    const countries = response.data.map((country: any) => ({
      name: country.name.common,
      region: country.region,
      flag: country.flags.svg,
      code: country.cca2,
      timezones: country.timezones,
    }));
    cache.set(cacheKey, countries);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries" });
  }
};

export const getCountryByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    console.log(code);
    const response = await axios.get(`${REST_COUNTRIES_URL}/alpha/${code}`);
    const country = response.data.map((country: any) => ({
      name: country.name.common,
      region: country.region,
      flag: country.flags.svg,
      code: country.cca2,
      timezones: country.timezones,
      languages: country.languages,
      population: country.population,
    }));
    res.json(country[0]);
  } catch (error) {
    res.status(404).json({ message: "Country not found" });
  }
};

export const getCountriesByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const response = await axios.get(`${REST_COUNTRIES_URL}/region/${region}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries by region" });
  }
};

export const searchCountries = async (req: Request, res: Response) => {
  const cacheKey = "all_countries";
  const { name, capital, region, page = 1, limit = 20 } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);

  try {
    let countries = [] as any;
    if (cache.has(cacheKey)) {
      countries = cache.get(cacheKey);
    } else {
      const response = await axios.get(`${REST_COUNTRIES_URL}/all`);
      countries = response.data;
      cache.set(cacheKey, countries);
    }

    if (name) {
      countries = countries.filter((country: any) =>
        country.name.common
          .toLowerCase()
          .includes((name as string).toLowerCase())
      );
    }

    if (capital) {
      countries = countries.filter(
        (country: any) =>
          country.capital &&
          country.capital[0]
            .toLowerCase()
            .includes((capital as string).toLowerCase())
      );
    }

    if (region) {
      countries = countries.filter(
        (country: any) =>
          country.region &&
          country.region.toLowerCase() === (region as string).toLowerCase()
      );
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedCountries = countries.slice(
      startIndex,
      startIndex + pageSize
    );

    res.json({
      data: paginatedCountries.map((country: any) => ({
        name: country.name.common,
        region: country.region,
        flag: country.flags.svg,
        code: country.cca2,
        timezones: country.timezones,
      })),
      total: countries.length,
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries" });
  }
};
