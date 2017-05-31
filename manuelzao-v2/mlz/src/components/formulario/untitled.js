import React, { Component } from 'react';
import firebase from 'firebase';
import { Container, Content, Picker, Text, Button, ListItem, Icon, Grid, Col, Input, Thumbnail} from 'native-base';
import {StyleSheet, TextInput, Image, AsyncStorage, Platform, AppState} from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import renderIf from 'render-if/lib/renderIf';
import CameraMLZ from '../camera/camera';
import Galeria from '../galeria/galeria';
import RNFetchBlob from 'react-native-fetch-blob';
const Realm = require('realm');
const Item = Picker.Item

// <Galeria updateStateFoto={this.updateStateFoto}/>
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

 const AguaSchema = {
    name: 'dadosAgua',
    properties: {
      locale:  'string',
      text: 'string',
      tipoRegiao: 'string',
      corAgua: 'string',
      odorAgua: 'string',
      materialSuspensao: 'string',
      esgoto: 'string',
      residuoSolido: 'string',
      erosao: 'string',
      vegetacaoMargem: 'string',
      foto: 'string'
    }
  };

 let realm = new Realm({schema: [AguaSchema] });

 function pickImage(pathImageLocal, key, uid) { 
    uploadImage(pathImageLocal)
    .then(url => atualizarFotoFirebase(url, key, uid))
    .catch(error => console.log(error));    
  }
  // atualiza o endereço da foto com o link do firebase
  function atualizarFotoFirebase(linkImagemFirebase, key, uid) {   
    firebase.database().ref(uid).child(key).update({foto:linkImagemFirebase })
  }

  function salvarNoFirebase() {   
    // pega os dados salvo no banco local (Realm)
    var dados =  realm.objects('dadosAgua');
    dados.forEach(salvaDadosDoRealmNoFirebase);

    function salvaDadosDoRealmNoFirebase(item, index){      
      var user = firebase.auth().currentUser;
      var uid;
      if (user != null) {     
        uid = user.uid; 
      }
      dadosEnviado = firebase.database().ref(uid);
      var key =  firebase.database().ref().push().key      

      pickImage(item.foto, key, uid);

      firebase.database().ref(uid).child(key).set({
           localização: item.locale,
            text: item.text,
           tipoRegiao: item.tipoRegiao,          
           cordaAgua: item.corAgua,
           odorAgua: item.odorAgua,
           materialSuspensao: item.materialSuspensao,
           esgoto: item.esgoto,
           residuoSolido: item.residuoSolido,
           erosao:item.erosao,
           vegetacaoMargem: item.vegetacaoMargem,
           foto: item.foto
         }, function(error) {
            if (error) {
             alert('erro no bando local');
         } else {
             // alert('salvo realm'); 
             //remover os dados do Realm depois de salvar no FireBase
             realm.write(() => {
               realm.delete(dados);
            });
          }
      });                      
    }  
  }


  function salvaDadosFirebaseOnline(locale, text, tipoRegiao,  corAgua, odorAgua, materialSuspensao, esgoto, residuoSolido, erosao, vegetacaoMargem, foto){  
    var dados =  realm.objects('dadosAgua');   

    var user = firebase.auth().currentUser;
    var uid;
    if (user != null) {     
      uid = user.uid; 
    }

    dadosEnviado = firebase.database().ref(uid);
    var key =  dadosEnviado.push().key      

    //função para retornar a foto do storage do firebase
    pickImage(foto, key, uid);

    firebase.database().ref(uid).child(key).set({
       localização:locale, 
       text: text,     
       tipoRegiao: tipoRegiao,      
       corAgua: corAgua,
       odorAgua: odorAgua,
       materialSuspensao: materialSuspensao,
       esgoto: esgoto,
       residuoSolido: residuoSolido,
       erosao: erosao,
       vegetacaoMargem: vegetacaoMargem,    
       foto: foto
      
     }, function(error) {
        if (error) {
         alert('erro ao salvar no firebase');
     } else {  
        realm.write(() => {
           realm.delete(dados);
        });          
      }
    });                  
  }  

export default class Formulario extends Component {

constructor(props) {
    super(props);
    this.state = {
        selectedItem: undefined,
        text: '',
        tipoRegiao: 'Curso De Água',
        corAguaselected: 'Clara',
        odorSelected: 'Não há',
        materialSuspensao: 'Não Há',
        residuoSolido: 'Não Há',
        esgoto: 'Não Há',
        erosao: 'Não Há',
        vegetacaoMargem: 'Pouco alterada',
        initialPosition: '',
        lastPosition: 'unknown',
        foto: 'semFoto',
        tipoProtocolo: true  
    }
}

/* locale */
 watchID: ?number = null;

  componentDidMount() {
    salvarNoFirebase();   
   
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert("Por gentileza habilete o GPS!"),
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

  openCamera() {
    Actions.CameraMLZ({updateStateFoto: this.updateStateFoto});    
  }

  openGaleria() {
    Actions.Galeria({updateStateFoto: this.updateStateFoto});    
  }

  updateStateFoto = (foto) => {   
    this.setState({
        foto: foto
    });
  }


  selecionarTipoProtocolo = (protocolo) => {   
    this.setState({
        tipoProtocolo: protocolo
    });
  }
  
  async salvarDados() { 
  if (this.state.lastPosition != "unknown") {
    var locale = this.state.lastPosition;
    var text = this.state.text;
    var tipoRegiao = this.state.tipoRegiao;
    var corAgua = this.state.corAguaselected;  
    var odorAgua = this.state.odorSelected;
    var materialSuspensao = this.state.materialSuspensao;
    var esgoto = this.state.esgoto;
    var residuoSolido = this.state.residuoSolido;
    var erosao = this.state.erosao;
    var vegetacaoMargem = this.state.vegetacaoMargem;
    var foto = this.state.foto;

   salvaDadosFirebaseOnline(locale,text,tipoRegiao, corAgua, odorAgua, materialSuspensao, esgoto, residuoSolido, erosao, vegetacaoMargem, foto)

     // verifica se há conexão com internet, se nao tiver salva no Realm
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {  
      if (snap.val() === true) {
        // alert("connected");            
       } else {
          // alert("not connected");
          realm.write(() => {
            let salvarDadosAgua = realm.create('dadosAgua', {
              locale: locale ,
              text: text,
              tipoRegiao: tipoRegiao,             
              corAgua: corAgua,
              odorAgua: odorAgua,
              materialSuspensao: materialSuspensao,
              esgoto: esgoto,
              residuoSolido:residuoSolido, 
              erosao: erosao,
              vegetacaoMargem: vegetacaoMargem,
              foto: foto,
            });      
        }); 
      }
    });

   this.setState({
      selectedItem: undefined,
      text: '',
      tipoRegiao: 'Curso De Água',
      corAguaselected: 'Clara',
      odorSelected: 'Não há',
      materialSuspensao: 'Não Há',
      residuoSolido: 'Não Há',
      esgoto: 'Não Há',
      erosao: 'Não Há',
      vegetacaoMargem: 'Pouco alterada',
      initialPosition: '',
      lastPosition: '',
      foto: 'semFoto', 
      uploadURL: 'n/a'
    });

    alert('Informação enviada, obrigado por colaborar : )')
  } else alert('Por gentileza, habilite o GPS para poder enviar os dados.');
}

  onValueChange (key: string, value: string) {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
  }

  getItemSelecionado = (corAguaselected) => {
    this.props.setItensSelecionado(corAguaselected);
  }

  render() {  
    return ( 

    <Content style={{ marginTop: 60 }} >  
       {renderIf(this.props.tipoProtocolo == "nascente")(
       <Text>{this.props.tipoProtocolo}</Text>
        )}  

     <Galeria updateStateFoto={this.updateStateFoto}/>
       
     <Button transparent  iconRight  full  style={{marginTop:20}}
        onPress={() => {  this.openCamera() }}>
        <Icon  style={{fontSize: 60, marginLeft:0, color:'#62b1f6'}} name='camera' />  

      </Button> 
        <Image   style={{ height:80, resizeMode: 'contain'}} source={{ uri: this.state.foto }} />
      <Text style={{fontSize:14, margin:20, marginBottom:5,  color:'#67aefc'}}>Descreva a situação:</Text>
        <TextInput
          style={{height: 60, borderColor: '#d6d6d6', borderWidth: 1, paddingLeft:20, margin: 10, marginBottom: 40, marginTop:0}}
          onChangeText={(text) => this.setState( {text} ) }
          value={this.state.text}
        />       
                  
      <Image source={{ uri: this.state.foto }}  />  

      <ListItem itemDivider>
          <Text>Selecione o tipo de Região</Text>
      </ListItem> 
       <Text  style={{color:'#378ad8', fontSize:14, paddingLeft:15, paddingTop: 15}}>Curso de Água ou Nascente</Text>
       <Picker
          iosHeader="Qualidade da Água"
          mode="dropdown"
          selectedValue={this.state.tipoRegiao}
          onValueChange={this.onValueChange.bind(this, 'tipoRegiao')}>
          <Item label='Curso de Água' value='Curso De Água' />
          <Item label='Nascente' value='Nascente'/>             
      </Picker>
      <ListItem itemDivider>
          <Text>Qualidade da água</Text>
      </ListItem>  

      <Text  style={{color:'#378ad8', fontSize:14, paddingLeft:15, paddingTop: 15}}>Cor da água:</Text>
      <Picker
          iosHeader="Qualidade da Água"
          mode="dropdown"
          selectedValue={this.state.corAguaselected}
          onValueChange={this.onValueChange.bind(this, 'corAguaselected')}>
          <Item label='Clara' value='Clara' />
          <Item label='Media' value='Media'/>  
          <Item label='Escura' value='Escura' />                 
      </Picker>
      <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Odor da água</Text>
      <Picker
          iosHeader="Odor da água"
          mode="dropdown"
          selectedValue={this.state.odorSelected}
          onValueChange={this.onValueChange.bind(this, 'odorSelected')}>
          <Item label='Não há' value='Não há' />
          <Item label='Com odor' value='Com Odor' />  
          <Item label='Odor Forte' value='Odor Forte' />                 
      </Picker>

      <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Material em suspençao</Text>
      <Picker
          iosHeader="Material em suspençao"
          mode="dropdown"
          selectedValue={this.state.materialSuspensao}
          onValueChange={this.onValueChange.bind(this, 'materialSuspensao')}>
          <Item label='Não Há' value='Não Há' />
          <Item label='Pouco' value='Pouco' />  
          <Item label='Muito' value='Muito' />                 
      </Picker>
      <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de resíduos sólidos (Margens e leito)</Text>
      <Picker
          iosHeader="Presença de resíduos sólidos (Margens e leito)"
          mode="dropdown"
          selectedValue={this.state.residuoSolido}
          onValueChange={this.onValueChange.bind(this, 'residuoSolido')}>
          <Item label='Não Há' value='Não Há' />
          <Item label='Pouco' value='Pouco' />  
          <Item label='Muito' value='Muito' />                 
     </Picker>
      <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de esgotos</Text>
      <Picker
          iosHeader="Presença de esgotos"
          mode="dropdown"
          selectedValue={this.state.esgoto}
          onValueChange={this.onValueChange.bind(this, 'esgoto')}>
          <Item label='Não Há' value='Não Há' />
          <Item label='Provável' value='Provável' />  
          <Item label='Visível' value='Visível' />                 
      </Picker>

      <ListItem itemDivider>
        <Text>Ocupação e paisagem</Text>
      </ListItem> 
      <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Presença de focos de erosão nas margens</Text>
      <Picker
          iosHeader="Presença de focos de erosão nas margens"
          mode="dropdown"
          selectedValue={this.state.erosao}
          onValueChange={this.onValueChange.bind(this, 'erosao')}>
          <Item label='Não Há' value='Não Há' />
          <Item label='Pouco significativa' value='Pouco significativa' />  
          <Item label='Significativa' value='Significativa' />                 
     </Picker>
       <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Vegetação nas Margens</Text>
      <Picker
          iosHeader="Vegetação nas Margens"
          mode="dropdown"
          selectedValue={this.state.vegetacaoMargem}
          onValueChange={this.onValueChange.bind(this, 'vegetacaoMargem')}>
          <Item label='Pouco alterada' value='Pouco alterada' />
          <Item label='Alterada' value='Alterada' />  
          <Item label='Muito alterada ou ausente' value='Muito alterada ou ausente' />                 
     </Picker>

      <Button  block info style={{ margin: 10, marginTop:50}}
           onPress={() => {  this.salvarDados() }} > 
          <Text>Salvar</Text>
      </Button>  
          
     </Content>                          
    );
  }
}


const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    width:100,  
    alignItems: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: 'red',
  }
  });







