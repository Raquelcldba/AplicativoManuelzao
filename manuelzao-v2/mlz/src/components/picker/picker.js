import React, { Component } from 'react';
import firebase from 'firebase';
import { Container, Content, Picker, Text, Button, ListItem, Icon, Grid, Col, Input} from 'native-base';
import {StyleSheet, TextInput, Image} from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import CameraMLZ from '../camera/camera';
import Galeria from '../galeria/galeria';

const Item = Picker.Item

export default class PickerExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: undefined,
            corAguaselected: 'Clara',
            odorSelected: 'Não há',
            materialSuspensao: 'Não Há',
            residuoSolido: 'Não Há',
            esgoto: 'Não Há',
            erosao: 'Não Há',
            vegetacaoMargem: 'Pouco alterada',
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            foto: 'semFoto'                
        }

    }


/* locale */
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
  /* end locale */

  openCamera() {
    Actions.CameraMLZ({updateStateFoto: this.updateStateFoto});    
  }

   openGaleria() {
    Actions.Galeria();    
  }

   updateStateFoto = (foto) => {
    this.setState({
        foto: foto
    });
    alert()
      
}

  salvarDados() {

    const locale = this.state.lastPosition;
    const corAgua = this.state.corAguaselected;
    const odorAgua = this.state.odorSelected;
    const materialSuspensao = this.state.materialSuspensao;
    const esgoto = this.state.esgoto;
    const residuoSolido = this.state.residuoSolido;
    const erosao = this.state.erosao;
    const vegetacaoMargem = this.state.vegetacaoMargem;
    const foto = this.state.foto;

    var user = firebase.auth().currentUser;
    var uid;
    if (user != null) {     
      uid = user.uid; 
    }
   dadosEnviado = firebase.database().ref(uid);

   dadosEnviado.push().set(
     {
       localização: locale,
       cordaAgua: corAgua,
       odorAgua: odorAgua,
       materialSuspensao: materialSuspensao,
       esgoto: esgoto,
       residuoSolido: residuoSolido,
       erosao:erosao,
       vegetacaoMargem: vegetacaoMargem,
       foto: foto
     }
  );
}


  onValueChange (key: string, value: string) {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
  }

  getItemSelecionado = (corAguaselected) => {
    this.props.setItensSelecionado(corAguaselected);
  }

   deslogarUsuario() {
     const usuario = firebase.auth();
     usuario.signOut();
     Actions.login();
     alert('Deslogado')
  }

  render() {     
    return ( 
      <Content> 
     <Image
        source={{ uri: this.state.foto }}
   
        />
        <Image
          style={{width: 50, height: 50}}
          source={{uri: this.state.foto}}
        />
      <Text>{this.state.foto}</Text>

      <Galeria updateStateFoto={this.updateStateFoto}/>

     <Button transparent  iconRight  full 
        onPress={() => {  this.openCamera() }}>
        <Icon  style={{fontSize: 60, marginLeft:0}} name='camera' />                       
      </Button> 

      <Text style={{fontSize:14, margin:20, marginBottom:5,  color:'#67aefc'}}>Descreva a situação:</Text>
          <TextInput
        style={{height: 80, borderColor: '#d6d6d6', borderWidth: 1, paddingLeft:20, margin: 10, marginBottom: 40, marginTop:0}}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
      />       
                  
               <Image source={{ uri: this.state.foto }}  />      
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

      <Button block info style={{ margin: 10, marginTop:50}}
           onPress={() => {  this.salvarDados() }} > 
          <Text>Salvar</Text>
      </Button>   
         <Button block info style={{ margin: 10, marginTop:50}}
           onPress={() => {  this.deslogarUsuario() }} > 
          <Text>Sair</Text>
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







