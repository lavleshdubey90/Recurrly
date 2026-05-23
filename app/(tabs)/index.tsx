import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 justify-center bg-background p-5">
      <Text className="text-5xl font-bold text-primary font-sans-extrabold">
        Home
      </Text>
      <Link href="/Onboarding" className="mt-4 font-sans-bold p-4 bg-primary rounded-lg">
        <Text className="text-white">Go to Onboarding</Text>
      </Link>

      <Link href="/subscriptions" className="mt-4 font-sans-bold p-4 bg-primary rounded-lg">
        <Text className="text-white">Go to Subscriptions</Text>
      </Link>

      <Link href="/subscriptions/:hello" className="mt-4 font-sans-bold p-4 bg-primary rounded-lg">
        <Text className="text-white">Go to Subscriptions</Text>
      </Link>

    </SafeAreaView>
  );
}