import { useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

/**
 * useLocationTracker - A professional hook for real-time volunteer tracking.
 * Captures geolocation coordinates and syncs with Firestore for admin oversight.
 */
export const useLocationTracker = () => {
  const { currentUser } = useAuth();
  const watchId = useRef(null);

  useEffect(() => {
    // Only track if the user is a volunteer (role: 'user')
    if (!currentUser || currentUser.role !== 'user' || !currentUser.uid) {
      return;
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const updateLocation = async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      try {
        const volunteerRef = doc(db, 'volunteers', currentUser.uid);
        await updateDoc(volunteerRef, {
          liveLocation: {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy,
            lastSeen: serverTimestamp()
          },
          isOnline: true
        });
      } catch (err) {
        console.error("Failed to update live location:", err);
      }
    };

    const handleError = (error) => {
       switch(error.code) {
         case error.PERMISSION_DENIED:
           toast.warning("Location access is required for mission safety tracking.", { toastId: 'loc-denied' });
           break;
         case error.POSITION_UNAVAILABLE:
           console.warn("Location information is unavailable.");
           break;
         case error.TIMEOUT:
           console.warn("The request to get user location timed out.");
           break;
         default:
           console.error("An unknown error occurred in geolocation.");
       }
    };

    // Begin watching position (high accuracy for live tracking)
    watchId.current = navigator.geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      maximumAge: 30000, // 30 seconds
      timeout: 27000
    });

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        
        // Set offline status on cleanup (logout/close) if possible
        const setOffline = async () => {
           try {
              const volunteerRef = doc(db, 'volunteers', currentUser.uid);
               await updateDoc(volunteerRef, { isOnline: false });
            } catch (err) {
               console.warn("Failed to set offline status:", err.message);
            }
        };
        setOffline();
      }
    };
  }, [currentUser]);

  return null;
};
