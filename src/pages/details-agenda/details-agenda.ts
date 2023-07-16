import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, PopoverController, IonicPage, AlertController } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';
// import { FormAgendaPage } from '../form-agenda/form-agenda';
import { Agenda } from '../../models/agenda';
import { Partner } from '../../models/partner';
import { TranslateService } from '@ngx-translate/core';
//import { PopColorPage } from '../pop-color/pop-color';
//import { DetailClientPage } from '../detail-client/detail-client';

@IonicPage()
@Component({
  selector: 'page-details-agenda',
  templateUrl: 'details-agenda.html',
})
export class DetailsAgendaPage {

  txtPop: any;
  current_lang: string;
  defaultImg: string;
	public event;
	public tags;
	public reminders;
	public attendees;
	public bgColor;
  public owner = null;
  public isOwner = false;
  private txtLangue;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadCtrl: LoadingController, private odooServ: OdooProvider, public popCtrl: PopoverController, private lgServ: LoginProvider, public translate: TranslateService, public alertCtrl: AlertController) {
    
    this.defaultImg = "assets/images/person.jpg";
    this.current_lang = this.translate.getDefaultLang();
    this.event = this.navParams.get('objet');
    this.lgServ.isTable('me_avocat').then((res)=>{
      if(res){
        this.owner = JSON.parse(res);
        if(this.event.agenda.partner_ids.indexOf(this.owner.partner_id.id)>-1)
          this.isOwner = true;
      }
    });

    this.txtLangue = this.odooServ.traduire().module.agenda;
    this.translate.get("pop").subscribe(res=>{
      this.txtPop = res;
    });

  	this.loadObjetsFromRemote('tag_agenda');
  	this.loadObjetsFromRemote('remind');
  	this.loadAttendees();
  }

  ionViewDidLoad() {}


  //On récupère la liste des tags ou des reminders
  private loadObjetsFromRemote(type){
  	
  	let elements = [];

  	if(type=='tag_agenda')
  		elements = this.event.agenda.categ_ids;
  	else if(type=='remind')
  		elements = this.event.agenda.alarm_ids;

    this.odooServ.getTagsOfType(type, elements).then(res=>{
      //console.log(res);
      if(type=='tag_agenda')
      	this.tags = res;
      else if(type=='remind')
      	this.reminders = res;
    });

  }

  //Formatage de la liste des Clients
  private loadPartnerFromServer(tab){

    let result = [];
    for (let i = 0; i < tab.length; i++) {
      
      /*let objPartner = new Partner(tab[i], 'client');
      result.push(objPartner);*/
      result.push(tab[i]);
    }

    return result;
  }

  //Cette fonction permet de charger la liste des participants
  loadAttendees(){

  	this.odooServ.getListPartnersOnRes('contact', this.event.agenda.partner_ids).then(res=>{
      //this.attendees = this.loadPartnerFromServer(res);
  		this.attendees = res;
  	}); 
  }



  //Cette fonction permet d'archiver ou supprimer
  //un rendez vous
  onArchive(action){
    
    let confirm = this.alertCtrl.create({ 
      title: 'ONA SMART SALES',
      message: this.txtLangue.delete_info,
      buttons: [
        {
          text: this.txtPop.no,
          handler: () => {}
        },
        {
          text: this.txtPop.yes,
          handler: () => {
            
            let req;
            if(action=='a')
              req = {archive:false, id: this.event.agenda.id};
            else
              req = {archive: true, id: this.event.agenda.id};

            this.odooServ.updateSyncRequest('agenda', req);
            this.odooServ.removeObjetSync('agenda', this.event.agenda);

            this.odooServ.showMsgWithButton(this.txtLangue.miss_rdv,'top');
            /*this.odooServ.updateSingleObject('agenda', this.event.agenda.id, req, false, (res)=>{
            
            });*/

          }
        }
      ]
    });

    confirm.present();
    
  }

  //Convertir le temps en millisecondes
  private miliseconds(hrs,min,sec){
      return ((hrs*60*60+min*60+sec)*1000);
  }

  /**
   * Cette fonction permet de calculer la 
   * date de fin d'une activité
   * @param startTime Datetime, date de début
   * @param duration float, la durée de l'activité
   * 
   **/
  private getEndTime(startTime, duration){

    let endTime = new Date();
    let total, timeDuration;

    var strDuration = duration.toString();
    var tab = strDuration.split(".");
    
    if(tab.length!==undefined || tab.length<2)
      timeDuration = this.miliseconds(duration,0,0);
    else if(tab.length>1)
      timeDuration = this.miliseconds(parseInt(tab[0]), parseInt(tab[1]), 0);

    //let timeDuration = 1000*(duration*3600);
    let startMs = startTime.valueOf();

    total = startMs + timeDuration;
    endTime.setTime(total);

    return endTime;
  }


  //Modification d'un rendez vous
  onModify(objet, type){
  	
  	let params = {'modif':true, 'objet':objet, 'action':type};
    let addModal = this.modalCtrl.create('FormAgendaPage', params);
    //let msgLoading = this.loadCtrl.create({content: 'Mise à jour du Rendez-vous ...' });

    //msgLoading.present();
    addModal.onDidDismiss((data) => {

      if(type=='update'){

        //Ajout de la requete pour la synchronisation à la bd
        this.odooServ.updateSyncRequest('agenda', data);
        data.stop = this.getEndTime(new Date(data.start_datetime), parseFloat(data.duration));
        
        this.odooServ.updateNoSync('agenda', data, data.id, 'standart');
        this.odooServ.showMsgWithButton(this.txtLangue.update_rdv,'top');
      }else if(type=='copy'){ 

        this.odooServ.syncDuplicateObjet('agenda', data);
        data.stop = this.getEndTime(new Date(data.start_datetime), parseFloat(data.duration));
        
        this.odooServ.copiedAddSync('agenda', data);
        this.odooServ.showMsgWithButton(this.txtLangue.copy_rdv, 'top');
      }
      
      /*this.odooServ.updateSingleObject('agenda', this.event.agenda.id, data, msgLoading, (res)=>{
    	});*/
    });

    addModal.present();

  }

  //Cette fonction permet de faire une copie
  //du Rendez vous
  onDuplique(){

    let objAgenda = new Agenda(null);
    objAgenda = Object.assign({}, this.event.agenda);
    // console.log(objAgenda);
    objAgenda.name = objAgenda.name + ' (copy)';
        
    if(this.event.agenda.id!=0)
      this.onModify(objAgenda, 'copy');
    else
      this.odooServ.showMsgWithButton(this.txtLangue.copy_fail,"top");
    
    
  }

  //Cette fonction permet de modifier la couleur 
  //d'arrière plan d'un Rendez vous
  /*openColor(event){

    let popover = this.popCtrl.create(PopColorPage, {'couleur': this.event.agenda.color_partner_id}, {cssClass: 'custom-popcolor'});
    //let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};

    popover.present({ev: event});
    popover.onDidDismiss((result)=>{
      
        if(result){
        	console.log(result);
          this.bgColor = {'background-color': result.val };
        
          let data = {'couleur': result};

	      this.odooServ.updateSingleObject('agenda', this.event.agenda.id, data, false, (res)=>{
    		this.odooServ.showMsgWithButton("La couleur du Rendez-vous a été changé",'top');
    	  });
          //FIn de la requete de mise à jour
        }
    });

  }*///End update color


  //Cette fonction permet de consulter les informations détaillées
  //d'un participant
  openPartner(user){

    /*let objToSend = {
              'objet':user,
              'user': this.user,
              'type': this.the_partner,
              'login': this.objLogin
            };
    
    this.navCtrl.push(DetailClientPage,{'toSend':objToSend});*/

  }

}
