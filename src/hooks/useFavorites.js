import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useFavorites = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setFavorites(user?.unsafeMetadata?.favorites || []);
        } else {
            setFavorites([]);
        }
    }, [isLoaded, isSignedIn, user]);

    const toggleFavorite = async (code) => {
        if (!isSignedIn) {
            navigate("/sign-in")
            return;
        }

        const currentFavorites = favorites || [];

        const isRemoving = currentFavorites.includes(code);

        const updatedFavorites = currentFavorites.includes(code)
            ? currentFavorites.filter((c) => c !== code)
            : [...currentFavorites, code];

        await user.update({
            unsafeMetadata: {
                favorites: updatedFavorites,
            },
        });

        setFavorites(updatedFavorites);

        toast(
            isRemoving
                ? "Removed from favorites 💔"
                : "Added to favorites ❤️"
        );
    };

    const isFavorite = (code) => favorites.includes(code);

    return { favorites, toggleFavorite, isFavorite };
};
