import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pop-filter',
  templateUrl: 'pop-filter.html',
})
export class PopFilterPage {

  is_piste: boolean;
  txtUser: any;
	public filtres = [];
  public tabs = [];
  public is_sale =  false;
  private isPartner = false;
  public is_agenda = false;
  public is_task = false;
  public is_invoice = false;
  public type_partner="";
  private txtPop;

  constructor(public navParams: NavParams, public vc: ViewController) {
    
    this.txtPop = this.navParams.get('lang');
    this.txtUser = this.navParams.get('user');

    if(this.navParams.get('note')!==undefined)
  	  this.filtres = this.getListFiltre();
    else if(this.navParams.get('res.partner')!==undefined){
      this.type_partner = this.navParams.get('res.partner');
      this.isPartner = true;
      //Définition des filtres en fonction du partner
      if(this.type_partner == 'call'){
        this.filtres = this.filterCalls();
      }

      if(this.type_partner=='client')
        this.filtres = this.filtreClients();
      else if(this.type_partner=='contact')
        this.filtres = this.filtreContacts();
      else if(this.type_partner=='opportunity')
        this.filtres = this.filtreOpports();
      
    }else if(this.navParams.get('agenda')){
      this.filtres = this.filterAgenda();
      this.is_agenda = true;
    }
    else if(this.navParams.get('events')!==undefined){
      this.isPartner = true;
      this.filtres = this.filtreEvents();
    }
    else if(this.navParams.get('invoices')!==undefined){
      this.filtres = this.filtreInvoices();
      this.is_invoice = true;
    }
    else if(this.navParams.get('sale')!==undefined){
      this.filtres = this.filtreSales();
      this.is_sale = true;
    }
    else if(this.navParams.get('piste')!==undefined){
      this.filtres = this.filtrePiste();
      this.is_piste = true;
    }
      
  }

  ionViewDidLoad() {}

  onAction(item){
    this.vc.dismiss(item);
  }

  //On définit la liste des filtres
  //à appliquer dans la vue liste des notes
  private getListFiltre(){

  	 let tab = [
  	 	{ nom: this.txtPop.notes, active: true, isActif: 'True', icon:'ios-clipboard-outline', slug: 'note'},
  	 	{ nom: this.txtPop.f_archive, active: false, isActif: 'False', icon:'ios-archive-outline', slug: 'archive'},
  	 	// { nom: this.txtPop.f_rappel , rappel: true, isActif: 'True', icon:'ios-notifications-outline', slug: 'rappel'},
  	 	//{ nom: 'Supprimées' , corbeille: true, isActif: 'True', icon:'ios-trash-outline', slug: 'corbeille'}
  	 ];

  	 return tab;
  }

  //Filtre pour les factures
  private filtreInvoices(){
      let tab = [
        { nom: this.txtPop.draft , active: true, slug: 'draft'},
        { nom: this.txtPop.open , active: false, slug: 'open'},
        { nom: this.txtPop.paid , active: false,  slug: 'paid'},
        { nom: this.txtPop.proforma , active: false,  slug: 'proforma'},
        { nom: this.txtPop.cancel , active: false,  slug: 'cancelled'},
        { nom: this.txtPop.bill , active: false,  slug: 'all'}
     ]; 

     return tab;
  }

  //Filtre des pistes
  private filtrePiste(){
      let tab = [
        { nom: this.txtPop.leads, icon:'ios-clipboard-outline', slug: 'pistes'},
        { nom: this.txtPop.notes, icon:'ios-clipboard-outline', slug: 'notes'},
        { nom: this.txtPop.f_archive, icon:'ios-archive-outline', slug: 'archive'},
    ]; 

    return tab;
  }
  
  //Filtre pour les factures
  private filtreSales(){
    let isManager = false;
    if(this.txtUser){
      isManager = true;
    }
      let tab = [
        // { nom: this.txtPop.draft , active: true, slug: 'draft'},
        { nom: this.txtPop.sent , active: false, slug: 'sent'},
        { nom: this.txtPop.cancel , active: false,  slug: 'cancel'},
        { nom: this.txtPop.invoiced , active: false,  slug: 'invoice'},
        { nom: this.txtPop.expired, active: false,  slug: 'expired'},
        { nom: this.txtPop.all , active: isManager,  slug: 'all'}
     ]; 

     return tab;
  }


  //Cette fonction permet d'afficher les filtres
  private filterAgenda(){
      
    let tab = [
      { nom: this.txtPop.all,  icon:'ios-person-outline', slug: 'person'},
     ];

     return tab;     
  }

  //Liste des filtres à appliquer sur la vue liste clients
  private filtreClients(){

    let tab = [
      { nom: this.txtPop.person, icon:'ios-person-outline', slug: 'person'},
      { nom: this.txtPop.company, icon:'ios-people-outline', slug: 'company'},
      { nom: this.txtPop.near_me, icon:'ios-cash-outline', slug: 'nearme'},
      { nom: this.txtPop.meeting, icon:'ios-archive-outline', slug: 'meeting'},
      { nom: this.txtPop.opportunity, icon:'ios-man-outline', slug: 'opportunity'},
      { nom: this.txtPop.f_archive , icon:'ios-archive-outline', slug: 'archive'},
      //{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
     ];

     return tab; 
  }
  
  //Liste des filtres à appliquer sur la vue liste contacts
  private filtreContacts(){

    let tab = [
      { nom: this.txtPop.person, icon:'ios-person-outline', slug: 'person'},
      { nom: this.txtPop.company, icon:'ios-people-outline', slug: 'company'},
      // { nom: this.txtPop.near_me, icon:'ios-cash-outline', slug: 'nearme'},
      { nom: this.txtPop.meeting, icon:'ios-archive-outline', slug: 'meeting'},
      // { nom: this.txtPop.opportunity, icon:'ios-man-outline', slug: 'opportunity'},
      { nom: this.txtPop.f_archive , icon:'ios-archive-outline', slug: 'archive'}
      //{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
     ];

     return tab; 
  }

  //Liste des filtres à appliquer sur les vues 
  //leads or opportunities
  private filtreOpports(){

    let tab = [
      { nom: this.txtPop.txt_opport,  icon:'ios-person-outline', slug: 'activity'},
      { nom: this.txtPop.call_queue,  icon:'ios-people-outline', slug: 'call'},
      { nom: this.txtPop.meeting, icon:'ios-man-outline', slug: 'meeting'},
      { nom: this.txtPop.deadline, icon:'ios-woman-outline', slug: 'deadline'},
      { nom: this.txtPop.win_opport, icon:'ios-archive-outline', slug: 'probability'},
      { nom: this.txtPop.priority, icon:'ios-archive-outline', slug: 'priority'}
      //{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
    ];

     return tab;
  }

  //Liste des filtres à appliquer sur la vue
  //liste des évènements
  private filtreEvents(){

    let tab = [
      { nom: this.txtPop.coming_soon, icon:'ios-clipboard-outline', slug: 'incoming'},
      { nom: this.txtPop.events,  icon:'ios-cash-outline', slug: 'own'},
      { nom: this.txtPop.booked, icon:'ios-archive-outline', slug: 'booked'},
      { nom: this.txtPop.open_event, icon:'ios-archive-outline', slug: 'open'},
      { nom: this.txtPop.week_event, icon:'ios-archive-outline', slug: 'week'},
      { nom: this.txtPop.f_archive, icon:'ios-archive-outline', slug: 'archive'},
      { nom: this.txtPop.all_event, icon:'ios-archive-outline', slug: 'all'},
      //{ nom: 'Supprimées' , icon:'ios-trash-outline', slug: 'corbeille'}
    ];

     return tab;
  }

  private filterCalls(){
    let tab = [
      { nom: this.txtPop.todo , icon:'ios-clipboard-outline', slug: 'open'},
      { nom: this.txtPop.today,  icon:'ios-cash-outl$ine', slug: 'Today'},
      { nom: this.txtPop.all_call , icon:'ios-archive-outline', slug: 'default'},
      { nom: this.txtPop.team_call, icon:'ios-trash-outline', slug: 'team_id'}
    ];

     return tab;
  }
  
  //Cette fonction permet de remplir le 
  //tableau des valeurs cochées
  onChange(tag, checked){
    
    if(checked){
      this.tabs.push({'slug':tag.slug,'nom':tag.nom});
    }else{
      for (var i = 0; i < this.tabs.length; i++) {
        if(this.tabs[i]== tag.slug){
          this.tabs.splice(i,1);
          break;
        }
      }

    }
    
  }

  //click on finish
  onFinish(){
    this.vc.dismiss(this.tabs);
  }

}
