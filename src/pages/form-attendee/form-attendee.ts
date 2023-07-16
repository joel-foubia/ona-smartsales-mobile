import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController, PopoverController, IonicPage, ModalController} from 'ionic-angular';
// import { PopStagePage } from '../pop-stage/pop-stage';
// import { ImageProvider } from '../../providers/image/image';
import { TranslateService } from '@ngx-translate/core';
// import { Partner } from '../../models/partner';
import { LoginProvider } from '../../providers/login/login';
import { OdooProvider } from '../../providers/odoo/odoo';
import { Participant } from '../../models/participant';
import { Ticket } from '../../models/ticket';


@IonicPage()
@Component({
  selector: 'page-form-attendee',
  templateUrl: 'form-attendee.html',
})
export class FormAttendeePage {
  tickets: any = [];
  txtPop: any;
  section: string;
	public participant : Participant;
  public modif;
  public copy = false;
  public the_partner;
  public evenement;
  public photo;

  constructor(public navParams: NavParams, public vc: ViewController, public toastCtrl: ToastController, public popCtrl: PopoverController, public translate: TranslateService, private lgServ: LoginProvider, private odooServ: OdooProvider, public modalCtrl: ModalController) {
  		
  		
      this.modif = this.navParams.get('modif');
      this.evenement = this.navParams.get('current_event');
      // this.section = "post";

      this.translate.get('pop').subscribe(_res=>{
        this.txtPop = _res;
      });
      
      if(this.navParams.get('copy')!==undefined){
        this.copy = true;
      }

      if(this.modif){
        this.the_partner = this.navParams.get('type');
        this.participant = this.navParams.get('objet');
        // this.photo = this.participant.image_url;
      }else{
        this.the_partner = this.navParams.get('type');
        this.participant = new Participant(null);
        this.initForm();
      }
      
      console.log(this.participant);
      this.onSelectObjet('ticket');
       
  }

  ionViewDidLoad() {}

  //Cette fonction permet d'initialiser l'objet Participant
  initForm(){
    this.participant.state = 'open';
    this.participant.date_open = this.odooServ.formatUTF(this.participant.date_open);
    this.participant.event_id.id = this.evenement.id;
    this.participant.event_id.name = this.evenement.name;
  }


  saveItem(){
    let newItem : any;
  	
    newItem = this.participant;
    if(!this.modif && this.participant.name){
      this.vc.dismiss(newItem);
    }else if(this.modif)
      this.vc.dismiss(newItem);
    else  
      this.odooServ.showMsgWithButton("Veuillez remplir le Nom du participant et son ticket","top",'toast-error');
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
      case 'ticket':{ 
        this.participant.event_ticket_id.name = this.find(event, this.tickets, '');
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
        if(list[i].id ==parseInt(id))
            return list[i].name;
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
        if(type=='ticket')
          this.tickets = this.ticketsByEvent(res);
          console.log(res);
      }else{

        this.odooServ.requestObjectToOdoo(alias, null, null, false, (res)=>{
          let results = [];
          if(type=='ticket'){
            for (let j = 0; j < res.length; j++) 
              results.push(new Ticket(res[j]));  
          }

          this.tickets = this.ticketsByEvent(results);
          this.lgServ.setTable('_ona_'+alias, results);
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
        
        if(partner=='contact'){
            this.participant.partner_id.id = _data.id;
            this.participant.partner_id.name = _data.name;
            this.participant.email = _data.email;
            this.participant.phone = _data.phone;
        }
      }

    });
    
    modal.present();
  }

  /**
   * Cette fonction permet de filtrer les
   * tickets en fonction de l'évènement
   */
  ticketsByEvent(tickets: Array<Ticket>){
    let results = [];
    
    for (let j = 0; j < tickets.length; j++) {
      if(tickets[j].event_id.id==this.evenement.id)
        results.push(tickets[j]);
      
    }

    return results;
  }

}
