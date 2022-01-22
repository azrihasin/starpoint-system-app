import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Firebase from '../database/firebase'
import CameraScreen from './organization/Camera'
import FeedScreen from './organization/Feed'
import ProfileScreen from './organization/Profile'
import SearchScreen from './organization/Search'

import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions/index'

const Tab = createMaterialBottomTabNavigator()

const EmptyScreen = () => {
  return <View></View>
}

export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser()
    this.props.fetchUserPosts()
    this.props.fetchUserFollowing()
  }

  render() {
    const { currentUser } = this.props

    if (currentUser == undefined) {
      return <View></View>
    }

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
            navigation = {this.props.navigation}
            options={{
              tabBarLabel: 'Seach',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="magnify"
                  color={color}
                  size={26}
                />
              ),
            }}
          />

          <Tab.Screen
            key={Date.now()}
            name="Scan"
            component={EmptyScreen}
            options={{
              tabBarLabel: 'Scan',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  color={color}
                  size={23}
                />
              ),
            }}
          />

          {/* NEED TO ADD EMPTY COMPONENT BECAUSE COMPONENT MUST BE PASSED EVENTHOUG WE DIDNT USE IT */}
          <Tab.Screen
            key={Date.now()}
            name="AddTab"
            component={EmptyScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault()
                navigation.navigate('Add')
              },
            })}
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
          />

          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault()
                navigation.navigate('Profile',{uid: Firebase.auth().currentUser.uid})
              },
            })}
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
    )
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing  }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
