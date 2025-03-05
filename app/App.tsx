import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import HomeScreen from "./index";
import React from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("No permission for notifications!");
      }
    };
    registerForPushNotifications();
  }, []);

  return <HomeScreen />;
}
