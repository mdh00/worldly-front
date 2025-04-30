import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from './ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  const { user } = useUser();

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
                font-extrabold border border-indigo-950 rounded-md p-5 text-sm md:text-lg flex cursor-pointer items-center transition-all duration-300
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
            <div className="flex items-center space-x-4">
              <p className={`
              font-extrabold text-sm md:text-2xl flex items-center transition-all duration-300
              ${scrolled
                  ? 'text-emerald-400'
                  : 'text-indigo-950'
                }
            `}>
                Hi, {user?.firstName || user?.username || "there"} 👋
              </p>
              <UserButton />
            </div>
          </SignedIn>

        </div>
      </div>
    </header>
  );
};

export default Header;