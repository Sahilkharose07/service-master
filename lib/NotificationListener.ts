// lib/notificationListener.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { databases } from './appwrite';
import { Query } from 'appwrite';
import { useEffect } from 'react';

// Replace with your actual Appwrite database and collection IDs
const DATABASE_ID = '681c428b00159abb5e8b';
const NOTIFICATIONS_COLLECTION_ID = 'note_id';

export const useNotificationListener = (userEmail: string) => {
  useEffect(() => {
    if (!userEmail) return;

    let intervalId: ReturnType<typeof setInterval>;

    const checkNotifications = async () => {
      try {
        // Fetch only unread notifications for this user
        const response = await databases.listDocuments(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          [
            Query.equal('userEmail', userEmail), // Only this user's notifications
            Query.equal('isRead', false),        // Only unread ones
            Query.orderDesc('$createdAt'),       // Most recent first
            Query.limit(1),                      // Just get the latest
          ]
        );

        if (response.documents.length > 0) {
          const note = response.documents[0];

          // Show a local push notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'New Service Assigned',
              body: note.description || 'You have a new notification.',
              sound: true,
            },
            trigger: null, 
          });

        
          await databases.updateDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION_ID,
            note.$id,
            { isRead: true }
          );
        }
      } catch (error) {
        console.log('Notification check failed:', error);
      }
    };

    if (Device.isDevice) {
      intervalId = setInterval(checkNotifications, 3000); 
    }

    return () => clearInterval(intervalId);
  }, [userEmail]);
};
