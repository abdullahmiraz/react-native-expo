import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { requestPushPermission } from "./firebaseConfig";
import useDeepLinking from "./DeepLinkHandler";
import { setupNotificationListener } from "./NotificationService";

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useDeepLinking(setSelectedName);

  useEffect(() => {
    fetch("http://localhost:3000/api/names")
      .then((res) => res.json())
      .then((data) => {
        setNames(data);
        setLoading(false);
      });

    setupNotificationListener();
    requestPushPermission();
  }, []);

  const handleShare = async (name: string) => {
    const appLink = `myapp://name/${name}`;
    const webLink = `http://localhost:3000/name/${name}`;

    await Clipboard.setStringAsync(appLink);
    alert("Link copied to clipboard!");

    Linking.openURL(appLink);
  };

  const sendNotification = async () => {
    const token = await requestPushPermission();

    if (!token) {
      alert("Push notifications not enabled!");
      return;
    }

    await fetch("http://localhost:3000/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name: selectedName }),
    });

    alert("Notification sent!");
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {!selectedName ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Available Pages</Text>
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
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>This page is for {selectedName}</Text>
          <Button title="Share Link" onPress={() => handleShare(selectedName)} />
          <Button title="Send Notification" onPress={sendNotification} />
        </>
      )}
    </View>
  );
}
