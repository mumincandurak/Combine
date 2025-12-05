import React, { createContext, useState, useContext, useEffect } from "react";
import authStorage from "../auth/storage";
import apiClient from "../api/client";
import { COLORS } from "../screens/colors"; // Simülasyon verisi için eklendi
import * as Location from "expo-location"; // <-- eklendi

const AuthContext = createContext();

// Simülasyon verisi (Başlangıçta user bununla doluyor)
const dummyUserProfile = {
    name: "Elisa Yıldırım",
    location: "Istanbul, TR",
    profileImageUrl: "https://via.placeholder.com/150/FFFFFF/1B1229?text=User",
    favoriteColors: [COLORS.primary, COLORS.secondary, "#d1c4e9"],
    stylePreferences: ["Casual", "Minimalist"],
    importantDates: [
        { id: "1", title: "Doğum Günü", date: "2025-11-20" },
        { id: "2", title: "Proje Sunumu", date: "2025-12-15" },
    ],
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(dummyUserProfile);
    const [token, setToken] = useState(null);

    // --- KONUM ALMA (UYGULAMA AÇILDIĞINDA) ---
    useEffect(() => {
        (async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Location permission denied");
                    return;
                }

                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };

                const places = await Location.reverseGeocodeAsync(coords);
                if (places && places.length > 0) {
                    const place = places[0];
                    // Semt / mahalle için çeşitli alanları kontrol et (provider'a göre farklılık olabilir)
                    const neighborhood =
                        place.subregion ||
                        place.district ||
                        place.name ||
                        place.street ||
                        "";
                    const city =
                        place.city || place.region || place.subregion || "";
                    const country = place.country || "";

                    // İnsan okunur bir lokasyon string'i oluştur
                    const locationString = [
                        neighborhood && neighborhood.trim(),
                        city && city.trim(),
                        country && country.trim(),
                    ]
                        .filter(Boolean)
                        .join(", ");

                    // Kullanıcı objesini güncelle
                    setUser((current) => ({
                        ...current,
                        location: locationString || current.location,
                        neighborhood:
                            neighborhood || current.neighborhood || "",
                    }));
                }
            } catch (err) {
                console.warn("Failed to get device location", err);
            }
        })();
    }, []);

    // --- KULLANICI GÜNCELLEME ---
    // Profil düzenleme ekranlarında bu fonksiyonu kullanıyoruz.
    const updateUser = (newUserData) => {
        setUser((currentUser) => ({
            ...currentUser,
            ...newUserData,
        }));
    };

    const login = async (email, password) => {
        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });
            console.log("Login response:", response.data);

            if (response.data.token) {
                setToken(response.data.token);
                apiClient.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data.token}`;
                await authStorage.storeToken(response.data.token);

                if (response.data.user) {
                    setUser(response.data.user);
                }
                return true;
            }
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common["Authorization"];
        await authStorage.removeToken();
    };

    const restoreToken = async () => {
        const storedToken = await authStorage.getToken();
        if (storedToken) {
            setToken(storedToken);
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${storedToken}`;
            // Token varsa burada normalde kullanıcı verisini çekmek gerekir.
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, user, login, logout, restoreToken, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
