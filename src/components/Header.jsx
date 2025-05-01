import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { useFavorites } from '../hooks/useFavorites';
import { FaHeart } from "react-icons/fa";
import { getCountryByCode } from '@/api/service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favorites && favorites.length > 0) {
        setLoading(true);
        try {
          const countriesData = await Promise.all(
            favorites.map(code => getCountryByCode(code))
          );
          setFavoriteCountries(countriesData);
        } catch (error) {
          console.error("Error fetching favorite countries:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFavoriteCountries([]);
      }
    };

    fetchFavoriteCountries();
  }, [favorites]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black shadow-lg h-16'
        : 'bg-emerald-400 h-16'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo*/}
          <a
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className={`
              font-extrabold text-2xl md:text-4xl flex items-center transition-all duration-300
              ${scrolled
                ? 'text-emerald-400'
                : 'text-indigo-950'
              }
            `}>
              <span className="mr-2">Worldly</span>
              <span className="transform transition-transform group-hover:rotate-12 inline-block">🌏</span>
            </div>
          </a>
          <SignedOut>
            <Button
              variant="default"
              onClick={() => window.Clerk.openSignIn({})}
              className={`
                font-extrabold border border-indigo-950 rounded-md md:p-5 text-sm md:text-lg flex cursor-pointer items-center transition-all duration-300
                ${scrolled
                  ? 'text-indigo-950 bg-emerald-400'
                  : 'text-emerald-400'
                }
              `}
            >
              Sign In
            </Button>
          </SignedOut>

          <SignedIn>
            <div className='flex items-center space-x-2 md:space-x-4'>

              <Tooltip>
                <TooltipProvider>
                  <TooltipTrigger>
                    {/* Favorites Dropdown*/}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`
                              flex items-center space-x-2 rounded-md transition-all duration-300
                              ${scrolled
                              ? 'text-emerald-400'
                              : 'text-indigo-950'
                            }
                            `}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <FaHeart className="text-lg md:text-2xl cursor-pointer" />
                            {/* <span className="hidden md:block font-medium text-sm md:text-xs">Favorites</span> */}
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>
                        ) : favoriteCountries.length > 0 ? (
                          favoriteCountries.map((country) => (
                            <DropdownMenuItem key={country.cca2} asChild>
                              <a
                                href={`/country/${country.cca2}`}
                                className="flex items-center w-full px-2 py-1 cursor-pointer"
                              >
                                <img
                                  src={country.flags.svg || country.flags.png}
                                  alt={`${country.name.common} flag`}
                                  className="w-8 h-6 object-cover rounded mr-3"
                                />
                                <span className="font-medium">{country.name.common}</span>
                              </a>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-700">No favorites yet</div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Favorites</p>
                  </TooltipContent>
                </TooltipProvider>
              </Tooltip>
              <p className={`
                  font-bold text-sm md:text-xl flex items-center transition-all duration-300
                  ${scrolled
                  ? 'text-emerald-400'
                  : 'text-indigo-950'
                }
                `}>
                Hi, {user?.firstName || user?.username || "there"}
              </p>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header >
  );
};

export default Header;