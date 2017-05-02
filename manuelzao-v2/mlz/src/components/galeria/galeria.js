'use strict';
import React, { Component } from 'react';
import {  Actions } from 'react-native-router-flux';
import {AppRegistry,Dimensions,StyleSheet,Text,View, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, TouchableHighlight, AlertIOS} from 'react-native';
import { Button, Icon, Header, Right, Left, Body, Title} from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import HeaderMlz from '../header/header';
import ImagePicker from 'react-native-image-picker'

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

const teste = () => {
  alert()
}

export default class Galeria extends Component {
  constructor(props) {
    super(props)
    this.state = {
     
    };
  }

  getFoto = () => {
      this.props.updateStateFoto(this.state.foto);  
  }
  
   _pickImage() {
      this.setState({ uploadURL: ''})

      ImagePicker.launchImageLibrary({}, response  => {     
        uploadImage(response.uri)
       
          .then(url => this.setState({ foto: url }), this.setState({ pathImage: response.uri }),alert(this.state.foto))
          .catch(error => console.log(error));
          
      })
    }

  backScreen() {
    Actions.pop();    
  };

  render() {
    return (
      <View style={ styles.container }>    
        <Button light iconLeft full  onPress={ () => this._pickImage() }>
            <Icon name='image' />
            <Text>Enviar imagem da Galeria</Text>
        </Button>    
        {
          (() => {
            switch (this.state.pathImage) {
              case null:
                return null
              case '':
                return <ActivityIndicator /> 
              default:
                return (
                  <View > 
                      { this.state.pathImage ?  

                   <Image source={{ uri: this.state.pathImage }} style={ styles.image } /> 
                     : console.log()}
                  { this.state.uploadURL ?  
                  <View>                 
                  
                    <Button light iconLeft full  onPress={ () => this.getFoto() }>
                        <Icon name='checkmark' />
                        <Text>teste</Text>
                    </Button>
                  </View>  
                  : <Text></Text>
                  }         
                  </View>
                )
            }
          })()
        }  
     
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 300,
    resizeMode: 'contain',
  },
  upload: {
    textAlign: 'center',
    color: '#333333',
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'gray'
  },
})