import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class GetLocalizao extends Component {

state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {  	
    return ( 
	<View> 
	
	<View>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {this.state.initialPosition}          
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.state.lastPosition}         
        </Text>
      </View>

	</View> 
    );
  }
}

var styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    color: 'red'
  },
});

