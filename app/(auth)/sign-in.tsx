import '@/global.css';
import { useSignIn } from '@clerk/expo';
import clsx from 'clsx';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [localErrors, setLocalErrors] = React.useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!emailAddress) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(emailAddress)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLocalErrors({});

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        if (error.code === 'form_identifier_not_found') {
          setLocalErrors({ email: 'No account found with this email' });
        } else if (error.code === 'form_password_incorrect') {
          setLocalErrors({ password: 'Incorrect password' });
        } else {
          setLocalErrors({ email: error.message || 'Something went wrong' });
        }
        return;
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl('/(tabs)');
            router.replace(url as any);
          },
        });
      } else if (signIn.status === 'needs_second_factor') {
        // Handle 2FA if needed
      } else if (signIn.status === 'needs_client_trust') {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === 'email_code',
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      }
    } catch (error) {
      setLocalErrors({ email: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl('/(tabs)');
            router.replace(url as any);
          },
        });
      }
    } catch (error) {
      setLocalErrors({ email: 'Invalid verification code' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signIn.status === 'needs_client_trust') {
    return (
      <SafeAreaView className="auth-safe-area">
        <ScrollView className="auth-scroll" contentContainerClassName="auth-content">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurrly</Text>
                <Text className="auth-wordmark-sub">Subscriptions</Text>
              </View>
            </View>
          </View>

          <View className="auth-card">
            <Text className="auth-title">Verify your account</Text>
            <Text className="auth-subtitle">Enter the 6-digit code sent to your email</Text>

            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Verification Code</Text>
                <TextInput
                  className={clsx('auth-input', localErrors.email && 'auth-input-error')}
                  value={code}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  onChangeText={(code) => {
                    setCode(code);
                    setLocalErrors({});
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  autoFocus
                />
                {localErrors.email && <Text className="auth-error">{localErrors.email}</Text>}
              </View>

              <Pressable
                className={clsx('auth-button', isSubmitting && 'auth-button-disabled')}
                onPress={handleVerify}
                disabled={isSubmitting || code.length !== 6}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Verify</Text>
                )}
              </Pressable>

              <Pressable
                className="auth-secondary-button"
                onPress={() => signIn.mfa.sendEmailCode()}
              >
                <Text className="auth-secondary-button-text">Resend Code</Text>
              </Pressable>

              <Pressable
                className="auth-secondary-button"
                onPress={() => {
                  signIn.reset();
                  setCode('');
                  setLocalErrors({});
                }}
              >
                <Text className="auth-secondary-button-text">Start Over</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView className="auth-scroll" contentContainerClassName="auth-content">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Recurrly</Text>
              <Text className="auth-wordmark-sub">Subscriptions</Text>
            </View>
          </View>
        </View>

        <View className='items-center'>
          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">Sign in to manage your subscriptions</Text>
        </View>

        <View className="auth-card">

          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email</Text>
              <TextInput
                className={clsx('auth-input', localErrors.email && 'auth-input-error')}
                value={emailAddress}
                placeholder="your@email.com"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ paddingHorizontal: 8 }}
                onChangeText={(email) => {
                  setEmailAddress(email);
                  setLocalErrors({ ...localErrors, email: undefined });
                }}
              />
              {localErrors.email && <Text className="auth-error">{localErrors.email}</Text>}
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                className={clsx('auth-input', localErrors.password && 'auth-input-error')}
                value={password}
                placeholder="••••••••"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                secureTextEntry
                style={{ paddingHorizontal: 8 }}
                onChangeText={(pwd) => {
                  setPassword(pwd);
                  setLocalErrors({ ...localErrors, password: undefined });
                }}
              />
              {localErrors.password && <Text className="auth-error">{localErrors.password}</Text>}
            </View>

            <Pressable
              className={clsx('auth-button', isSubmitting && 'auth-button-disabled')}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Sign In</Text>
              )}
            </Pressable>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">or</Text>
              <View className="auth-divider-line" />
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}