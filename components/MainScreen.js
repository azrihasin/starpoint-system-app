import React, { Component, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './organization/Feed'
import ProfileScreen from './organization/Profile'
import SearchScreen from './organization/Search'
import QRScanner from './QRScanner'
import EventsPage from './EventsPage'
import HistoryPage from './HistoryPage';
import User from '../User'

const Tab = createMaterialBottomTabNavigator()

export default MainScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        User.fetchDetails().then((_) => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} ><Text>Loading...</Text></View>;

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
                {User.role === 'organization' && <Tab.Screen
                    key={Date.now()}
                    name="Events"
                    component={EventsPage}
                    options={{
                        tabBarLabel: 'Event',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="view-list"
                                color={color}
                                size={26}
                            />
                        ),
                    }}
                />}
                {User.role === 'student' && <Tab.Screen
                    key={Date.now()}
                    name="Scan"
                    component={QRScanner}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="qrcode" color={color} size={26} />
                        ),
                    }}
                />}
                {User.role === 'student' && <Tab.Screen
                    key={Date.now()}
                    name="History"
                    component={HistoryPage}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="history" color={color} size={26} />
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
