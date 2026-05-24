# Recurrly 📱

A modern subscription management mobile application built with React Native and Expo. Track, manage, and optimize your recurring subscriptions with a beautiful, intuitive interface.

![Expo](https://img.shields.io/badge/Expo-54.0.33-000?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- **🔐 Secure Authentication** - Sign in and sign up with Clerk authentication
- **📊 Dashboard Overview** - View your total subscription balance and upcoming renewals at a glance
- **📋 Subscription Management** - Add, view, and manage all your subscriptions in one place
- **🎨 Beautiful UI** - Modern, clean interface with custom design system
- **💳 Detailed Insights** - Track payment methods, billing cycles, categories, and renewal dates
- **🌙 Dark Mode Ready** - Automatic UI style adaptation
- **📱 Cross-Platform** - Works on iOS, Android, and Web

## 🚀 Tech Stack

- **Framework**: Expo SDK ~54.0.33
- **Language**: TypeScript
- **UI**: React Native 0.81.5
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Clerk
- **Analytics**: PostHog
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Expo Vector Icons
- **Date Handling**: Day.js
- **Fonts**: Plus Jakarta Sans

## 📁 Project Structure

```
recurrly/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.tsx      # Auth layout
│   │   ├── sign-in.tsx      # Sign in screen
│   │   └── sign-up.tsx      # Sign up screen
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── _layout.tsx      # Tab layout with context
│   │   ├── index.tsx        # Home screen
│   │   ├── insights.tsx     # Insights screen
│   │   └── subscriptions/   # Subscription details
│   ├── _layout.tsx          # Root layout with providers
│   └── Onboarding.tsx       # Onboarding screen
├── components/              # Reusable UI components
│   ├── ListHeading.tsx      # Section heading component
│   ├── SubscriptionCard.tsx # Subscription card component
│   └── UpcomingSubscriptionCard.tsx
├── constants/              # App constants
│   ├── data.ts             # Mock data and tab configuration
│   ├── icons.ts            # Icon mappings
│   ├── images.ts           # Image assets
│   └── theme.ts            # Design system (colors, spacing)
├── lib/                    # Utility functions
│   └── utils.ts            # Formatters (currency, date, etc.)
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts
│   ├── icons/              # App icons
│   └── images/             # Images
└── global.css              # Global styles with Tailwind
```

## 🎨 Design System

Recurrly uses a custom design system built with Tailwind CSS:

- **Colors**: Warm cream-based palette with dark accents
  - Background: `#fff9e3`
  - Primary: `#081126`
  - Accent: `#ea7a53`
  - Card: `#fff8e7`
- **Typography**: Plus Jakarta Sans (Light, Regular, Medium, SemiBold, Bold, ExtraBold)
- **Spacing**: Custom spacing scale from 0-30
- **Components**: Floating tab bar, rounded cards, modal sheets

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recurrly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Clerk publishable key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication publishable key | Yes |
| `EXPO_PUBLIC_POSTHOG_KEY` | PostHog analytics key | Optional |
| `EXPO_PUBLIC_POSTHOG_HOST` | PostHog host URL | Optional |

## 📱 Screens

### Home Screen
- User profile display with avatar
- Balance card showing total subscription costs
- Horizontal scroll of upcoming subscriptions
- Expandable subscription cards with detailed information

### Authentication Screens
- Sign in with email and password
- Sign up with email and password
- Email verification for new accounts
- Form validation and error handling

### Subscription Cards
- Service name and icon
- Price and billing cycle
- Expandable details:
  - Payment method
  - Category
  - Start date
  - Renewal date
  - Status (active, paused, cancelled)

## 🧩 Key Components

- **SubscriptionCard**: Displays subscription information with expand/collapse functionality
- **UpcomingSubscriptionCard**: Shows subscriptions renewing soon
- **ListHeading**: Section headers with optional action buttons
- **CreateSubscriptionModal**: Modal for adding new subscriptions

## 🎯 Features in Development

- [ ] Complete Insights screen with analytics
- [ ] Settings screen
- [ ] Subscription editing and deletion
- [ ] Push notifications for renewal reminders
- [ ] Data persistence with backend integration
- [ ] Category filtering and sorting
- [ ] Export subscription data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Authentication powered by [Clerk](https://clerk.com/)
- Icons from [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- Font: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

---

Made with ❤️ using Expo and React Native
