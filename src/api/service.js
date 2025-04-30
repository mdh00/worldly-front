import api from "./api";

// Get all countries
export const getAllCountries = async () => {
    try {
        const response = await api.get("/all?fields=name,population,region,languages,flags,currencies,subregion,timezones,capital,cca2");
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to fetch countries");
    }
};

// Get country by code
export const getCountryByCode = async (code) => {
    try {
        const response = await api.get(`/alpha/${code}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to fetch country by code");
    }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
    try {
        const response = await api.get(`/name/${name}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to search countries by name");
    }
};

// Search countries by region
export const searchCountriesByRegion = async (region) => {
    try {
        const response = await api.get(`/region/${region}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to search countries by region");
    }
};

// Search countries by subregion
export const searchCountriesBySubregion = async (subregion) => {
    try {
        const response = await api.get(`/subregion/${subregion}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to search countries by subregion");
    }
};