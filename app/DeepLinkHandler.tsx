import { useEffect } from "react";
import { Linking } from "react-native";

export default function useDeepLinking(
  setSelectedName: (name: string | null) => void
) {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      try {
        const { pathname: path } = new URL(event.url); // Parse the URL using the native URL constructor
        if (path) {
          // Extract the name part from the path
          setSelectedName(decodeURIComponent(path.split("/")[1])); // Assuming URL is in the format: myapp://name
        }
      } catch (error) {
        console.error("Error parsing deep link:", error);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if the app was opened with a deep link (initial launch with URL)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove(); // Clean up the event listener
    };
  }, [setSelectedName]); // Adding `setSelectedName` to dependencies
}
