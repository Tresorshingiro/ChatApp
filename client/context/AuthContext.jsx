import { createContext, useState, useEffect } from "react";
import axios from "axios"
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children })=> {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // check if user is authenticated
    const checkAuth = async () => {
        try{
            const {data} = await axios.get("/api/auth/check");
            if(data.success) {
                setAuthUser(data.user)
                connectSocket(data.user);
            }
        } catch(error) {
            console.log("Auth check error:", error);
            // Clear invalid token
            localStorage.removeItem("token");
            setToken(null);
            axios.defaults.headers.common["token"] = null;
        }
    }

    //login function to handle user authentication
    const login = async (state, credentials) => {
    try {
        const { data } = await axios.post(`/api/auth/${state}`, credentials);
        if(data.success) {
            // Set token first
            localStorage.setItem("token", data.token);
            setToken(data.token);
            axios.defaults.headers.common["token"] = data.token;
            
            // Then set user
            setAuthUser(data.userData);
            connectSocket(data.userData);
            
            toast.success(data.message);
            return true;
        }
        toast.error(data.message);
        return false;
    } catch(error) {
        console.log("Login error:", error);
        toast.error(error.response?.data?.message || error.message);
        return false;
    }
}

    //logout function to logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout successful");
        if(socket) {
            socket.disconnect();
            setSocket(null);
        }
    }

    //Update profile function to handle user profile
    const updateProfile = async(body) => {
    try{
        // Ensure token is set in headers
        if(token) {
            axios.defaults.headers.common["token"] = token;
        }
        
        const { data } = await axios.put("/api/auth/update-profile", body);
        if(data.success) {
            setAuthUser(data.user);
            toast.success("Profile updated successfully");
        } else {
            toast.error(data.message);
        }
    } catch(error){
        console.log("Update profile error response:", error.response);
        if(error.response?.status === 401) {
            // Token is invalid - force logout
            logout();
            toast.error("Session expired. Please login again.");
        } else {
            toast.error(error.response?.data?.message || error.message);
        }
    }
}

    //connect socket function - FIX: Use parameter name correctly
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        
        const newSocket = io(backendUrl, {
            query: {userId: userData._id}
        });
        
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    }

    useEffect(() => {
        if(token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, [token])

    const value = {
        axios,
        authUser,
        setAuthUser,
        token,
        setToken,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login,
        logout,
        updateProfile
    }
    
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}