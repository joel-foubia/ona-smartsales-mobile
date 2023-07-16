import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Calls } from '../../models/call';
import { Partner } from '../../models/partner';
import { TranslateService } from '@ngx-translate/core';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';



@IonicPage()
@Component({
  selector: 'page-form-call',
  templateUrl: 'form-call.html',
})
export class FormCallPage {

  lead: any;
  txtPop: any;
  modif: any;
  objCalls: Calls;
  // public client : Calls;
  public the_partner = 'call';
  currentDate: string;

  constructor(public navParams: NavParams,
              private view: ViewController,
              private translate: TranslateService,
              private modalCtrl: ModalController,
              private vc : ViewController,
              private odooServ: OdooProvider,
              private lgServ: LoginProvider
              ) {
      this.fixMinDate();

      this.modif = this.navParams.get('modif');
      this.lead = this.navParams.get('lead');
      
      this.translate.get('pop').subscribe(_res=>{
        this.txtPop = _res;
      });
    

      if(this.modif){
        this.the_partner = this.navParams.get('type');
        this.objCalls = this.navParams.get('objet');
      }else{
        this.the_partner = this.navParams.get('type');
        this.objCalls = new Calls(null);
        if(this.lead!==undefined){
          this.objCalls.opportunity_id.id = this.lead.id;
          this.objCalls.opportunity_id.name = this.lead.name;
          this.objCalls.partner_id = this.lead.partner_id;
          this.prefillPhone();
        }
      }
  }

  //Cette méthode permet de sélectionner un client
  selectPartner(partner, champ){

    let data = { "data": partner }; 
    let modal = this.modalCtrl.create('HelperPage', data);
    modal.onDidDismiss(_data => {
      if (_data) {
        console.log('Result Helper => ', _data);
        if(partner=='name'){
            this.objCalls.name = _data;
        }else if(partner=='state'){
            this.objCalls.state = _data;
        }else if(partner=='client'){
            this.objCalls.partner_id.id = _data.id;
            this.objCalls.partner_id.name = _data.name;
            this.objCalls.partner_phone = _data.phone;
            this.objCalls.partner_mobile = _data.mobile;
            this.objCalls.state = 'open';
           
          //  var date = this.objCalls.date;
					// 	var dateEvent = new Date(date);
					// 	dateEvent = event.toISOString();
					// 	console.log('Date => ', dateEvent);
					// 	console.log('date =>', date1);
					// 	console.log('New date =>', date);
        }
      }

    });
    modal.present();
  }

  selectOpportunity(opportunity, type){
    let dataPassed = {
      info : opportunity
    }
    let modal = this.modalCtrl.create('HelperPage', dataPassed);
    modal.onDidDismiss(_val =>{
      if(_val){
        console.log('Opportunity => ', _val);
      }
    });
    modal.present();
  }

  
  saveItem(){
    
      if (this.objCalls.name == null || this.objCalls.name == ''){
        
        this.odooServ.showMsgWithButton('The call summary is mendatory !', 'top', 'toast-error');
        
      }else{
        let date = this.objCalls.date;
        var dateEvent = new Date(date);
        var dateReplace = dateEvent.toISOString();
        var date1 = dateReplace.replace('T', ' ');
        this.objCalls.date = date1.replace('.000Z', '');
        this.vc.dismiss(this.objCalls);
      }
    
    }
    fixMinDate() {
      this.currentDate = '';
      let objNow = new Date(),
        mois,
        jour,
        hours,
        minutes;
  
      //Month
      if (objNow.getMonth() < 9){
        mois = '0' + (objNow.getMonth() + 1);
      } else{
        mois = objNow.getMonth() + 1;
        console.log(mois);
      } 
  
      //Jour
      if (objNow.getDate() < 10) jour = '0' + objNow.getDate();
      else jour = objNow.getDate();
  
      //Hours
      if (objNow.getHours() < 10) hours = '0' + objNow.getHours();
      else hours = objNow.getHours();
  
      //Minutes
      if (objNow.getMinutes() < 10) minutes = '0' + objNow.getMinutes();
      else minutes = objNow.getMinutes();
  
      this.currentDate = objNow.getFullYear() + '-' + mois + '-' + jour + 'T' + hours + ':' + minutes;
    }


  //Cette fonction permet de remplir le champ
  //phone number
  prefillPhone(){

    this.lgServ.isTable('_ona_client').then(res=>{

      let clients = JSON.parse(res);
      for (let i = 0; i < clients.length; i++) {
        if(clients[i].id==this.lead.partner_id.id){
          this.objCalls.partner_phone = clients[i].phone;  
          break;
        }
      }

    });
  }


  ionViewDidLoad() {}

  closeRecharge() {
    this.view.dismiss(); 
  }

}
