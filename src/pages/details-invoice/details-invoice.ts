import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ModalController, Events, AlertController, IonicPage } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
// import { FormInvoicePage } from '../form-invoice/form-invoice';
import { TranslateService } from '@ngx-translate/core';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Invoice } from '../../models/invoice';
import { InvoiceLine } from '../../models/invoice-line';

@IonicPage()
@Component({
  selector: 'page-details-invoice',
  templateUrl: 'details-invoice.html',
})

export class DetailsInvoicePage {
  
	public facture;
  public roleType;
  public lines = [];
  public current_lang;
  private txtPop;
  private txtLangue; 

  constructor(public navCtrl: NavController, public navParams: NavParams, private lgsServ: LoginProvider, private odooServ: OdooProvider, public translate: TranslateService, public menuCtrl: MenuController, public alertCtrl: AlertController, public modalCtrl: ModalController, public evEVT: Events) {
    
    this.current_lang = this.translate.getDefaultLang();
    this.translate.get(['pop','module']).subscribe(_res=>{
      this.txtPop = _res.pop;
      this.txtLangue = _res.module.facture;
    });

  		this.facture = this.navParams.get('objet');
      this.roleType ='details';
      this.getListLines();
  }

  ionViewDidLoad() {
    
  }

  //Cette fonction permet d'obtenir la liste
  //des invoices lines
  getListLines(){
    this.lgsServ.isTable('_ona_invoice-line').then(res=>{
      if(res){

        let lines = JSON.parse(res);
        
        for (let i = 0; i < lines.length; i++) {
          const element = lines[i];
          if(this.facture.invoice_line_ids.indexOf(element.id)>-1)
            this.lines.push(element);
        }

      }else{
        
        this.odooServ.requestObjectToOdoo('invoice-line', null, null, false, (data)=>{
            let results = [];
            for (let i = 0; i < data.length; i++) {
              results.push(new InvoiceLine('n', data[i]));
              if(this.facture.invoice_line_ids.indexOf(results[i].id)>-1)
                this.lines.push(results[i]);
            }

            this.lgsServ.setTable('_ona_invoice-line', results);
            this.lgsServ.setSync('_ona_invoice-line_date');
        });

      }

    });
   
  }

  //Cette fonction permet de valider une facture (draft => open)
  validate(){
    let alert = this.alertCtrl.create({
      title: 'ONA SMART SALES',
      message: this.txtLangue.txt_validate,
      buttons: [
        {
          text: this.txtPop.no,
          role: 'cancel',
          handler: () => {}
        },
        {
          text: this.txtPop.validate,
          handler: () => {

            let params = {stage:'open', id:this.facture.id, state:'open'};
            this.odooServ.updateSyncRequest('invoice', params);
            this.facture.state = 'open'; 
            this.odooServ.updateNoSync('invoice', this.facture, this.facture.id, 'standart');
            this.odooServ.showMsgWithButton(this.txtLangue.validate,'top');
          }
        }
      ]
    });
    alert.present();

  }

  /**
   * Cette fonction permet d'afficher
   * le formulaire et de le modifier
   * @param <Object> objet, l'objet à modifier
   **/ 
  callForm(objet, type, action){
      
    let params;

    if(action!='copy')
      params = {'objet': objet, 'action': 'update'}
    else
      params = {'objet': objet, 'action':'copy'};

    let addModal = this.modalCtrl.create('FormInvoicePage', params);
    let message; 
     
   //callback when modal is dismissed (recieve data from View)
   addModal.onDidDismiss((data) => {

      if(data){
                
        if(action!='copy'){
          
          message = this.txtLangue.maj_invoice;
          
          if(objet.id==0)
            this.odooServ.showMsgWithButton(this.txtLangue.no_sync,"top");
          else{
            this.odooServ.updateNoSync('invoice', data, objet.id, 'standart');
            this.odooServ.updateSyncRequest('invoice', data);
          }
                    
        }else{
          message = this.txtLangue.copy_invoice;
          this.odooServ.syncDuplicateObjet('invoice', data);
          this.evEVT.publish('add_invoice:changed', { item: data, id: this.facture.id});
          this.odooServ.copiedAddSync('invoice', data);
        }
        
        this.odooServ.showMsgWithButton(message,'top');
         
      }

    });

    addModal.present();
 }

  openLeftMenu(){
    this.menuCtrl.open();
  }

  copyInvoice(){

    let objInvoice = new Invoice('n', null);
    
    objInvoice = Object.assign({}, this.facture);
    objInvoice.name = objInvoice.name + ' (copy)';
          
    if(this.facture.id!=0)
      this.callForm(objInvoice, 'invoice', 'copy');
    else
      this.odooServ.showMsgWithButton(this.txtLangue.no_sync_copy,"top");
  }

  editInvoice(){
    this.callForm(this.facture, 'invoice', 'update');
  }

  send(){
    
  }

}
