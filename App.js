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
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import MainScreen from './components/Organization'
import AddScreen from './components/organization/Add'
import CameraScreen from './components/organization/Camera'
import SaveScreen from './components/organization/Save'
import UploadScreen from './components/organization/Upload'

import { Text, View, LogBox } from 'react-native'

const Stack = createStackNavigator()

const store = createStore(rootReducer, applyMiddleware(thunk))

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

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
              component={MainScreen}
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
              name="Save"
              component={SaveScreen}
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
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Signup"
        component={Signup}
        navigation={props.navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        navigation={props.navigation}
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const Organization = (props) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Signup"
        component={Signup}
        navigation={props.navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        navigation={props.navigation}
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
