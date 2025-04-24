import { Text,Image, View } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-16 text-center`} style={{ color: color}}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            paddingTop: 10, 
            borderColor: '#232533',
            height: 60,
          }
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              //For Destructuring the color and focused
              <TabIcon 
                icon={icons.home}
                name="Home"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              //For Destructuring the color and focused
              <TabIcon 
                icon={icons.plus}
                name="Create"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              //For Destructuring the color and focused
              <TabIcon 
                icon={icons.profile}
                name="Profile"
                color={color}
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="bookmark"
          options={{
            title: 'bookmark',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              //For Destructuring the color and focused
              <TabIcon 
                icon={icons.bookmark}
                name="Saved"
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
      <StatusBar />
    </>
  )
}

export default TabsLayout