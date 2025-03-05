import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Share,
} from "react-native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

// Deep linking config
const prefix = Linking.createURL("/");

export default function HomeScreen() {
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch names from the API
    fetch("http://localhost:3000/api/names")
      .then((res) => res.json())
      .then((data) => {
        setNames(data);
        setLoading(false);
      });

    // Handle deep linking
    const handleDeepLink = (event: { url: string }) => {
      const { path } = Linking.parse(event.url);
      if (path) {
        setSelectedName(decodeURIComponent(path)); // Extract "NAME" from myapp://NAME
      }
    };

    // Listen for deep linking
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened with a link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //   const handleShare = async (name: string) => {
  //     const url = `myapp://${name}`;
  //     await Share.share({ message: `Check out this page: ${url}` });
  //   };
  const handleShare = async (name: string) => {
    const appLink = `myapp://${name}`;
    const webLink = `http://localhost:3000/name/${name}`;

    await Share.share({
      message: `Check out this page: ${appLink}\nIf you don't have the app, visit: ${webLink}`,
    });
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Notification from ${selectedName}`,
        body: "Someone sent a notification!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {!selectedName ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Available Pages
          </Text>
          <FlatList
            data={names}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedName(item)}>
                <Text style={{ fontSize: 18, marginVertical: 10 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            This page is for {selectedName}
          </Text>
          <Button
            title="Share Link"
            onPress={() => handleShare(selectedName)}
          />
          <Button title="Send Notification" onPress={sendNotification} />
        </>
      )}
    </View>
  );
}
