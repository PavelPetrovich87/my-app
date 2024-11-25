import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="tabOne"
        options={{
          title: 'Tab 1',
          tabBarIcon: ({ color }) => 
            <Ionicons name="list" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="tabTwo"
        options={{
          title: 'Tab 2',
          tabBarIcon: ({ color }) => 
            <Ionicons name="settings" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}