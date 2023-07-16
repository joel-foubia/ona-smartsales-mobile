import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController, PopoverController, IonicPage, ModalController} from 'ionic-angular';
// import { PopStagePage } from '../pop-stage/pop-stage';
import { ImageProvider } from '../../providers/image/image';
import { TranslateService } from '@ngx-translate/core';
// import { Partner } from '../../models/partner';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Evenement } from '../../models/event';

@IonicPage()
@Component({
  selector: 'page-form-event',
  templateUrl: 'form-event.html',
})
export class FormEventPage {
  
  user: any;
  types: any = [];
  txtPop: any;
  section: string;
	public objEvent : Evenement;
  public modif;
  public copy = false;
  public the_partner;
  // public default;
  // public photo;

  constructor(public navParams: NavParams, public vc: ViewController, public toastCtrl: ToastController, public popCtrl: PopoverController, private imgServ: ImageProvider, public translate: TranslateService, private lgServ: LoginProvider, private odooServ: OdooProvider, public modalCtrl: ModalController) {
  		
  		
      this.modif = this.navParams.get('modif');
      this.section = "post";
      this.the_partner = 'event';

      this.translate.get('pop').subscribe(_res=>{
        this.txtPop = _res;
      });
      
      if(this.navParams.get('copy')!==undefined){
        this.copy = true;
      }

      if(this.modif){
        this.objEvent = this.navParams.get('objet');
      }else{
        this.objEvent = new Evenement(null);
      }
      
      
      this.lgServ.isTable('me_avocat').then(res => {
        if (res) 
          this.user = JSON.parse(res);			
        
        console.log(this.user);
        this.objEvent.date_tz = this.user.tz.id;    
        console.log(this.objEvent);
        
      });

      this.onSelectObjet('type_event');
       
  }

  ionViewDidLoad() {}

  onSegmentChanged(event){

  }

  saveItem(){
    let newItem : any;
  	
    newItem = this.objEvent;
    if(!this.modif && this.objEvent.name!="" && this.objEvent.date_begin!="" && this.objEvent.date_end!=""){
      this.vc.dismiss(newItem);
    }else if(this.modif)
      this.vc.dismiss(newItem);
    else  
      this.odooServ.showMsgWithButton("Veuillez remplir le Nom de l'évènement et définir une date de début et une date de fin","top",'toast-error');
  }

  //Fermer le formulaire
  close(){
  	this.vc.dismiss();
  }

   /**
   * Cette fonction permet de modifier la
   * les attributs de l'objet audience
   **/
  changeValue(event, type){
        
    switch(type){
      case 'type_event':{ 
        this.objEvent.event_type_id.name = this.find(event, this.types, '');
        break;
      }
   
    }

  }

  /**
   * Cette fonction permet de rechercher 
   * un objet dans une liste
   * @param id int, identifiant de l'objet à rechercher
   * @param list Array<any>, liste des objets dans laquelle effectuer la rechercher
   * @param type string, le type d'objet
   * 
   * @returns any
   */
  private find(id, list, type){

    for (let i = 0; i < list.length; i++) {    
        if(list[i].me.id.me==parseInt(id))
            return list[i].me.name.me;
    }

  }

  //Cette fonction va récupérer la liste
  //des natures d'audiences, les statuts, les tribunaux
  //les employés qui sont enregistrés en bd
  //@param type string, correspond au type d'objet que l'on souhaite récupérer
  onSelectObjet(type){

  	let alias = type;
   
    this.lgServ.isTable('_ona_'+alias).then(data=>{
      
      if(data){
        let res = JSON.parse(data);
        if(type=='type_event')
          this.types = res;
      }else{

        this.odooServ.requestObjectToOdoo(alias, null, null, false, (res)=>{
          if(type=='type_event')
            this.types = res;
          
          this.lgServ.setTable('_ona_'+alias, res);
        });
      }

    });

  }


  /**
   * Cette fonction permet de sélectionner les élements
   * dans une liste
   * @param partner string, le nom du modèle
   */
  selectPartner(partner, champ){

    let data = { "data": partner }; 
    let modal = this.modalCtrl.create('HelperPage', data);
    modal.onDidDismiss(_data => {
      if (_data) {
        // console.log(_data);
        if(partner=='contact'){
          if(champ=='org'){
            this.objEvent.organizer_id.id = _data.id;
            this.objEvent.organizer_id.name = _data.display_name;
          }else{
            this.objEvent.address_id.id = _data.id;
            this.objEvent.address_id.name = _data.display_name;
          }
        }
      }

    });
    modal.present();
  }


}
