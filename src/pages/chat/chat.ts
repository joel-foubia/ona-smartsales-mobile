import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Content, PopoverController, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
// import { PopOverPage } from '../pop-over/pop-over';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/message';
import { Channel } from '../../models/channel';


import { ConfigSync } from '../../config';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  list_users: any;
  isOk: boolean;
  objSpinner: boolean;
  affaire: any;
  @ViewChild(Content) content: Content;
  currentChannel: any;
  public messages = [];
  public channels = [];
  public objUser;
  public current_lang;
  public objLoader;
  public txtMessage;
  public isInfos = true;
  private checkSync;
  private txtLangue;
  private txtPop;
  private tab_ids = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private lgServ: LoginProvider, private odooServ: OdooProvider, public translate: TranslateService, public menuCtrl: MenuController, public popCtrl: PopoverController) {
    
    this.current_lang = this.translate.getDefaultLang();
    this.isOk = false;
    this.translate.get(['module','menu']).subscribe(_res=>{
      this.txtLangue = _res.module.chat;
      this.currentChannel = {name: _res.menu.chat};
    });
    this.affaire = this.navParams.get("affaire");
    this.initializeChat();
    
    //On récupère la liste des utilisateurs
    this.lgServ.isTable('_ona_user').then(res=>{
      this.list_users = JSON.parse(res);
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatPage');
  }

  initializeChat(){

    this.lgServ.isTable('me_avocat').then((res)=>{
        
      if(res){ //On récupère l'utilisateur courant
        if(this.navParams.get('customer')===undefined){
          this.objUser = JSON.parse(res);
          this.tab_ids.push(this.objUser.partner_id.id);
        }else{
          this.objUser = this.navParams.get('customer');
        }
 
        this.tab_ids.push(this.objUser.partner_id.id);
        if(this.affaire===undefined)
          this.syncOffOnline();
        else
          this.getMessagesOfAffaires();
         
        this.checkSync = setInterval(()=> this.activateSyn(), 100000);
      }
     
    });
  }

  openLeftMenu(){
    this.menuCtrl.open();
  }

  //Cette fonction permet de charger les données
  //lorsque l'utilisateur est en mode offline ou via online (server)
  syncOffOnline(){

    // this.lgServ.checkStatus('_ona_message').then(res=>{
      
    //   if(res=='i'){
    //     //Première utilisation sans connexion
    //   }else if(res=='s' || res=='w' || res=='rw'){ 
        console.log('channels');
        this.lgServ.isTable('_ona_channel').then(_channels=>{
          
          if(_channels){
            this.channels = this.loadChannelsByPartner(JSON.parse(_channels));
            console.log(this.channels);
          }else{

            this.objLoader = false;
            this.getListChannels();
          }
        });

    //     //SYnc de la liste depuis le serveur
    //     if(res=='w' || res=='rw'){
    //     }  
        
    //   }

    // });

  }

  ionViewDidLeave(){
    clearInterval(this.checkSync);
  }

  //Cette fonction permet d'activer la synchronisation
  activateSyn(){

    this.lgServ.connChange('_ona_message').then(res=>{

      if(res){
        this.getListChannels();
      }else{
        clearInterval(this.checkSync);
      }

    });  
  
  }

  /**
   * Cette fonction permet de charger les meetings
   * relative à une affaire
   *
   **/
  loadMessages(){

  }

  //Cette fonction permet d'obtenir la liste
  // des stages d'une affaire en fonction de l'utilisateur
  getListChannels(){

    this.odooServ.requestObjectToOdoo('channel', null, null, false, (res)=>{
      let results = [];
      for(let i = 0; i < res.length; i++)
        results.push(new Channel(res[i]));
      
      //console.log(results);
      //this.channels = results;
      this.lgServ.setTable('_ona_channel', results);
      
    });
 
  }

  /**
   * Cette fonction permet de charger les messages 
   * relatives aux channels
   * @param channel int, l'identifiant du channel
   */
  changeChannel(channel){
    this.isInfos = false;
    this.currentChannel = this.channels.find(objet=>objet.id == parseInt(channel));
    // let tab_channels = [];
    // tab_channels.push(channel);
    this.loadListMessages(parseInt(channel));
  }

  /**
   * Cette fonction renvoie la liste des channels qui sont 
   * disponible pour l'utilisateur courant
   * @param channels Array<Channel>, liste des objets de type Channel
   * @returns Array<Channel>
   */
  loadChannelsByPartner(channels){
    
    let results = [];
    for (let j = 0; j < channels.length; j++) {
      if(channels[j].channel_partner_ids.indexOf(this.objUser.partner_id.id)>-1)
        results.push(channels[j]);  
    }

    return results;
  }

  //Cette fonction permet de charger
  selectChannel(event){
    
    //let stage_id = item.bitcs_stage_id.id;
	  let popover = this.popCtrl.create('PopOverPage', {'objet': this.channels, 'channel':true, 'lang': this.txtPop});

	    popover.present({ ev: event});
	    popover.onDidDismiss((channel)=>{

	        if(channel){
	          this.isInfos = false;
            this.currentChannel = channel;
            // let tab_channels = [];
            // tab_channels.push(channel);
            this.loadListMessages(channel.id);
	                     
	        }
	    });
  }

  /**
   * Cette fonction permet de charger la liste des messages
   * par channel
   * @param channel int, l'identifiant d'un channel
   */
  loadListMessages(channel){

    this.objLoader = true;
    let tab_ids = [];

    tab_ids.push(channel);
    this.odooServ.requestObjectToOdoo('message', null, tab_ids, false, (res)=>{
        // console.log(res);
        this.objLoader = false;
        if(res.length!=0){
          
          let results = [];
          //On synchronise avec la table
          for(let i = 0; i < res.length; i++)
            results.push(new Message(res[i]));
          
          console.log(results);
          // this.messages = this.buildMessage(results.reverse());
          this.messages = results.reverse();
          this.isOk = true;
          //console.log(this.messages);
          //this.messages = this.loadMessages();
          
          setTimeout(() => {
             this.content.scrollToBottom(300);
          }, 700);

          //this.lgServ.setTable('_ona_message', results);
          this.lgServ.setSync('_ona_message_date');
        }
        
      });
  }

  //Cette fonction permet d'afficher 
  //la liste des messages
  getMessagesOfAffaires(){

    const tab_ids = this.affaire.message_ids;
    this.objLoader = true;
    this.odooServ.getObjectsOnline(tab_ids, "message", (res)=>{
        this.objLoader = false;
        //console.log(res);
        if(res.error===undefined){

          if(res.length!=0){
            
            let results = [];
            //On synchronise avec la table
            for(let i = 0; i < res.length; i++)
              results.push(new Message(res[i]));
            
            console.log(results);
            this.messages = results.reverse();
            setTimeout(() => {
               this.content.scrollToBottom(300);
            }, 700);
          }

        }else{
          this.odooServ.showMsgWithButton(this.txtLangue.error_internet,"top");
        }
    });
  }

  /**
   * Cette fonction permet d'envoyer 
   * un message dans le channel
   */
  sendMessage(){

    let myMessage = new Message(null);

    if(this.txtMessage!==undefined && this.txtMessage.trim()!=''){

      //On préremplie le champ
      myMessage.body = this.txtMessage;
      myMessage.channel_ids.push(this.currentChannel.id);
      myMessage.message_type = "comment";
      myMessage.author_id = this.objUser.partner_id;
      myMessage.date = new Date();
      myMessage.model = "mail.channel";
      this.objSpinner = true;
      
      //On insère les données en bd
      this.odooServ.createSingleOnline('message', myMessage, this.objLoader, res=>{
        console.log(res);
        this.objSpinner = false;
        if(res.error===undefined){
          myMessage = new Message(res);
          console.log(myMessage);
          this.messages.push(myMessage);
          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 500);
          
          myMessage = null;
          this.txtMessage = "";
        }else{
          this.odooServ.showMsgWithButton(res.message,"top");
        }
  
      });

    }else{
      this.odooServ.showMsgWithButton(this.txtLangue.no_message,'top','toast-info');
    }
    
  }

  /**
   * Cette fonction permet d'ouvrir la page pour 
   * accéder à la vue correspondant au fichier
   * @param objMsg Message, objet de type Message
   */
  readPage(objMsg){
    console.log(objMsg);
    this.odooServ.getPageOfModel(objMsg).then((reponse: any)=>{
      console.log(reponse);
   
      if(reponse!==undefined){ 
          this.navCtrl.push(reponse.page.component, {'objet': reponse.objet});
      }else{
        this.odooServ.showMsgWithButton(this.txtLangue.error_sync,"top");
      }
    });
  }

  /**
   * Construire la liste des messages
   * @param messages Array<Message> liste des messages
   * @returns Array<Message>
   */
  buildMessage(messages: Array<Message>){
    // console.log(this.list_users);
    let results = [];

    for (let i = 0; i < messages.length; i++) {
      // console.log(messages[i]);
      for (let j = 0; j < this.list_users.length; j++) {
       
        if(messages[i].author_id.id==this.list_users[j].partner_id.id){
          results.push(messages[i]);
          messages[i].author_id.name = this.list_users[j].display_name;
        }

      }
      
    }

    // console.log(results);
    return results;
  }

}
