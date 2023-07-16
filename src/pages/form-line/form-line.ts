import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController, PopoverController, ModalController, IonicPage } from 'ionic-angular';
// import { PopTagPage } from '../../pages/pop-tag/pop-tag';
// import { HelperPage } from '../../pages/helper/helper';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { AffaireProvider } from '../../providers/affaire/affaire';
import { InvoiceLine } from '../../models/invoice-line';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-form-line',
  templateUrl: 'form-line.html',
})
export class FormLinePage {

  taxes: any = [];
  listAccounts: any;
  is_modif: boolean;
  line: any;
  current_lang: string;
  action: any;
  private txtPop;
  private txtLangue;
  
  constructor(public vc: ViewController, public navParams: NavParams, private lgServ: LoginProvider, private formAff: AffaireProvider, public toastCtrl: ToastController, private odooServ: OdooProvider, public popCtrl: PopoverController, public translate: TranslateService, public modalCtrl: ModalController) {
    this.translate.get(['module','pop']).subscribe(_res=>{
      this.txtPop = _res.pop;
      this.txtLangue = _res.module.facture;
    });
 
    this.current_lang = this.translate.getDefaultLang();
    this.line = this.navParams.get('objet');
    this.action = this.navParams.get('action');
          
    if(this.line==null || this.line=='')
      this.line = new InvoiceLine('n', null);
    else
      this.is_modif = true;
    
      this.onSelectObjet('account');
  }
  
  ionViewDidLoad() {
  }

  //Fermer le formulaire
  close(){
  	this.vc.dismiss();
  }

  //Cette fonction est appelé lorsque l'on clique
  //sur le bouton <Modifier> du formulaire
  saveItem(){

    let newItem = this.line;
    if(this.line.product_id.id==0)
      this.initPrice();
      
    if(!this.is_modif && this.line.name!='')
  	   this.vc.dismiss(newItem);
    else if(this.is_modif)
       this.vc.dismiss(newItem);
    else
      this.displayMessage(this.txtLangue.fail_description);
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

  /**
   * Cette fonction permet de modifier la
   * les attributs de l'objet affaire
   **/
  changeValue(event,type){
        
    switch(type){
      case 'account':{ 
        this.line.account_id.name = this.find(event, this.listAccounts, '');
        break;
      }      
    }
  }

  //On affiche la liste des comptes
  onSelectObjet(type){

    this.lgServ.isTable('_ona_'+type).then(data=>{
      
      if(data){
        let res = JSON.parse(data);
        if(type=='account')
          this.listAccounts = res;
        }else{
          this.formAff.setListObjetsByCase(type, false, (res)=>{
        
            if(type=='account')
              this.listAccounts = res;
            
            this.lgServ.setTable('_ona_'+type, res);
          });
        }

    });

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

  //Cette fonction permet d'afficher la liste des taxes
  //ou la liste des rappels
  private loadObjetsFromRemote(type){
  	
  	let elements = [];
  	elements = this.line.invoice_line_tax_ids;
  	
  	//console.log(elements);
    this.odooServ.getTags(type, elements, false, (res)=>{
      //console.log(res);
      this.taxes = res;
    });

  }


  //Ajouter un tag ou un reminder à partir d'une 
  //fenêtre Pop up
  addObjetFromPop(event, type){
  	
  	let elements = [];
  	elements = this.taxes;

  	let popover = this.popCtrl.create('PopTagPage', {'tax':type, 'lang': this.txtPop}, {cssClass: 'custom-popaudio'});
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
            	if(this.line.invoice_line_tax_ids.indexOf(result.tab[i])==-1 || this.line.invoice_line_tax_ids.length==0)
              		this.line.invoice_line_tax_ids.push(result.tab[i]);
          }

          if(result.add!=""){

            this.odooServ.editTag(type, result, (res)=>{
              console.log(res); 
              this.taxes.push(res);
              this.line.invoice_line_tax_ids.push(res.me.id.me);
              this.odooServ.showMsgWithButton("La Taxe ajoutée", 'top');	
            });
          }

          //On met à jour les attributs tags et reminders du Controller
          this.taxes = elements;
        }
  
    });//Fin du Pop Tag 

  }

  //ajouter un tag
  changeTag(tag, type){
    this.odooServ.editTag(type, tag, (res)=>{
      //tag.me.name.me = res;
      this.odooServ.showMsgWithButton(this.txtLangue.maj_tax, 'top');
    });
  }

  //Retirer un tag de l'affaire
  removeTag(tag, index, type){

  	let elements;
    this.taxes.splice(index,1);
    elements = this.line.invoice_line_tax_ids;
   
    //On met à jour les attributs de l'objet
    for(let i = 0; i < elements.length; i++){
      
      if(tag.me.id.me==elements[i]){
        this.line.invoice_line_tax_ids.splice(i,1);
        break;
      }
    }

  }

  //On choisit le client à qui attribuer la facture
  selectPartner(partner){

    let data = { "data": partner, "name":this.line.product_id.name, "lang": this.txtPop }; 
    let modal = this.modalCtrl.create('HelperPage', data);
    modal.onDidDismiss(_data => {
      if (_data) {
        console.log(_data);
        if(partner=='product'){
          this.line.product_id.id = _data.id;
          this.line.product_id.name = _data.name;
          this.line.price_unit = _data.list_price;
          this.line.name = _data.description;
          this.line.account_id = _data.property_account_income_id;
          this.line.price_subtotal = parseInt(this.line.quantity)*parseFloat(this.line.price_unit);
        }
      }
    });
    
    modal.present(); 
  }

  //Cette méthode est appelé lorsq'aucun produit
  //n'a été sélectionné
  initPrice(){
    this.line.price_unit = parseFloat(this.line.price_unit);
    this.line.price_subtotal = parseInt(this.line.quantity)*parseFloat(this.line.price_unit);
  }

}
