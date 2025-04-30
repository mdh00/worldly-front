import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getAllCountries, searchCountriesByName, searchCountriesByRegion, searchCountriesBySubregion } from '@/api/service'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { FaPeopleGroup } from "react-icons/fa6";
import { PiCityBold } from "react-icons/pi";
import { FaMapMarkedAlt } from "react-icons/fa";

function HomePage() {
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRegion, setSelectedRegion] = useState("")
    const [selectedSubregion, setSelectedSubregion] = useState("")
    const [availableRegions, setAvailableRegions] = useState([])
    const [availableSubregions, setAvailableSubregions] = useState([])

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [totalPages, setTotalPages] = useState(0)

    // Load saved filters from sessionStorage on component mount
    useEffect(() => {
        const savedRegion = sessionStorage.getItem('selectedRegion') || ""
        const savedSubregion = sessionStorage.getItem('selectedSubregion') || ""

        setSelectedRegion(savedRegion)
        setSelectedSubregion(savedSubregion)
    }, [])

    // Fetch all countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true)
                const data = await getAllCountries()
                setCountries(data)
                setFilteredCountries(data)

                const regions = [...new Set(data.map((country) => country.region).filter(Boolean))]
                setAvailableRegions(regions)

                // If we have a selected region from sessionStorage, load its subregions
                const savedRegion = sessionStorage.getItem('selectedRegion') || ""
                if (savedRegion) {
                    const regionData = savedRegion === "all" ? data : data.filter(country => country.region === savedRegion)
                    const subregions = [...new Set(regionData.map((country) => country.subregion).filter(Boolean))]
                    setAvailableSubregions(subregions)
                } else {
                    const allSubregions = [...new Set(data.map((country) => country.subregion).filter(Boolean))]
                    setAvailableSubregions(allSubregions)
                }

                // total pages
                setTotalPages(Math.ceil(data.length / itemsPerPage))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCountries()
    }, [itemsPerPage])


    useEffect(() => {
        const HomePagelyFilters = async () => {
            setLoading(true)
            try {
                let results = []

                if (searchTerm && !selectedRegion && !selectedSubregion) {
                    // Search by name only
                    results = await searchCountriesByName(searchTerm)
                } else if (selectedRegion && !searchTerm && !selectedSubregion) {
                    // Filter by region only
                    results = await searchCountriesByRegion(selectedRegion)
                } else if (selectedSubregion && !searchTerm) {
                    // Filter by subregion only
                    results = await searchCountriesBySubregion(selectedSubregion)
                } else if (searchTerm && selectedRegion) {
                    // Search by name and then filter by region
                    const nameResults = await searchCountriesByName(searchTerm)
                    results = nameResults.filter((country) => country.region === selectedRegion)

                    // Further filter by subregion if selected
                    if (selectedSubregion) {
                        results = results.filter((country) => country.subregion === selectedSubregion)
                    }
                } else if (selectedRegion && selectedSubregion) {
                    // Get by region and filter by subregion
                    const regionResults = await searchCountriesByRegion(selectedRegion)
                    results = regionResults.filter((country) => country.subregion === selectedSubregion)
                } else {
                    // No filters, get all countries
                    results = await getAllCountries()
                }

                setFilteredCountries(results)
                setTotalPages(Math.ceil(results.length / itemsPerPage))
                setCurrentPage(1)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(() => {
            HomePagelyFilters()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, selectedRegion, selectedSubregion, itemsPerPage])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // Handle region selection and save to sessionStorage
    const handleRegionChange = async (value) => {
        const regionValue = value === "all" ? "" : value
        setSelectedRegion(regionValue)
        setSelectedSubregion("")

        // Save to sessionStorage
        sessionStorage.setItem('selectedRegion', regionValue)
        sessionStorage.removeItem('selectedSubregion')

        if (value && value !== "all") {
            try {
                setLoading(true)
                const regionData = await searchCountriesByRegion(value)
                const subregions = [...new Set(regionData.map((country) => country.subregion).filter(Boolean))]
                setAvailableSubregions(subregions)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        } else {
            const allSubregions = [...new Set(countries.map((country) => country.subregion).filter(Boolean))]
            setAvailableSubregions(allSubregions)
        }
    }

    // Handle subregion selection and save to sessionStorage
    const handleSubregionChange = (value) => {
        const subregionValue = value === "all" ? "" : value
        setSelectedSubregion(subregionValue)

        // Save to sessionStorage
        sessionStorage.setItem('selectedSubregion', subregionValue)
    }

    const handleResetFilters = async () => {
        setSearchTerm("")
        setSelectedRegion("")
        setSelectedSubregion("")

        // Clear from sessionStorage
        sessionStorage.removeItem('selectedRegion')
        sessionStorage.removeItem('selectedSubregion')

        setLoading(true)
        try {
            const data = await getAllCountries()
            setFilteredCountries(data)
            setCurrentPage(1)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // pagination indexes
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredCountries.slice(indexOfFirstItem, indexOfLastItem)

    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (loading && countries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <div className="w-16 h-16 border-t-4 border-emerald-400 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-semibold">Loading, please wait...</p>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    }

    if (countries.length === 0) {
        return <div className="flex justify-center items-center h-screen text-red-500">No countries found</div>
    }
    return (
        <div className="md:container md:mx-auto px-12 py-8 font-roboto">
            <div className="mb-8 max-w-7xl mx-auto">
                {/* Search and Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-4 mb-6">
                    {/* Search input */}
                    <div>
                        <Input
                            placeholder="Search by country name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full"
                        />
                    </div>

                    {/* Filters and Reset */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Region Select */}
                        <Select value={selectedRegion} onValueChange={handleRegionChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {availableRegions.map((region) => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Subregion Select */}
                        <Select
                            value={selectedSubregion}
                            onValueChange={handleSubregionChange}
                            disabled={availableSubregions.length === 0}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by subregion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subregions</SelectItem>
                                {availableSubregions.map((subregion) => (
                                    <SelectItem key={subregion} value={subregion}>
                                        {subregion}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Reset Button */}
                        <Button variant="outline" onClick={handleResetFilters} className="w-full md:w-auto">
                            Reset Filters
                        </Button>
                    </div>
                </div>


                {/* Results count */}
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {currentItems.length} of {filteredCountries.length} countries
                </div>

                {/* Countries list */}
                {currentItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentItems.map((country) => (
                            <Link to={`/country/${country.cca2}`} key={country.name.common} className="no-underline">
                                <Card key={country.name.common} className="h-full flex flex-col">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-2xl text-emerald-400 font-bold truncate">{country.name.common}</CardTitle>
                                        <CardDescription className="text-sm">{country.region}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow pb-2">
                                        <div className="aspect-video relative mb-3">
                                            <img
                                                src={country.flags.png || "/placeholder.svg"}
                                                alt={`Flag of ${country.name.common}`}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start gap-1 pt-0">
                                        <div className='flex justify-between w-full'>
                                            <p className="text-sm flex gap-2 items-center"><FaMapMarkedAlt /> {country.subregion || "N/A"}</p>
                                            <p className="text-sm flex gap-2 font-bold items-center">{country.cca2}</p>
                                        </div>
                                        <div className='flex justify-between w-full'>
                                            <p className="text-sm flex gap-2 items-center"><PiCityBold /> {country.capital?.[0] || "N/A"}</p>
                                            <p className="text-sm flex gap-2 items-center"><FaPeopleGroup /> {country.population.toLocaleString()}</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p>No countries found matching your criteria.</p>
                        <Button onClick={handleResetFilters} className="mt-4">
                            Reset Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {filteredCountries.length > 0 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {pageNumbers.map((number) => {
                                if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
                                    return (
                                        <PaginationItem key={number}>
                                            <PaginationLink isActive={currentPage === number} onClick={() => paginate(number)}>
                                                {number}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                } else if (
                                    (number === currentPage - 2 && currentPage > 3) ||
                                    (number === currentPage + 2 && currentPage < totalPages - 2)
                                ) {
                                    return (
                                        <PaginationItem key={number}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }
                                return null
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}

export default HomePage