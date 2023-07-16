import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, ModalController, ToastController, Slides, IonicPage } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { AffaireProvider } from '../../providers/affaire/affaire';
import { Invoice } from '../../models/invoice';

// import { HelperPage } from '../../pages/helper/helper';
// import { FormLinePage } from '../../pages/form-line/form-line';
import { TranslateService } from '@ngx-translate/core';
import { Partner } from '../../models/partner';
// import { Project } from '../../models/project';

@IonicPage()
@Component({
  selector: 'page-form-invoice',
  templateUrl: 'form-invoice.html',
})
export class FormInvoicePage {

  @ViewChild('formSlide') slides: Slides;
  
  listMonnaies: any = [];
  listJournals: any = [];
  listCompanies: any = [];
  // listAffaires: any = [];
  
  public invoice : any;
  // public affaire : any;
  public lignes: Array<any> = [];
  public is_modif = false;
  public action; 
  public listPeriods = [];
  public listAccounts = [];
  private user;
  public current_lang;
  private txtLangue;
  private txtPop;

  constructor(public vc: ViewController, public navParams: NavParams, private lgServ: LoginProvider, public modalCtrl: ModalController, public toastCtrl: ToastController, private formAff: AffaireProvider, public translate: TranslateService) {
      
      this.current_lang = this.translate.getDefaultLang();
      this.translate.get(['pop','module']).subscribe(_res=>{
        this.txtPop = _res.pop;
        this.txtLangue = _res.module.facture;
      });

  	  this.invoice = this.navParams.get('objet');
      this.action = this.navParams.get('action');
      // this.affaire = this.navParams.get('affaire');
      
      if(this.invoice==null){
        this.invoice = new Invoice('n', null);
      }
      else
        this.is_modif = true;


      //Load list of objets
      this.onSelectObjet('account');
      this.onSelectObjet('payment_term');
      this.onSelectObjet('payment_method');
      this.onSelectObjet('currency');
      this.onSelectObjet('company');
      // this.onSelectObjet('briefcase');
      
      //Init Form
      this.initFOrm();
  }

  ionViewDidLoad() {
    
  }

  //Cette fonction permet d'initialiser le
  //formulaire
  initFOrm(){
    this.lgServ.isTable('me_avocat').then(res=>{
      if(res){
        this.user = JSON.parse(res);
        this.invoice.company_id = this.user.company_id;
        this.invoice.currency_id = this.user.currency_id;
        this.invoice.date_invoice = this.lgServ.getCurrentDate();
        
        // if(this.affaire!==undefined){
        //   this.invoice.partner_id = this.affaire.partner_id;
        // }
        console.log(this.invoice);
        this.getListLines();
      }
    });
  } 

  //Cette fonction est appelé lorsque l'on clique
  //sur le bouton <Modifier> du formulaire
  saveItem(){

    this.invoice.date_due = new Date();
  	let newItem = this.invoice;
    
    if(parseInt(this.invoice.partner_id.id)==0)
      this.displayMessage(this.txtLangue.fail_customer);
    else if(parseInt(this.invoice.account_id.id)==0)
      this.displayMessage(this.txtLangue.fail_account);
    else if(parseInt(this.invoice.company_id.id)==0)
      this.displayMessage(this.txtLangue.fail_company);
    else if(parseInt(this.invoice.journal_id.id)==0)
      this.displayMessage(this.txtLangue.fail_method);
    else if(parseInt(this.invoice.currency_id.id)==0)
      this.displayMessage(this.txtLangue.fail_currency);
    else if(!this.is_modif && parseInt(this.invoice.partner_id.id)!=0)
  	   this.vc.dismiss(newItem);
    else if(this.is_modif)
       this.vc.dismiss(newItem);
    else
      this.displayMessage(this.txtLangue.fail_form);
  }

  //Fermer le formulaire
  close(){
  	this.vc.dismiss();
  }

    //Cette fonction permet d'afficher les erreurs
  displayMessage(msg){ 
    
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    });

    toast.present();
  }

  //On choisit le client à qui attribuer la facture
  selectPartner(partner){

    let data = { "data": partner, "name":this.invoice.partner_id.name, "lang":this.txtPop }; 
    let modal = this.modalCtrl.create('HelperPage', data);
    modal.onDidDismiss(_data => {
      if (_data) {
        console.log(_data);
        if(partner=='client')
          this.invoice.partner_id = _data;
      }
    });
    modal.present();
  }

    /**
   * Cette fonction permet de modifier la
   * les attributs de l'objet affaire
   **/
  changeValue(event,type){
    //console.log(event);
    
    switch(type){
      case 'payment':{ 
        this.invoice.payment_term_id.name = this.find(event, this.listPeriods, '');
        break;
      }
      case 'company':{ 
        this.invoice.company_id.name = this.find(event, this.listCompanies, '');
        break;
      }
      case 'journal':{ 
        this.invoice.journal_id.name = this.find(event, this.listJournals, '');
        break;
      }
      case 'currency':{ 
        this.invoice.currency_id.name = this.find(event, this.listMonnaies, '');
        break;
      }      
     
    }

  }

  //Cette fonction permet de 
  //retrouver un objet à partir de l'id
  //@param id int, identifiant de l'objet recherché
  //@return string
  private find(id, list, type){

    for (let i = 0; i < list.length; i++) {
    
        if(list[i].me.id.me==parseInt(id)){
            return list[i].me.name.me;
         }  
    }

  }

  //Cette fonction permet de charger les projets
  // loadProject(res){
  //   let results = [];

  //   for(let i = 0; i < res.length; i++)
  //     results.push(new Project(res[i]));

  //   return results;
  // }

  //Cette fonction va récupérer la liste
  //des comptes, des méthodes de paiements, les entreprises
  //les monnaies, et les termes de paiements
  //@param type string, correspond au type d'objet que l'on souhaite récupérer
  onSelectObjet(type){

    this.lgServ.isTable('_ona_'+type).then(data=>{
      
      if(data){
        let res = JSON.parse(data);
        if(type=='account')
          this.listAccounts = res;
        else if(type=='payment_term') 
          this.listPeriods = res;
        else if(type=='payment_method') 
          this.listJournals = res;
        else if(type=='company') 
          this.listCompanies = res;
        else if(type=='currency') 
          this.listMonnaies = res;

        }else{
          this.formAff.setListObjetsByCase(type, false, (res)=>{
        
            if(type=='account')
              this.listAccounts = res;
            else if(type=='payment_term') 
              this.listPeriods = res;
              else if(type=='payment_method') 
              this.listJournals = res;
            else if(type=='company') 
              this.listCompanies = res;
            else if(type=='currency') 
              this.listMonnaies = res;
            
            this.lgServ.setTable('_ona_'+type, res);

          });
        }

    });

  }

  //Cette fonction permet d'obtenir la liste
  //des invoices lines
  getListLines(){
    this.lgServ.isTable('_ona_invoice-line').then(res=>{
      let lines = JSON.parse(res);
      
      for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        if(this.invoice.invoice_line_ids.indexOf(element.id)>-1)
          this.lignes.push(element);
      }

    });
   
  }

  //Cette méthode permet d'ajouter une ligne de facture
  addLine(item){

    if(this.invoice.partner_id.id==0){
      this.displayMessage(this.txtLangue.fail_line);
      return;
    }

    let data = { "objet": item };
    let modal = this.modalCtrl.create('FormLinePage', data);
    modal.onDidDismiss(data => { 
      if(data) { 
        console.log(data);
        let element = data;
        element.currency_id = this.invoice.currency_id;
        element.partner_id = this.invoice.partner_id;

        this.invoice.lines.push(element);
        this.lignes.push(element);
        console.log(this.invoice);
      }
    });
    modal.present();
  } 

}
