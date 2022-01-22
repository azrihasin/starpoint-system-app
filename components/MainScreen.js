import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './organization/Feed'
import ProfileScreen from './organization/Profile'
import SearchScreen from './organization/Search'
import QRScanner from './QRScanner'
import EventsPage from './EventsPage'

const Tab = createMaterialBottomTabNavigator()

export default MainScreen = () => {
    const role = 'organization';

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Tab.Navigator
                initialRouteName="Feed"
                labeled={false}
                tabBarOptions={{
                    showIcon: true,
                    showLabel: false,
                    indicatorStyle: {
                        opacity: 0,
                    },
                }}
                barStyle={{ backgroundColor: '#ffffff' }}
            >
                <Tab.Screen
                    key={Date.now()}
                    name="Feed"
                    component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen
                    key={Date.now()}
                    name="Search"
                    component={SearchScreen}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="magnify"
                                color={color}
                                size={26}
                            />
                        ),
                    }}
                />
                {role === 'organization' && <Tab.Screen
                    key={Date.now()}
                    name="Events"
                    component={EventsPage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: (event) => {
                    //         event.preventDefault()
                    //         navigation.navigate('Add')
                    //     },
                    // })}
                    options={{
                        tabBarLabel: 'Add',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="plus-box"
                                color={color}
                                size={26}
                            />
                        ),
                    }}
                />}
                {role === 'student' && <Tab.Screen
                    key={Date.now()}
                    name="Scan"
                    component={QRScanner}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />}
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account-circle"
                                color={color}
                                size={26}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};
