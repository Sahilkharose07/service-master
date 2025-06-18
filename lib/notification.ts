import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const configurePushNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission not granted for notifications');
  }
};

export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null, 
  });
};
