'use strict';
import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import {AppRegistry,Dimensions,StyleSheet,Text,TouchableHighlight,View, Image, Platform} from 'react-native';
import {Icon, Button, Header, left, Title, Body, Right, Container, Left} from 'native-base';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
     var storage = firebase.storage();

    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
    })
  })
}

export default class CameraMLZ extends Component {
  constructor(props) {
    super(props)
    this.state = {
        path: null
 
    };
  }
takePicture() {
    const database = firebase.database();     
    this.camera.capture()
      .then((data) => {this.setState({ path: data.path }) })
      .catch(err => console.error(err));    
  }

  closeCamera() {
    Actions.pop();  
  }

  getFoto = () => {
      this.props.updateStateFoto(this.state.path);
  }

   _pickImage() {
      this.setState({ uploadURL: ''})
      uploadImage(this.state.path)
      .then(url => this.setState({ uploadURL: url }))
      .catch(error => console.log(error)); 
      alert('ok')
  }

 renderImage() {
    return (   
      <Container>
        <Header>
            <Left>
                <Button transparent    onPress={() => this.setState({ path: null })} >
                    <Icon name='arrow-back' />
                </Button>
            </Left>
            <Body>
                <Title style={{color:'#67aefc'}}>Foto</Title>
            </Body>
            <Right>
                <Button transparent  onPress={() => this._pickImage()}>
                    <Text style={{color:'#67aefc', fontSize: 14, fontWeight:'bold'}}>OK</Text>
                </Button>
            </Right>
        </Header>
           <Button transparent  onPress={() => this.getFoto()}>
                    <Text style={{color:'#67aefc', fontSize: 14, fontWeight:'bold'}}>UE</Text>
                </Button>
        <Image
        source={{ uri: this.state.path }}
        style={styles.preview}
        />
      </Container>    
    );
  }

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        captureTarget={Camera.constants.CaptureTarget.disk}
      >

         <Button transparent primary onPress={ () => {  this.closeCamera()  }} >
            <Icon name='close' style={{fontSize:60, backgroundColor: 'transparent'}} />  
             <Text style={{color: 'red'}}>{this.props.text}</Text>
          </Button>
        <TouchableHighlight
          style={styles.capture}
          onPress={this.takePicture.bind(this)}
          underlayColor="rgba(255, 255, 255, 0.5)"
        >
         
        <View />
        </TouchableHighlight>
      </Camera>
    );
  }

  render() {
    return (
      <View style={styles.container}>     
        {this.state.path ? this.renderImage() : this.renderCamera()}
      </View>
    );
  }

  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
    ok: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  }
});

