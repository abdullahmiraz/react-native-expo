import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestPushPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    Alert.alert("Permission Denied", "Enable push notifications in settings.");
    return null;
  }

  return await messaging().getToken();
}
