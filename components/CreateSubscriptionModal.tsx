import { icons } from "@/constants/icons";
import "@/global.css";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscriptionCreated: (subscription: Subscription) => void;
}

interface Subscription {
  id: string;
  name: string;
  price: number;
  frequency: "Monthly" | "Yearly";
  category: string;
  status: string;
  startDate: string;
  renewalDate: string;
  icon: any;
  billing: string;
  color: string;
  plan?: string;
  paymentMethod?: string;
}

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Entertainment": "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  "Design": "#f5c542",
  "Productivity": "#b8e8d0",
  "Cloud": "#d4e5f7",
  "Music": "#1db954",
  "Other": "#f6eecf",
};

const CreateSubscriptionModal = ({ visible, onClose, onSubscriptionCreated }: CreateSubscriptionModalProps) => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [frequency, setFrequency] = React.useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ name?: string; price?: string; category?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { name?: string; price?: string; category?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const priceNum = parseFloat(price);
      const now = dayjs();
      const renewalDate = frequency === "Monthly" ? now.add(1, "month") : now.add(1, "year");

      const newSubscription: Subscription = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        price: priceNum,
        frequency,
        category,
        status: "active",
        startDate: now.toISOString(),
        renewalDate: renewalDate.toISOString(),
        icon: icons.wallet,
        billing: frequency,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"],
        plan: frequency,
        paymentMethod: "Not Provided",
      };

      onSubscriptionCreated(newSubscription);

      // Reset form
      setName("");
      setPrice("");
      setFrequency("Monthly");
      setCategory("");
      setErrors({});

      onClose();
    } catch (error) {
      console.error("Error creating subscription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">
                  <Image source={require("../assets/icons/add.png")} className="size-5 rotate-45" />
                </Text>
              </Pressable>
            </View>

            <ScrollView className="modal-body">
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={clsx("auth-input", errors.name && "auth-input-error")}
                  value={name}
                  style={{ paddingHorizontal: 8 }}
                  placeholder="Subscription name"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: undefined });
                  }}
                />
                {errors.name && <Text className="auth-error">{errors.name}</Text>}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className={clsx("auth-input", errors.price && "auth-input-error")}
                  value={price}
                  style={{ paddingHorizontal: 8 }}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  keyboardType="decimal-pad"
                  onChangeText={(text) => {
                    setPrice(text);
                    setErrors({ ...errors, price: undefined });
                  }}
                />
                {errors.price && <Text className="auth-error">{errors.price}</Text>}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Monthly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active"
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active"
                    )}
                    onPress={() => setFrequency("Yearly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active"
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <ScrollView
                  className="category-scroll"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: "row", gap: 8 }}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active"
                      )}
                      onPress={() => {
                        setCategory(cat);
                        setErrors({ ...errors, category: undefined });
                      }}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                {errors.category && <Text className="auth-error">{errors.category}</Text>}
              </View>

              <Pressable
                className={clsx("auth-button", isSubmitting && "auth-button-disabled")}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Create Subscription</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
