// App.js

import React, { Component } from 'react'
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'



import Firebase from './database/firebase'
import Welcome from './components/Welcome'
import LoginOrganization from './components/auth/LoginOrganization'
import LoginStudent from './components/auth/LoginStudent'
import SignupOrganization from './components/auth/SignupOrganization'
import SignupStudent from './components/auth/SignupStudent'
import Main from './components/Main'
import AddScreen from './components/organization/Add'
import ProfileScreen from './components/organization/Profile'
import UploadScreen from './components/organization/Upload'
import EventDetailsPage from './components/EventDetailsPage'
import CreateEventPage from './components/CreateEventPage'

import { Text, View, LogBox, } from 'react-native'

const Stack = createStackNavigator()

const store = createStore(rootReducer, applyMiddleware(thunk))

LogBox.ignoreAllLogs()

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
    
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  
  render() {
    const { loggedIn, loaded } = this.state
    if (!loaded) {
      return (
        // <Image style={container.splash} source={logo} />
        <Text>Loading...</Text>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Student"
              component={Student}
              navigation={this.props.navigation}
              //options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Organization"
              component={Organization}
              navigation={this.props.navigation}
              //options={{ headerShown: false }}
            />
          </Stack.Navigator>  
        </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={Main}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsPage}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEventPage}
              navigation={this.props.navigation}
              options={{ headerShown: false }}
            />
               <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Upload"
              component={UploadScreen}
              navigation={this.props.navigation}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              navigation={this.props.navigation}
              // options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App

const Student = (props) => {
  return (
    <Stack.Navigator initialRouteName="LoginStudent">
      <Stack.Screen
        name="SignupStudent"
        component={SignupStudent}
        navigation={props.navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginStudent"
        navigation={props.navigation}
        component={LoginStudent}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const Organization = (props) => {
  return (
    <Stack.Navigator initialRouteName="LoginOrganization">
      <Stack.Screen
        name="SignupOrganization"
        component={SignupOrganization}
        navigation={props.navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginOrganization"
        navigation={props.navigation}
        component={LoginOrganization}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
