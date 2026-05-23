import { formatCurrency } from '@/lib/utils';
import React from 'react';
import { Image, Text, View } from 'react-native';

const UpcomingSubscriptionCard = ({ data, currency }: { data: UpcomingSubscriptionCardProps, currency: string }) => {
    return (
        <View className='upcoming-card'>
            <View className='upcoming-row'>
                <Image source={data.icon} className='upcoming-icon' />
                <View>
                    <Text className='upcoming-price'>{formatCurrency(data.price, currency)}</Text>
                    <Text className='upcoming-meta' numberOfLines={1}>{data.daysLeft > 0 ? `${data.daysLeft} days left` : 'Today'}</Text>
                </View>
            </View>

            <Text className='upcoming-name' numberOfLines={1}>{data.name}</Text>
        </View>
    )
}

export default UpcomingSubscriptionCard;