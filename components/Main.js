import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Firebase from '../database/firebase'
import FeedScreen from './organization/Feed'
import ProfileScreen from './organization/Profile'
import SearchScreen from './organization/Search'
import QRScanner from './QRScanner'
import EventsPage from './EventsPage'
import HistoryPage from './HistoryPage'
import User from '../User'

import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
  clearData
} from '../redux/actions/index'

const Tab = createMaterialBottomTabNavigator()

const EmptyScreen = () => {
  return null
}

export class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      role: '',
    }
  }

  componentDidMount() {
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();

    User.fetchDetails().then((_) => {
    
      this.setState({
        loaded: true,
        role: User.role,
      })
    })
  }

  render() {
    const { loaded, role } = this.state
    const { currentUser } = this.props

    if (currentUser == undefined) {
      return <View></View>
    }

    if (!loaded) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Loading...</Text>
        </View>
      )
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
          
          {role === 'organization' && (
            <Tab.Screen
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
            />
          )}
          {role === 'student' && (
            <Tab.Screen
              key={Date.now()}
              name="Scan"
              component={QRScanner}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="qrcode"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          )}
          {role === 'student' && (
            <Tab.Screen
              key={Date.now()}
              name="History"
              component={HistoryPage}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="history"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          )}
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault()
                navigation.navigate('Profile', {
                  uid: Firebase.auth().currentUser.uid,
                })
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
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollowing, clearData },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchProps)(Main)
