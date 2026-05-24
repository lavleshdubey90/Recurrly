import '@/global.css';
import { useAuth } from '@clerk/expo';
import clsx from 'clsx';
import { styled } from "nativewind";
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut, isLoaded } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="mb-6 text-3xl font-sans-bold text-primary">Settings</Text>

        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="mb-4 text-lg font-sans-bold text-primary">Account</Text>

          <Pressable
            className={clsx('auth-button', isSigningOut && 'auth-button-disabled')}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#081126" />
            ) : (
              <Text className="auth-button-text">Sign Out</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings;