import { useEffect } from "react";
import { Linking } from "react-native";

export default function useDeepLinking(setSelectedName: (name: string | null) => void) {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { path } = Linking.parseURL(event.url);
      if (path) {
        setSelectedName(decodeURIComponent(path));
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
