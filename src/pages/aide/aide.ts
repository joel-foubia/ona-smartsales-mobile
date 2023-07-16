import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
// import { ReportPage } from '../report/report';
import { AfProvider } from '../../providers/af/af';
// import { FaqPage } from '../faq/faq';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-aide',
  templateUrl: 'aide.html',
})
export class AidePage {

  private txtLangue: any;
  docs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private odooServ: OdooProvider, private servAF: AfProvider, public translate: TranslateService) {
    
    this.translate.get('parameters').subscribe(res=>{
      this.txtLangue = res;
    });

    this.servAF.getInfosAbout((res)=>{
      this.docs = res;
    });
  }

  ionViewDidLoad() {
    
  }

  //Permet à l'utilisateur d'envoyer un message sur
  //un rapport d'erreur
  openReport(){
    
    let addModal = this.modalCtrl.create('ReportPage', {'type':{'label':'report', 'title': this.txtLangue.title_bugs }});
	 	addModal.onDidDismiss((data) => {
	 	  
	      if(data){
          console.log(data);
          this.odooServ.doEmail(this.docs.bugs_email, this.txtLangue.email_fail, this.txtLangue.title_bugs, data);
	      }

	    });

	  addModal.present();
  }

  //Ouvre la page de la documentation
  openDoc(){
    this.odooServ.doWebsite(this.docs.doc_url, this.txtLangue.doc_fail); 
  }

  //Cette fonction permet d'ouvrir le formulaire
  //de demande d'assistance
  openAssistance(){

    let addModal = this.modalCtrl.create('ReportPage', {'type':{'label':'assistance', 'title':this.txtLangue.assistance}});
	 	addModal.onDidDismiss((data) => {
	 	  
	      if(data){
          console.log(data);
          this.odooServ.doEmail(this.docs.bugs_email, this.txtLangue.email_fail, this.txtLangue.objet, this.buildMessage(data));
 	      }

	    });

	  addModal.present();
  }

  //Cette fonction ouvre la page FAQ
  faq(){
    this.navCtrl.push('FaqPage');
  }

  //Construire le message
  private buildMessage(data){

    let html = '';
    html += this.txtLangue.nom+data.name+'<br>';
    html += this.txtLangue.company+data.company+'<br>';
    html += this.txtLangue.tel+data.phonenumber+'<br><br><br>';
    html += this.txtLangue.message+'<br>'+data.message+'<br>';

    return html;
  }

  presentation(){
    this.navCtrl.push('PresentPage', {show: '1'});
  }

}
