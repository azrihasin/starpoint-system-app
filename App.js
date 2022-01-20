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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Firebase from './database/firebase'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import MainScreen from './components/Organization'
import AddScreen from './components/organization/Add'
import SaveScreen from './components/organization/Save'

import { Text, LogBox } from 'react-native'

const Stack = createStackNavigator()

const Tab = createMaterialTopTabNavigator()

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
          <Tab.Navigator style={{marginTop:50}}>
            <Tab.Screen name="Student" component={StudentScreen} />
            <Tab.Screen name="Organization" component={OrganizationScreen} />
          </Tab.Navigator>
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

const StudentScreen = (props) => {
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

const OrganizationScreen = (props) => {
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
