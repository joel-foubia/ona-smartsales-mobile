import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, MenuController, AlertController, Events, IonicPage } from 'ionic-angular';

import { OdooProvider } from '../../providers/odoo/odoo';

import { ConfigImg } from '../../config';
import { LoginProvider } from '../../providers/login/login';
import { Evenement } from '../../models/event';
import { Participant } from '../../models/participant';
import { Ticket } from '../../models/ticket';
import { TranslateService } from '@ngx-translate/core';
import { Partner } from '../../models/partner';

@IonicPage()
@Component({
  selector: 'page-details-event',
  templateUrl: 'details-event.html',
})

export class DetailsEventPage {
  
  objOrganizer: any;
  objAdress: any;
  current_lang: string;
  user: any;
  residual: number = 0;
  lines: any = [];
  tickets: any = [];
  private listIcons: { iconAlert: string; iconError: string; iconSuccess: string; };
	public evenement : any;
	public titre = null;
  public the_partner;
  public roleType;
  public defaultImg;
	

  constructor(public navCtrl: NavController, public navParams: NavParams, public odooService: OdooProvider, public loadCtrl: LoadingController, public modalCtrl: ModalController, public menuCtrl: MenuController, public alertCtrl: AlertController, public evEVT: Events, public lgServ: LoginProvider, private translate: TranslateService) {
    
    this.current_lang = this.translate.getDefaultLang();
  	this.evenement = this.navParams.get('toSend').objet;
    this.roleType = 'coordonnees';
  	
    this.the_partner = 'event';
    this.listIcons = ConfigImg.objIcons;
    this.residual = this.evenement.seats_max - this.evenement.registration_ids.length;

    // console.log(this.evenement);
    this.lgServ.isTable('me_avocat').then(res=>{
      if(res)
        this.user =JSON.parse(res);
      
      this.listChilds('participant');
      this.listChilds('ticket');
      this.listChilds('contact','address');
      this.listChilds('contact','organizer');

    });
  }

  ionViewDidLoad() {  
  }

  /**
   * Cette fonction permet d'éditer
   * un évènement
   *
   **/
  editEvent(){
  	this.callForm(this.evenement, this.the_partner, 'modif');
  }

  /**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/ 
   callForm(objet, type, action){
      
      let params;

      if(action!='copy')
        params = {'objet': objet, 'modif':true};
      else
        params = {'objet': objet, 'modif':true, 'copy':true};

   		let addModal = this.modalCtrl.create('FormEventPage', params);
      let message; 
   		
	 	//callback when modal is dismissed (recieve data from View)
	 	addModal.onDidDismiss((data) => {

	      if(data){
          
          data.date_begin = this.odooService.formatUTF(new Date(data.date_begin.replace('T',' ')));
          data.date_end = this.odooService.formatUTF(new Date(data.date_end.replace('T',' ')));

          if(action!='copy'){
	      	  message = this.the_partner+" is updated !";
            
            //On met à jour les informations (data) dans la base de données interne
            
            if(objet.id==0)
              this.odooService.updateNoSyncObjet(this.the_partner, data, objet);
            else{
              this.odooService.updateSyncRequest(this.the_partner, data);
              this.odooService.updateNoSync(this.the_partner, data, objet.id, 'standart');
            }
                      
          }else{
            message = this.the_partner+" is duplicated !";
            data.display_name = data.name;
            this.odooService.syncDuplicateObjet(this.the_partner, data);
            this.evEVT.publish('add_event:changed', { item: data, id: this.evenement.id});
            this.odooService.copiedAddSync(this.the_partner, data);
          }
          
          this.odooService.showMsgWithButton(message,'top','toast-success');
           
	      }

	    });

	    addModal.present();
   }

  
   //Cette fonction permet d'appliquer la suppresion de l'objet
   //en cours
   processDelete(type){
      
      let params, message;
      
      //Choisir le type de requête
      switch(type){
        
        case 'a':{
          params = {active : false};
          this.evenement.active = false;
          message = this.evenement.name+' is archived';
          break;
        }
        case 'f':{
          params = {active : true};
          this.evenement.active = true;
          message = this.evenement.name+' is removed from archived folder';
          break;
        }
 
      }

      params['id'] = this.evenement.id;
      //On met à jour la table dans la bd interne
      this.odooService.updateNoSync(this.the_partner, this.evenement, this.evenement.id, 'standart');
      
      //On ajoute les requetes qui vont etre synchroniser au server
      if(this.evenement.id==0)
        this.odooService.showMsgWithButton(" You cannot archive this event, becausse it is not synchronize","top","toast-info");
      else
        this.odooService.updateSyncRequest(this.the_partner, params);
                        
      this.evEVT.publish('event:changed', this.evenement.id);
      this.odooService.showMsgWithButton(message,'bottom','toast-success');
      if(type=='d')
        this.navCtrl.pop();

   }

   //Cette fonction permet d'archiver
   //un event
   archiveEvent(choice){
    this.processDelete(choice);
   }
 
   //Dupliquer un évènement
   copyEvent(){
      
    let objEvent = new Evenement(this.the_partner);
      
    objEvent = Object.assign({}, this.evenement);
    objEvent.name = objEvent.name + ' (copy)';
        //objEvent.image = this.evenement.image;
        
    if(this.evenement.id!=0)
      this.callForm(objEvent, this.the_partner, 'copy');
    else
      this.odooService.showMsgWithButton(" You cannot make a copy, becausse this event is not yet synchronized","top","toast-info");
   }



   /**
    * Cette fonction permet d'afficher la liste
    * des tickets, ou des participants
    * @param type string, nom de l'objet
    */
   listChilds(type, partner?: string){
    
    this.lgServ.isTable('_ona_'+type).then(res=>{
      if(res){
        
        let lines = JSON.parse(res);
        // console.log(lines);
        for (let i = 0; i < lines.length; i++) {
          const element = lines[i];
          if(type=='participant'){
            if(this.evenement.registration_ids.indexOf(element.id)>-1){
              this.lines.push(element);
            }
            
          }else if(type=='ticket'){
            if(this.evenement.event_ticket_ids.indexOf(element.id)>-1){
              this.tickets.push(element);
            }
          }else if(type=='contact'){
            if(partner=='address' && this.evenement.address_id.id==element.id){
              this.objAdress = element;
              break;
            }else if(partner=='organizer' && this.evenement.organizer_id.id==element.id){
              this.objOrganizer = element;
              break;
            }
          }

        }

      }else{
        
        this.odooService.requestObjectToOdoo(type, null, null, false, res => {
          
          let fromServ : any;
          for (let j = 0; j < res.length; j++) {
            if(type=='participant'){
              fromServ.push(new Participant(res[j]));
              if(this.evenement.registration_ids.indexOf(fromServ[j].id)>-1){
                this.lines.push(fromServ[j]);
              }
             
            }else if(type=='ticket'){
              fromServ.push(new Ticket(res[j]));            
              if(this.evenement.event_ticket_ids.indexOf(fromServ[j].id)>-1){
                this.tickets.push(fromServ[j]);
              }
            }else if(type=='contact'){
              fromServ.push(new Partner(res[j],'contact'));
              if(partner=='address' && this.evenement.address_id.id==fromServ[j].id){
                this.objAdress = fromServ[j];
                break;
              }else if(partner=='organizer' && this.evenement.organizer_id.id==fromServ[j].id){
                this.objOrganizer = fromServ[j];
                break;
              }
            }

          }

          //Store data in sqlLite and save date of last sync
          this.lgServ.setTable('_ona_' + type, fromServ);
          this.lgServ.setSync('_ona_' + type + '_date');
          // fromServ = null;

        });

      }

    });

   }

  openLeftMenu(){
    this.menuCtrl.open();
  }

  //Cette fonction permet d'ajouter un participant 
  //à l'évènement
  addParticipant(){

    let addModal = this.modalCtrl.create('FormAttendeePage', { modif: false, objet: {}, current_event: this.evenement });
		let msgLoading = this.loadCtrl.create({ content: 'Enregistrement en cours...' });

		addModal.onDidDismiss(data => {
			if (data) {
				let message = 'Attendee '+data.name+' is added to event !';
				msgLoading.present();
				data.idx = new Date().valueOf();

        //On insère dans la bd Interne
				this.lines.push(data);
        console.log(data);
				this.odooService.copiedAddSync('participant', data);
				this.odooService.syncCreateObjet('participant', data);

				msgLoading.dismiss();
				this.odooService.showMsgWithButton(message, 'top', 'toast-success');
			}
		});

		addModal.present(); 
  }

  //Cette fonction va ouvrir la vue qui afficher
  //la liste de tous les participants
  showMoreParticipants(){
    this.navCtrl.push('AttendeesPage', { objet: this.evenement });
  }

}