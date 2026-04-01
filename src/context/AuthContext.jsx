import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

// Mock database of authorized personnel and volunteers
const MOCK_USERS = {
  'admin@lakshmi.org': {
    uid: 'admin-001',
    name: 'Super Admin',
    email: 'admin@lakshmi.org',
    role: 'admin',
    password: 'adminpass' // In production, never ship passwords. This is for simulation!
  },
  'officer@lakshmi.org': {
    uid: 'officer-402',
    name: 'Field Officer Dev',
    email: 'officer@lakshmi.org',
    role: 'officer',
    password: 'secure123',
    region: 'Maharashtra'
  },
  'user@lakshmi.org': {
    uid: 'vol-8931',
    name: 'Dedicated Volunteer',
    email: 'user@lakshmi.org',
    role: 'user',
    password: 'volunteer',
    priority: 'Normal',
    impactPoints: 450
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [registeredUsers, setRegisteredUsers] = useState({});

  // Hydrate user and dynamic users from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('lakshmi_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedDynamicUsers = localStorage.getItem('lakshmi_registered_users');
    if (storedDynamicUsers) {
      setRegisteredUsers(JSON.parse(storedDynamicUsers));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase();
        // Check both initial mock database and registered database
        const user = MOCK_USERS[normalizedEmail] || registeredUsers[normalizedEmail];
        
        if (user && user.password === password) {
          const safeUser = { ...user };
          delete safeUser.password; // Strip password before saving to state
          
          setCurrentUser(safeUser);
          localStorage.setItem('lakshmi_user', JSON.stringify(safeUser));
          resolve(safeUser);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 800); // Simulate network latency
    });
  };

  const register = async (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const email = userData.email.toLowerCase();
        
        // Check if user already exists in mock state
        if (MOCK_USERS[email] || registeredUsers[email]) {
          return reject(new Error("An account already exists with this email"));
        }

        const uid = 'dynamic-' + Date.now();
        const newUser = {
          ...userData,
          uid: uid,
          email: email,
          createdAt: new Date()
        };

        // 1. Sync with Firestore (Optional catch for no-config environments)
        try {
          const userRef = doc(db, 'users', uid);
          await setDoc(userRef, {
            ...newUser,
            password: 'PROTECTED', // Don't store plain text password in Firestore
            timestamp: serverTimestamp()
          });

          // Also add to role-specific collections for Dashboard tracking
          if (userData.role === 'user') {
            await setDoc(doc(db, 'volunteers', uid), {
              fullName: userData.name,
              email: email,
              interest: userData.interest || 'General',
              priority: 'Normal',
              createdAt: serverTimestamp()
            });
          } else if (userData.role === 'officer') {
            await setDoc(doc(db, 'officers', uid), {
              fullName: userData.name,
              email: email,
              region: userData.region,
              status: 'Active',
              createdAt: serverTimestamp()
            });
          }
        } catch (fsError) {
          console.warn("Firestore sync failed (Mock only mode active):", fsError.message);
        }

        // 2. Update Local State (Persistence Fallback)
        const updatedDynamicUsers = {
          ...registeredUsers,
          [email]: newUser
        };

        setRegisteredUsers(updatedDynamicUsers);
        localStorage.setItem('lakshmi_registered_users', JSON.stringify(updatedDynamicUsers));

        const safeUser = { ...newUser };
        delete safeUser.password;
        setCurrentUser(safeUser);
        localStorage.setItem('lakshmi_user', JSON.stringify(safeUser));
        
        resolve(safeUser);
      } catch (err) {
        reject(err);
      }
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lakshmi_user');
    toast.info("Logged out successfully");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
