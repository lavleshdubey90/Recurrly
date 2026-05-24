import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from "./_layout";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user, isLoaded } = useUser();
  const { subscriptions, addSubscription } = useSubscriptions();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const getDisplayName = () => {
    if (!user) return 'Loading...';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.emailAddresses[0]?.emailAddress || 'User';
  };

  const getAvatarSource = () => {
    if (user?.imageUrl) {
      return { uri: user.imageUrl };
    }
    return images.avatar;
  };

  const handleSubscriptionCreated = (newSubscription: any) => {
    addSubscription(newSubscription);
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-5">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={getAvatarSource()} className="home-avatar" />
                  <Text className="home-user-name">{getDisplayName()}</Text>
                </View>

                <Pressable onPress={() => setIsModalVisible(true)}>
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>

              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>
                <View className="home-balance-row">
                  <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                  <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
                </View>
              </View>

              <View className="mb-5">
                <ListHeading title="Upcoming" />
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => <UpcomingSubscriptionCard data={item} currency="USD" />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text>}
                />
              </View>

              <ListHeading title="Subscriptions" />
            </>
          )}
          data={subscriptions}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => setExpandedSubscriptionId(expandedSubscriptionId === item.id ? null : item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListEmptyComponent={<Text className="home-empty-state">No subscriptions</Text>}
          contentContainerClassName="pb-26"
        />
      </SafeAreaView>

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubscriptionCreated={handleSubscriptionCreated}
      />
    </>
  );
}