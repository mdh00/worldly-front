import { useEffect, useState } from "react";
import { getCountryByCode } from "@/api/service";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";

const CountryDetailsPage = () => {
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { code } = useParams();
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const response = await getCountryByCode(code);
                setCountry(response);
            } catch (error) {
                console.error("Error fetching country data:", error);
                setError("Failed to load country data");
            } finally {
                setLoading(false);
            }
        };

        fetchCountry();
    }, [code]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <div className="w-16 h-16 border-t-4 border-emerald-400 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-semibold">Loading, please wait...</p>
            </div>
        );
    }

    if (error || !country) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <div className="text-xl font-semibold text-red-400">
                    {error || "Country not found"}
                </div>
            </div>
        );
    }

    // Format currencies
    const getCurrencies = () => {
        if (!country.currencies) return "N/A";
        return Object.values(country.currencies)
            .map(currency => `${currency.name} (${currency.symbol || 'No symbol'})`)
            .join(', ');
    };

    // Format languages
    const getLanguages = () => {
        if (!country.languages) return "N/A";
        return Object.values(country.languages).join(', ');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center mb-8 bg-indigo-950 rounded-lg overflow-hidden">
                    <div className="w-full md:w-1/2 p-6">
                        <div className="flex justify-start">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span
                                            onClick={() => toggleFavorite(country.cca2)}
                                            className={`cursor-pointer`}
                                        >
                                            {isFavorite(country.cca2) ? (
                                                <IoHeartSharp className="text-red-600 text-3xl" />
                                            ) : (
                                                <IoHeartOutline className="text-gray-400 text-3xl" />
                                            )}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm text-emerald-400 font-semibold">
                                            {isFavorite(country.cca2) ? "Remove from favorites" : "Add to favorites"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-emerald-400">
                            {country.name.common}
                        </h1>
                        {country.name.official !== country.name.common && (
                            <p className="text-lg mb-4 text-white">
                                {country.name.official}
                            </p>
                        )}
                        <div className="inline-block px-3 py-1 bg-emerald-400 text-indigo-950 rounded-md font-semibold mb-2">
                            {country.cca2}
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center p-4">
                        {country.flags?.svg && (
                            <img
                                src={country.flags.svg}
                                alt={`Flag of ${country.name.common}`}
                                className="h-48 shadow-lg rounded"
                            />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Geography" icon="🌍">
                        <InfoRow label="Capital" value={country.capital?.[0] || "N/A"} />
                        <InfoRow label="Region" value={country.region || "N/A"} />
                        <InfoRow label="Subregion" value={country.subregion || "N/A"} />
                    </InfoCard>

                    <InfoCard title="Demographics" icon="👥">
                        <InfoRow
                            label="Population"
                            value={country.population ? country.population.toLocaleString() : "N/A"}
                        />
                        <InfoRow label="Languages" value={getLanguages()} />
                        <InfoRow label="Currencies" value={getCurrencies()} />
                    </InfoCard>
                </div>

                <div className="mt-6 bg-indigo-950 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <span className="mr-2">🕒</span>
                        <span className="text-emerald-400">Timezones</span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {country.timezones && country.timezones.length > 0 ? (
                            country.timezones.map((timezone, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-950 rounded-md border border-emerald-400"
                                >
                                    {timezone}
                                </span>
                            ))
                        ) : (
                            <span>No timezone data available</span>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-emerald-400 text-indigo-950 rounded-md font-semibold hover:bg-emerald-500 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper components
const InfoCard = ({ title, children, icon }) => (
    <div className="bg-indigo-950 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">{icon}</span>
            <span className="text-emerald-400">{title}</span>
        </h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex flex-row justify-between border-b border-black pb-2">
        <span className="font-semibold text-emerald-200">{label}:</span>
        <span className="text-white">{value}</span>
    </div>
);

export default CountryDetailsPage;