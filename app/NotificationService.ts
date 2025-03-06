import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function setupNotificationListener() {
  messaging().onMessage(async (remoteMessage) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
      },
      trigger: null,
    });
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Push Notification received in background:", remoteMessage);
  });
}
