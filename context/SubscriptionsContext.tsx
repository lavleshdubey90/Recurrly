import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React from "react";

interface SubscriptionsContextType {
  subscriptions: typeof HOME_SUBSCRIPTIONS;
  addSubscription: (subscription: typeof HOME_SUBSCRIPTIONS[0]) => void;
}

const SubscriptionsContext = React.createContext<SubscriptionsContextType | undefined>(undefined);

export const SubscriptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const useSubscriptions = () => {
  const context = React.useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
};
