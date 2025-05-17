import { Link } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FaPeopleGroup } from "react-icons/fa6"
import { PiCityBold } from "react-icons/pi"
import { FaMapMarkedAlt } from "react-icons/fa"

const CountryCard = ({ country }) => {
    return (
        <Link to={`/country/${country.cca2}`} className="no-underline">
            <Card className="h-full flex flex-col p-3 md:p-2 hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-2xl text-emerald-400 font-bold truncate">
                        {country.name.common}
                    </CardTitle>
                    <CardDescription className="text-sm">
                        {country.region}
                    </CardDescription>
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
                        <p className="text-sm flex gap-2 items-center">
                            <FaMapMarkedAlt /> {country.subregion || "N/A"}
                        </p>
                        <p className="text-sm flex gap-2 font-bold items-center">
                            {country.cca2}
                        </p>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p className="text-sm flex gap-2 items-center">
                            <PiCityBold /> {country.capital?.[0] || "N/A"}
                        </p>
                        <p className="text-sm flex gap-2 items-center">
                            <FaPeopleGroup /> {country.population.toLocaleString()}
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default CountryCard