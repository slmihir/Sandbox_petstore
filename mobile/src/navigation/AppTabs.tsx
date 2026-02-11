import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import DashboardScreen from '../screens/DashboardScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Orders stack
const OrdersStack = createNativeStackNavigator();
function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Order Details',
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </OrdersStack.Navigator>
  );
}

// Inventory stack
const InventoryStack = createNativeStackNavigator();
function InventoryStackScreen() {
  return (
    <InventoryStack.Navigator>
      <InventoryStack.Screen
        name="InventoryList"
        component={InventoryScreen}
        options={{ headerShown: false }}
      />
      <InventoryStack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={({ route }: any) => ({
          title: route.params?.product?.id ? 'Edit Product' : 'Add Product',
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
        })}
      />
    </InventoryStack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'grid-outline';
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Inventory') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceBorder,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Orders" component={OrdersStackScreen} />
      <Tab.Screen name="Inventory" component={InventoryStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
