import { HOME_SUBSCRIPTIONS, tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SubscriptionsContext = React.createContext<{
  subscriptions: typeof HOME_SUBSCRIPTIONS;
  addSubscription: (subscription: typeof HOME_SUBSCRIPTIONS[0]) => void;
} | undefined>(undefined);

export const useSubscriptions = () => {
  const context = React.useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
};

const SubscriptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = React.useState(HOME_SUBSCRIPTIONS);

  const addSubscription = (subscription: typeof HOME_SUBSCRIPTIONS[0]) => {
    setSubscriptions([subscription, ...subscriptions]);
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

const TabIcon = ({ focused, icon }: TabIconProps) => {
    return <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
            <Image source={icon} resizeMode="contain" className="tabs-glyph" />
        </View>
    </View>;
};

const tabBar = components.tabBar;

interface TabIconProps {
    focused: boolean;
    icon: any;
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <SubscriptionsProvider>
            <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                height: tabBar.height,
                marginHorizontal: tabBar.horizontalInset,
                borderRadius: tabBar.radius,
                backgroundColor: colors.primary,
                borderTopWidth: 0,
                elevation: 0
            },
            tabBarItemStyle: {
                paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
            },
            tabBarIconStyle: {
                width: tabBar.iconFrame,
                height: tabBar.iconFrame,
                alignItems: 'center',
            }
        }}>
            {tabs.map((tab: AppTab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => <View>
                            <TabIcon focused={focused} icon={tab.icon} />
                        </View>
                    }}
                />
            ))}
            <Tabs.Screen
                name="subscriptions/[id]"
                options={{ href: null }}
            />
        </Tabs>
        </SubscriptionsProvider>
    )
}