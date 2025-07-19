"use client";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ChildrenType = {
    children: ReactNode;
};

type UserType = {
    uid:string;
    username: string;
    email: string;
    password: string;
    emailVerified: boolean;
    role:string;
};

type ContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    resendVerificationEmail: () => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<ContextType | null>(null);

export default function AuthContextProvider({ children }: ChildrenType) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const uid = currentUser.uid;
                fetchUserData(uid);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const fetchUserData = async (uid: string) => {
        const docRef = doc(db, "users", uid);
        try {
            const userDoc = await getDoc(docRef);
            const userData = userDoc.data();
            if (!userData) return;

            const userWithEmailVerified = {
                ...userData,
                emailVerified: auth.currentUser?.emailVerified || false,
            };

            setUser(userWithEmailVerified as UserType);
        } catch (e) {
            console.error("Error fetching user data:", e);
        }
    };

    const resendVerificationEmail = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                await sendEmailVerification(currentUser);
                alert("Verification email sent!");
            } catch (error) {
                console.error("Error sending verification email:", error);
                alert("Failed to send verification email.");
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null); 
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Failed to log out.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, resendVerificationEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};
