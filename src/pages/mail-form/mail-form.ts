import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { Mail } from '../../models/mail';
import { Message } from '../../models/message';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Attachment } from '../../models/attachment';


@IonicPage()
@Component({
  selector: 'page-mail-form',
  templateUrl: 'mail-form.html',
})

export class MailFormPage {
  
  info : any;
  attendees = [];
  type: string;
  objMail: Mail;
  objMessage: Message;
  txtLang: any;
  user: any;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public modalCtrl: ModalController,
      public loadCtrl: LoadingController,
      private lgServ : LoginProvider,
      private odooServ: OdooProvider,
      public translate: TranslateService,
      public vc : ViewController) {

      this.objMail = new Mail(null);
      this.info = this.navParams.get('objet');
      this.type = this.navParams.get('type');
      
      this.lgServ.isTable('me_avocat').then(res=>{
        if(res){
          this.user = JSON.parse(res);
          this.initForm();
        }
      });
  
      // console.log('Mail client => ', this.mailClient);
      console.log('Information', this.info);
      
      this.translate.get('mail').subscribe((res)=>{
        this.txtLang = res;
    
      });

  }

  //This method is used to initialize form
  initForm(){

    let ref = '', libelle = '', model = '';

    this.objMail.email_from = this.user.email;
    this.objMail.author_id = this.user.partner_id;
    
    if(this.type=='client' || this.type=='contact'){

      this.attendees.push(this.info);
      this.objMail.partner_ids.push(this.info.id);
      
      this.objMail.email_to = this.info.email;

    }else{

      this.attendees.push(this.info.partner_id);
      this.objMail.partner_ids.push(this.info.partner_id.id);

      if(this.type=='invoice'){
        ref = this.info.number;
        libelle = this.txtLang.invoice;
        model = 'account.invoice';

      }else{
        if(this.info.state=='draft')
          libelle = this.txtLang.devis;
        else
          libelle = this.txtLang.sale;

        ref = this.info.name;
        model = 'sale.order';
      }

      //Call this to retrieve attachments
      this.getFilesAttachments(this.info.id, model).then(_data=>{
          console.log(_data);
      });

      //Select customer email address  
      this.retrieveDataPartner(this.info.partner_id.id).then((res: any)=>{
        this.objMail.email_to = res.email;
      });

      this.objMail.subject = this.user.company_id.name+' '+libelle+' (Ref '+ref+')';
      this.objMail.body = this.buildMessageSales();

    }

  }

  /**
   * This method is used to find
   * attached files to resources
   */
  getFilesAttachments(id: number, model: string){

    return new Promise((resolve, reject)=>{

      const filter = {
        'res_id': id,
        'res_model': model
      };

      this.odooServ.requestObjectToOdoo('attachment', null, filter, false, (res)=>{
        
        let results : Array<Attachment> = [];

        if(res.length!=0){
          for (let j = 0; j < res.length; j++) 
            results.push(new Attachment(res[j]));
          
        }

        console.log('Files', results)
        resolve(results);

      });

    });
  }

  close() {
		this.vc.dismiss();
  }

  //Retrieve data's partner
  retrieveDataPartner(id_partner: number){

    return new Promise((resolve, reject)=>{
      this.lgServ.isTable('_ona_client').then(rep=>{
        if(rep){

          let clients = JSON.parse(rep);
          for (let k = 0; k < clients.length; k++) {
            if (clients[k].id==id_partner){
              resolve(clients[k]);
              break;
            }
            
          }
        }
      });
    });
  }
  
  
  ionViewDidLoad() {
    // console.log('ionViewDidLoad MailFormPage');
  }

  /**
   * This method is used to build message
   * based on properties
   * 
   * @return string
   */
  buildMessageSales(): string {
    
    let odooMsg = '';

      odooMsg = this.txtLang.greeting + ' ' + this.info.partner_id.name + ', \n';
      odooMsg += this.txtLang.header + ' ' + '\n';
      odooMsg += this.txtLang.refference +'\n\n';
      
      if(this.type!='invoice')
        odooMsg += this.txtLang.OdNum + ' : ' + this.info.name + '\n';
      else
        odooMsg += this.txtLang.OdNum + ' : ' + this.info.number + '\n';

			odooMsg += this.txtLang.OdTotal + ' : ' + this.info.amount_total + ' ' + this.info.currency_id.name + '\n';
      
      if(this.type!='invoice')
			  odooMsg += this.txtLang.date + ' : ' + this.info.write_date + '\n';
      else  
        odooMsg += this.txtLang.date + ' : ' + this.info.date_invoice + '\n';
		
		return odooMsg;
  }
  

  //This function is used to send Mail to customer
  send(){

    // console.log('Object Message => ', this.objMail);
    if(this.objMail.email_to==''){

      this.odooServ.showMsgWithButton(this.txtLang.no_email,"top", "toast-error");
    }else{

      this.objMail.message_type = "email";
      this.objMail.date = new Date();
      
      const load = this.loadCtrl.create({content: this.txtLang.pending});
      load.present();

      //On execute la requete d'envoi du Mail
      this.buildObjetMessage().then((rep : Message)=>{

        this.objMail.mail_message_id.id = rep.id;
        this.odooServ.createSingleOnline('mail', this.objMail, false, res=>{
                
          load.dismiss();
          if(res.error===undefined){
            let myMail = new Mail(res);
            console.log(myMail);
            this.vc.dismiss(myMail);
                        
          }else{
            
            this.odooServ.showMsgWithButton(res.message,"top", "toast-error");
          }
    
        });

        
      }).catch(err=>{

        load.dismiss();
        this.odooServ.showMsgWithButton(err.message,"top");
      });
      
    }

  }

  /**
   * This method is used to build Objet
   * Message
   * 
   * @returns Promise
   */
  buildObjetMessage(){

    return new Promise((resolve, reject)=>{
      
      let myMessage = new Message(null);
      myMessage.body = this.objMail.body;
      // myMessage.channel_ids.push(this.currentChannel.id);
      myMessage.message_type = "email";
      myMessage.author_id = this.objMail.author_id;
      myMessage.date = new Date();
      myMessage.model = "";

      //On insère les données en bd
      this.odooServ.createSingleOnline('message', myMessage, false, res=>{
                
        if(res.error===undefined){
          myMessage = new Message(res);
          // console.log(myMessage);
          resolve(myMessage);
          
        }else{
          reject({error: res.error, message: res.message})
          // this.odooServ.showMsgWithButton(res.message,"top");
        }
  
      });

    });
  }

  //Cette fonction permet de sélectionner
  //un client dans la liste
  selectPartner(){

    let data = { "data": 'client', "name":''};
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
        	// console.log(objet);
        	//On met à jour l'attribut attendees du Controller
        	this.attendees.push(objet);
        	console.log(this.attendees);
        	//On met à jour l'attribut partner_ids de l'objet Agenda
        	this.objMail.partner_ids.push(data.id);
        }  
        
      }

    });

    modal.present();
  }

}
