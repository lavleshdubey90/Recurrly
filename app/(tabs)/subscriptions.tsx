import SubscriptionCard from "@/components/SubscriptionCard";
import "@/global.css";
import clsx from "clsx";
import { styled } from "nativewind";
import React from 'react';
import { FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from "./_layout";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<string | null>(null);

  const filteredSubscriptions = subscriptions.filter((subscription: any) => {
    const query = searchQuery.toLowerCase();
    return (
      subscription.name.toLowerCase().includes(query) ||
      subscription.category?.toLowerCase().includes(query) ||
      subscription.plan?.toLowerCase().includes(query) ||
      subscription.billing.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="mb-4 text-2xl font-sans-bold text-primary">Subscriptions</Text>

        <View className="mb-5">
          <TextInput
            className={clsx('auth-input', 'mb-2')}
            value={searchQuery}
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            style={{ paddingHorizontal: 8 }}
            autoCapitalize="none"
            onChangeText={setSearchQuery}
          />
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'subscription' : 'subscriptions'} found
          </Text>
        </View>

        <FlatList
          data={filteredSubscriptions}
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
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-base font-sans-medium text-muted-foreground">
                {searchQuery ? 'No subscriptions match your search' : 'No subscriptions found'}
              </Text>
            </View>
          }
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Subscriptions;