import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, Slides, PopoverController, ModalController, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
// import { HelperPage } from '../../pages/helper/helper';
// import { PopTagPage } from '../../pages/pop-tag/pop-tag';
// import { CalendrierPage } from '../calendrier/calendrier';
import { TranslateService } from '@ngx-translate/core';
import { Agenda } from '../../models/agenda'; 
import * as moment from 'moment'

@IonicPage()
@Component({ 
  selector: 'page-form-agenda',
  templateUrl: 'form-agenda.html',
})
export class FormAgendaPage {
  section: string;
  txtLangue: any;
  @ViewChild('formSlide') slides: Slides; 
  
  public agenda;
  public action;
  public is_modif = false;
  public tags = [];
  public reminders = [];
  public attendees = [];
  private txtPop: any;
  private currentPartner;
  currentDateTime: string;
  currentDate: string;
  
  constructor(public vc: ViewController, public navParams: NavParams, public popCtrl: PopoverController, public modalCtrl: ModalController, private odooServ: OdooProvider, public translate: TranslateService) {
    
    this.currentDateTime = moment().format('YYYY-MM-DDTHH:mm')
    this.currentDate = moment().format('YYYY-MM-DD')
    this.section = 'meeting';
    this.translate.get(['pop','module']).subscribe(_res=>{
      this.txtPop = _res.pop;
      this.txtLangue = _res.module.agenda;
    });

  	this.agenda = this.navParams.get('objet');
    this.action = this.navParams.get('action');
    
    if(this.agenda==null){
    	
    	this.agenda = new Agenda(null);
    	this.currentPartner = this.navParams.get('partner');
    	this.agenda.partner_ids.push(this.currentPartner.id);
    	this.attendees.push({
        id: this.currentPartner.id,
        display_name: this.currentPartner.name
      });

    }else{
        this.is_modif = true;
        this.loadObjetsFromRemote('tag_agenda');
    	  this.loadObjetsFromRemote('remind');
    	  this.loadObjetsFromRemote('contact');
    }

  }

  ionViewDidLoad() {
    
  }

  //Cette fonction permet d'afficher la liste des tags
  //ou la liste des rappels
  private loadObjetsFromRemote(type){
  	
  	let elements = [];

  	if(type=='tag_agenda')
  		elements = this.agenda.categ_ids;
  	else if(type=='remind')
  		elements = this.agenda.alarm_ids;
  	else
  		elements = this.agenda.partner_ids;

  	// console.log(elements);
    this.odooServ.getTagsOfType(type, elements).then((res: any)=>{

      // console.log(res);
      if(type=='tag_agenda')
      	this.tags = res;
      else if(type=='remind')
      	this.reminders = res;
      else
        this.attendees = res;
        
    });

  }




  //Ajouter un tag ou un reminder à partir d'une 
  //fenêtre Pop up
  addObjetFromPop(event, type){
  	
  	let elements = [];
  	if(type=='tag_agenda')
  		elements = this.tags;
  	else
  		elements = this.reminders;

  	// console.log(type);
  	let popover = this.popCtrl.create('PopTagPage', {'agenda':type, 'lang':this.txtPop}, {cssClass: 'custom-popaudio'});
    
    popover.present({ev: event});
    popover.onDidDismiss((result)=>{
        
        if(result){ 
          console.log(result);
          let find = false;

          for(let i = 0; i< result.tags.length; i++){

            //On vérifie si le tableau n'est pas vide
            if(elements!==undefined){
            	for (let j = 0; j < elements.length; j++) 
	              if(elements[j].me.id.me==result.tags[i].me.id.me){
	                find = true;
	                break; 
	              }	
            }

            //On insère les éléments dans le tableau vide
            if(!find || elements.length==0)
              elements.push(result.tags[i]);
          }

          //Ici on met à jour les attributs de l'objet Agenda
          for(let i = 0; i< result.tab.length; i++){

          	if(type=='tag_agenda'){ //tags
            	
            	if(this.agenda.categ_ids.indexOf(result.tab[i])==-1 || this.agenda.categ_ids.length==0)
              		this.agenda.categ_ids.push(result.tab[i]);

          	}else{ //reminders
          		if(this.agenda.alarm_ids.indexOf(result.tab[i])==-1 || this.agenda.alarm_ids.length==0)
              		this.agenda.alarm_ids.push(result.tab[i]);
          	}

          }

          if(result.add!=""){

            this.odooServ.editTag(type, result, (res)=>{
              // console.log(res); 
              if(type=='tag_agenda'){
              	this.tags.push(res);
              	this.agenda.categ_ids.push(res.me.id.me);
              	this.odooServ.showMsgWithButton(this.txtPop.tag_add, 'top');
              }else{
              	this.reminders.push(res);
              	this.agenda.alarm_ids.push(res.me.id.me);
              	this.odooServ.showMsgWithButton(this.txtLangue.f_remind, 'top');
              }
              	
            });
          }

          //On met à jour les attributs tags et reminders du Controller
          if(type=='tag_agenda')
          	this.tags = elements;
          else
          	this.reminders = elements;
          
        }
  
    });//Fin du Pop Tag 

  }

  //Cette fonction permet de sélectionner
  //un client dans la liste
  selectPartner(){

    let data = { "data": 'contact', "name":'', 'lang':this.txtPop };
    let modal = this.modalCtrl.create('HelperPage', data);
    modal.onDidDismiss(data => {
      if(data) {
      	console.log(data);
      	let find = false;
        
        for (let j = 0; j < this.attendees.length; j++)
          if(this.attendees[j].id==data.id){
            find = true;
            break;
          }

        if(!find){
        	
        	let objet = data;
        	console.log(objet);
        	//On met à jour l'attribut attendees du Controller
        	this.attendees.push(objet);
        	console.log(this.attendees);
        	//On met à jour l'attribut partner_ids de l'objet Agenda
        	this.agenda.partner_ids.push(data.id);
        }
        
        
      }
    });
    modal.present();
  }

  //ajouter un tag
  changeTag(tag, type){
    this.odooServ.editTag(type, tag, (res)=>{
      //tag.me.name.me = res;
      this.odooServ.showMsgWithButton(this.txtLangue.f_maj_tag, 'top');
    });
  }

  //Retirer un tag de l'affaire
  removeTag(tag, index, type){
  	let elements;

  	if(type=='tag_agenda'){
    	this.tags.splice(index,1);
    	elements = this.agenda.categ_ids;
  	}
    else if(type=='remind'){
    	this.reminders.splice(index,1);
    	elements = this.agenda.alarm_ids;
    }
    else{
    	this.attendees.splice(index,1);
    	elements = this.agenda.partner_ids;
    }
    
    //On met à jour les attributs de l'objet
    for(let i = 0; i < elements.length; i++){
      
      if(tag.me.id.me==elements[i]){
      	if(type=='tag_agenda')
        	this.agenda.categ_ids.splice(i,1);
        else if(type=='remind')
        	this.agenda.alarm_ids.splice(i,1);
        else
        	this.agenda.partner_ids.splice(i,1);

        break;
      }
    }

  }

  //Cette fonction permet d'ouvrir le
  //calendrier afin que l'utilisateur puisse
  //choisir une date
  // openCalendar(event, type){
    
  //   let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
    
  //   let popover = this.popCtrl.create('CalendrierPage', {'lang':this.txtPop}, {cssClass: 'custom-popcalendar'});
  //   popover.present({ ev});
  //   popover.onDidDismiss((result)=>{

  //       if(result){
  //       	if(this.agenda.allday){
  //       		if(type=='d')
  //       			this.agenda.start_date = new Date(result);
  //       		else
  //       			this.agenda.stop_date = new Date(result);
  //       	}else{
  //       		this.agenda.start_datetime = result;	
  //       	}
  //       }
  //   });    
  // }

  //Fermer le formulaire
  close(){  
  	this.vc.dismiss();
  }

  saveItem(){
  	
  	this.agenda['reminders'] = this.reminders;

  	if(!this.agenda.allday && this.agenda.start_datetime=="" && this.agenda.duration==0)
  		this.odooServ.showMsgWithButton(this.txtLangue.fail_rdv,'top','toast-error');
  	else if(this.agenda.allday && this.agenda.start_date=="" && this.agenda.stop_date=="")
  		this.odooServ.showMsgWithButton(this.txtLangue.fail_start_end,'top','toast-error');
  	else{
      this.agenda.start_datetime = this.agenda.start_datetime.replace('T',' ');
  		this.vc.dismiss(this.agenda);
    }
  }

  //Modification de la valeur allday
  onChange(checked){
  	this.agenda.allday = checked;
  }


}
