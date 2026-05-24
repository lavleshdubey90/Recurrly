import '@/global.css';
import { useAuth, useSignUp } from '@clerk/expo';
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

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [localErrors, setLocalErrors] = React.useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (!emailAddress) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(emailAddress)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLocalErrors({});

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        if (error.code === 'form_identifier_exists') {
          setLocalErrors({ email: 'An account with this email already exists' });
        } else {
          setLocalErrors({ email: error.message || 'Something went wrong' });
        }
        return;
      }

      if (!error) await signUp.verifications.sendEmailCode();
    } catch (error) {
      setLocalErrors({ email: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl('/(tabs)');
            router.replace(url as any);
          },
        });
      } else {
        setLocalErrors({ email: 'Sign-up attempt not complete' });
      }
    } catch (error) {
      setLocalErrors({ email: 'Invalid verification code' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
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

          <View className="items-center">
            <Text className="auth-title">Verify your email</Text>
            <Text className="auth-subtitle">Enter the 6-digit code sent to your email</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Verification Code</Text>
                <TextInput
                  className={clsx('auth-input', localErrors.email && 'auth-input-error')}
                  value={code}
                  style={{ paddingHorizontal: 8 }}
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
                onPress={() => signUp.verifications.sendEmailCode()}
              >
                <Text className="auth-secondary-button-text">Resend Code</Text>
              </Pressable>

              <Pressable
                className="auth-secondary-button"
                onPress={() => {
                  signUp.reset();
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
          <Text className="auth-title">Create account</Text>
          <Text className="auth-subtitle">Start managing your subscriptions today</Text>
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
              {!localErrors.password && password && (
                <Text className="auth-helper">8+ characters, uppercase, lowercase, number</Text>
              )}
            </View>

            <View className="auth-field">
              <Text className="auth-label">Confirm Password</Text>
              <TextInput
                className={clsx('auth-input', localErrors.confirmPassword && 'auth-input-error')}
                value={confirmPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                secureTextEntry
                style={{ paddingHorizontal: 8 }}
                onChangeText={(pwd) => {
                  setConfirmPassword(pwd);
                  setLocalErrors({ ...localErrors, confirmPassword: undefined });
                }}
              />
              {localErrors.confirmPassword && <Text className="auth-error">{localErrors.confirmPassword}</Text>}
            </View>

            <Pressable
              className={clsx('auth-button', isSubmitting && 'auth-button-disabled')}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="auth-button-text">Create Account</Text>
              )}
            </Pressable>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">or</Text>
              <View className="auth-divider-line" />
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}