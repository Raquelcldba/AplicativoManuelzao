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

 const SchemaNascente = {
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
      foto: 'string',
      nomeNascente: 'string',
      tipoArea: 'string',
      espuma: 'string',
      oleo: 'string',
      usoDaNascente: 'string',
      acessoANascente: 'string',
      equipamentoUbarnoProximo: 'string',
      frequenciaUsoAguaDaNascente: 'string',
      vestigioAcessoGado: 'string',
      vestigioQueimadas: 'string',
      acoesEmergenciais: 'string'   
      // erosao: 'string',
      // vegetacaoMargem: 'string',
  
    }
  };

 let realm = new Realm({schema: [SchemaNascente] });

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
           foto: item.foto,

          nomeNascente: item.nomeNascente,
          tipoArea: item.tipoArea,
          espuma: item.espuma,
          oleo: item.oleo,
          usoDaNascente: item.usoDaNascente,
          acessoANascente: item.acessoANascente,
          equipamentoUbarnoProximo:item.equipamentoUbarnoProximo,
          frequenciaUsoAguaDaNascente: item.frequenciaUsoAguaDaNascente,
          vestigioAcessoGado: item.vestigioAcessoGado,
          vestigioQueimadas: item.vestigioQueimadas,
          acoesEmergenciais: item.acoesEmergenciais,
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


  function salvaDadosFirebaseOnline(locale, text, tipoRegiao,  corAgua, odorAgua, materialSuspensao, esgoto, residuoSolido, 
    erosao, vegetacaoMargem, foto, nomeNascente, tipoArea, espuma, oleo, usoDaNascente, acessoANascente, equipamentoUbarnoProximo,
    frequenciaUsoAguaDaNascente, vestigioAcessoGado, vestigioQueimadas, acoesEmergenciais){  
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
       foto: foto,

      nomeNascente: nomeNascente,
      tipoArea: tipoArea,
      espuma: espuma,
      oleo: oleo,
      usoDaNascente: usoDaNascente,
      acessoANascente: acessoANascente,
      equipamentoUbarnoProximo: equipamentoUbarnoProximo,
      frequenciaUsoAguaDaNascente: frequenciaUsoAguaDaNascente,
      vestigioAcessoGado: vestigioAcessoGado,
      vestigioQueimadas: vestigioQueimadas,
      acoesEmergenciais: acoesEmergenciais 
      
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

  function salvaDadosFirebaseOnlineMortandadeDePeixe(locale, text,  foto, tipoRegiao) {  
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
       foto: foto,
       tipoProtocolo: tipoRegiao        
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
        lastPosition: 'false',
        foto: 'semFoto',
        tipoProtocolo: '',


        nomeNascente: '',
        tipoArea: 'Rural',
        espuma: 'Não há',
        oleo: 'Não há',
        usoDaNascente: 'Não há',
        acessoANascente: 'Fácil',
        equipamentoUbarnoProximo: 'Não há',
        frequenciaUsoAguaDaNascente: 'Não há',
        vestigioAcessoGado: 'Não há',
        vestigioQueimadas: 'Não há',
        acoesEmergenciais: 'Outros'
    }
}

/* locale */
 watchID: ?number = null;
  componentDidMount() {
    if(this.state.lastPosition) {
      salvarNoFirebase();   
     }
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

  
  async salvarDados() { 
  if (true) {
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


    var nomeNascente = this.state.nomeNascente;
    var tipoArea = this.state.tipoArea;
    var espuma = this.state.espuma;
    var oleo = this.state.oleo;
    var usoDaNascente = this.state.usoDaNascente;
    var acessoANascente = this.state.acessoANascente;
    var equipamentoUbarnoProximo = this.state.equipamentoUbarnoProximo;
    var frequenciaUsoAguaDaNascente = this.state.frequenciaUsoAguaDaNascente;
    var vestigioAcessoGado = this.state.vestigioAcessoGado;
    var vestigioQueimadas = this.state.vestigioQueimadas;
    var acoesEmergenciais = this.state.acoesEmergenciais;

   salvaDadosFirebaseOnline(locale,text,tipoRegiao, corAgua, odorAgua, materialSuspensao, esgoto, residuoSolido, erosao, vegetacaoMargem, foto,
    nomeNascente, tipoArea, espuma, oleo, usoDaNascente, acessoANascente, equipamentoUbarnoProximo, frequenciaUsoAguaDaNascente,
    vestigioAcessoGado, vestigioQueimadas, acoesEmergenciais)

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

              nomeNascente: nomeNascente,
              tipoArea: tipoArea,
              espuma: espuma,
              oleo: oleo,
              usoDaNascente: usoDaNascente,
              acessoANascente: acessoANascente,
              equipamentoUbarnoProximo: equipamentoUbarnoProximo,
              frequenciaUsoAguaDaNascente: frequenciaUsoAguaDaNascente,
              vestigioAcessoGado: vestigioAcessoGado,
              vestigioQueimadas: vestigioQueimadas,
              acoesEmergenciais: acoesEmergenciais,
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
      lastPosition: 'false',
      foto: 'semFoto', 
      uploadURL: 'n/a',


      nomeNascente: '',
      tipoArea: 'Rural',
      espuma: 'Não há',
      oleo: 'Não há',
      usoDaNascente: 'Não há',
      acessoANascente: 'Fácil',
      equipamentoUbarnoProximo: 'Não há',
      frequenciaUsoAguaDaNascente: 'Não há',
      vestigioAcessoGado: 'Não há',
      vestigioQueimadas: 'Não há',
      acoesEmergenciais: 'Outros'
    });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert("Por gentileza habilete o GPS!"),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    alert('Informação enviada, obrigado por colaborar : )')
  } else alert('Por gentileza, habilite o GPS para poder enviar os dados.');
}

  async salvarDadosMortandadeDePeixe() { 
  if (this.state.lastPosition) {
    var locale = this.state.lastPosition;
    var text = this.state.text;
    var tipoRegiao = this.props.tipoProtocolo;
    var corAgua = this.state.corAguaselected;  
    var odorAgua = this.state.odorSelected;
    var materialSuspensao = this.state.materialSuspensao;
    var esgoto = this.state.esgoto;
    var residuoSolido = this.state.residuoSolido;
    var erosao = this.state.erosao;
    var vegetacaoMargem = this.state.vegetacaoMargem;
    var foto = this.state.foto;

    var nomeNascente = this.state.nomeNascente;
    var tipoArea = this.state.tipoArea;
    var espuma = this.state.espuma;
    var oleo = this.state.oleo;
    var usoDaNascente = this.state.usoDaNascente;
    var acessoANascente = this.state.acessoANascente;
    var equipamentoUbarnoProximo = this.state.equipamentoUbarnoProximo;
    var frequenciaUsoAguaDaNascente = this.state.frequenciaUsoAguaDaNascente;
    var vestigioAcessoGado = this.state.vestigioAcessoGado;
    var vestigioQueimadas = this.state.vestigioQueimadas;
    var acoesEmergenciais = this.state.acoesEmergenciais;

   salvaDadosFirebaseOnlineMortandadeDePeixe(locale,text,foto, tipoRegiao)

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

              nomeNascente: nomeNascente,
              tipoArea: tipoArea,
              espuma: espuma,
              oleo: oleo,
              usoDaNascente: usoDaNascente,
              acessoANascente: acessoANascente,
              equipamentoUbarnoProximo: equipamentoUbarnoProximo,
              frequenciaUsoAguaDaNascente: frequenciaUsoAguaDaNascente,
              vestigioAcessoGado: vestigioAcessoGado,
              vestigioQueimadas: vestigioQueimadas,
              acoesEmergenciais: acoesEmergenciais,
            });      
        }); 
      }
    });

   this.setState({
      selectedItem: 'undefined',
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
      lastPosition: 'false',
      foto: 'semFoto', 
      uploadURL: 'n/a',

      nomeNascente: '',
      tipoArea: 'Rural',
      espuma: 'Não há',
      oleo: 'Não há',
      usoDaNascente: 'Não há',
      acessoANascente: 'Fácil',
      equipamentoUbarnoProximo: 'Não há',
      frequenciaUsoAguaDaNascente: 'Não há',
      vestigioAcessoGado: 'Não há',
      vestigioQueimadas: 'Não há',
      acoesEmergenciais: 'Outros'
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert("Por gentileza habilete o GPS!"),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    alert('Informação enviada, obrigado por colaborar : )')
  } else alert('Por gentileza, habilite o GPS para poder enviar os dados.');
}
  onValueChange (key: string, value: string) {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
  }

  // getItemSelecionado = (corAguaselected) => {
  //   this.props.setItensSelecionado(corAguaselected);
  // }

  render() {  
    return ( 

    <Content style={{ marginTop: 60 }} >  
     <Galeria updateStateFoto={this.updateStateFoto}/>       
     <Button transparent  iconRight  full  style={{marginTop:20}}
        onPress={() => {  this.openCamera() }}>
        <Icon  style={{fontSize: 60, marginLeft:0, color:'#62b1f6'}} name='camera' />  
      </Button> 
      <Image   style={{ height:80, resizeMode: 'contain'}} source={{ uri: this.state.foto }} />
      <Text style={{fontSize:14, margin:20, marginBottom:5,  color:'#67aefc'}}>Descreva a situação/</Text>
      <TextInput
        style={{height: 60, borderColor: '#d6d6d6', borderWidth: 1, paddingLeft:20, margin: 10, marginBottom: 40, marginTop:0}}
        onChangeText={(text) => this.setState( {text} ) }
        value={this.state.text}
      />                  
      <Image source={{ uri: this.state.foto }}  />  

       {renderIf(this.props.tipoProtocolo == "nascente")(
        <Content>  
          <ListItem itemDivider>
              <Text>Qualidade da água</Text>
          </ListItem>  

          <Text style={{fontSize:14, margin:20, marginBottom:5,  color:'#67aefc'}}>Nome da nascente:</Text>
          <TextInput
          style={{height: 60, borderColor: '#d6d6d6', borderWidth: 1, paddingLeft:20, margin: 10, marginBottom: 40, marginTop:0}}
          onChangeText={(nomeNascente) => this.setState( {nomeNascente} ) }
          value={this.state.nomeNascente}
          /> 

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

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Situado em área:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.tipoArea}
              onValueChange={this.onValueChange.bind(this, 'tipoArea')}>
              <Item label='Urbana' value='Urbana' />
              <Item label='Rural' value='Rural' />                
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Espumas:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.espuma}
              onValueChange={this.onValueChange.bind(this, 'espuma')}>
              <Item label='Não Há' value='Não Há' />
              <Item label='Pouco' value='Pouco' />  
              <Item label='Muito' value='Muito' />               
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Óleos:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.oleo}
              onValueChange={this.onValueChange.bind(this, 'oleo')}>
              <Item label='Não Há' value='Não Há' />
              <Item label='Pouco' value='Pouco' />  
              <Item label='Muito' value='Muito' />               
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Uso da nascente:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.usoDaNascente}
              onValueChange={this.onValueChange.bind(this, 'usoDaNascente')}>
              <Item label='Sem uso' value='Sem uso' />
              <Item label='Irrigação' value='Irrigação' />  
              <Item label='Abastecimento doméstico' value='Abastecimento doméstico' /> 
              <Item label='Uso urbano' value='Uso urbano' /> 
              <Item label='Umectação de vias' value='Umectação de vias' /> 
              <Item label='Outros' value='Outros' />                  
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Acesso a nascente:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.acessoANascente}
              onValueChange={this.onValueChange.bind(this, 'acessoANascente')}>
              <Item label='Fácil' value='Fácil' />
              <Item label='Díficil' value='Díficil' />        
              <Item label='Sem acesso' value='Sem acesso' />                  
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Equipamentos urbanos:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.equipamentoUbarnoProximo}
              onValueChange={this.onValueChange.bind(this, 'equipamentoUbarnoProximo')}>
              <Item label='Não há' value='Não há' />
              <Item label='Menos de 50 metros' value='Menos de 50 metros' />
              <Item label='Entre 50 e 100 metros' value='Díficil' />        
              <Item label='Mais de 100 metros' value='Mais de 100 metros' />                  
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Frequência uso da nascente:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.frequenciaUsoAguaDaNascente}
              onValueChange={this.onValueChange.bind(this, 'frequenciaUsoAguaDaNascente')}>
              <Item label='Não há' value='Não há' />
              <Item label='Constante' value='Constante' />
              <Item label='Esporádico' value='Esporádico' />                
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Vestígios de acesso de Gado:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.vestigioAcessoGado}
              onValueChange={this.onValueChange.bind(this, 'vestigioAcessoGado')}>
              <Item label='Não há' value='Não há' />
              <Item label='Fezes' value='Fezes' />
              <Item label='Pisoteio' value='Pisoteio' /> 
              <Item label='Fezes e Pisoteio' value='Fezes e Pisoteio' />  
              <Item label='Outros' value='Outros' />               
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Vestígios de queimadas:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.vestigioQueimadas}
              onValueChange={this.onValueChange.bind(this, 'vestigioQueimadas')}>
              <Item label='Não há' value='Não há' /> 
              <Item label='Há Vestígios' value='Há Vestígios' />             
          </Picker>

          <Text style={{color:'#378ad8',  fontSize:14, paddingLeft:15, paddingTop: 15}}>Ações emergenciais que devem ser realizadas:</Text>
          <Picker
              iosHeader="Presença de esgotos"
              mode="dropdown"
              selectedValue={this.state.acoesEmergenciais}
              onValueChange={this.onValueChange.bind(this, 'acoesEmergenciais')}>
              <Item label='Cercamento' value='Cercamento' /> 
              <Item label='Reflorestamento' value='Reflorestamento' /> 
              <Item label='Contenção de focos erosivos' value='Contenção de focos erosivos' /> 
              <Item label='Contenção de focos erosivos' value='Contenção de focos erosivos' /> 
              <Item label='Contenção de focos erosivos' value='Contenção de focos erosivos' /> 
              <Item label='Retirada de esgotos sanitários' value='Retirada de esgotos sanitários' /> 
              <Item label=' Fiscalização ambiental' value=' Fiscalização ambiental' /> 
              <Item label='Outros' value='Outros' />             
          </Picker>

          <ListItem itemDivider>
            <Text>Ocupação e paisagem</Text>
          </ListItem> 

            <Button  block info style={{ margin: 10, marginTop:50}}
                 onPress={() => {  this.salvarDados() }} > 
                <Text>Salvar</Text>
            </Button>      
        </Content>
        )} 
        
        {renderIf(this.props.tipoProtocolo == "mortandadeDePeixe")(    
            <Button  block info style={{ margin: 10, marginTop:50 }}
                 onPress={() => {  this.salvarDadosMortandadeDePeixe() }} > 
                <Text>Salvar</Text>
            </Button>               
        )} 

      <Text>
        {this.state.lastPosition}
       </Text>
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







