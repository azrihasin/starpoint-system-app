// components/welcome.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>Starpoint App</Text>
          <Text style={styles.welcome}>Welcome!</Text>

          <Text style={styles.start}>Let's get started.</Text>
          <Text style={styles.iama}>I am a:</Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => this.props.navigation.navigate('Student')}
            >
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => this.props.navigation.navigate('Organization')}
            >
            <Text style={styles.buttonText}>Organization</Text>
          </TouchableOpacity>    
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: "#00938f",
  },

  content: {
    marginTop: 50,
  },

  logo: {
    fontSize: 20,
    textAlign: 'center',
    color: "#fff"
  },

  welcome: {
    marginTop: 30,
    fontSize: 46,
    fontWeight: 'bold',
    color: "#fff"
  },

  start: {
    fontSize: 20,
    color: "#fff"
  },

  iama: {
    marginTop: 40,
    fontSize: 20,
    color: "#fff"
  },

  button: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    backgroundColor: "#000",
    marginVertical: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold"
  }
});