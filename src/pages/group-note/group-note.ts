import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-note',
  templateUrl: 'group-note.html',
})
export class GroupNotePage {

  public groupes;
  public type;
  constructor(public vc: ViewController, public navParams: NavParams) {

    if(this.navParams.get('note')!==undefined){
      this.type = "les notes";
      this.groupes = this.getListGroupes();
    }
    else if(this.navParams.get('res.partner')!==undefined){
      this.type = "les "+this.navParams.get('res.partner');
      this.groupes = this.filtrePartners();
    }
    else if(this.navParams.get('pipeline')!==undefined){
      this.type = "";
      this.groupes = this.filtreAffaires();
    }
  	
  }

  onAction(item){
    this.vc.dismiss(item);
  }

  //On définit la liste des critères
  //à appliquer dans la vue liste des notes
  getListGroupes(){

  	 let tab = [
  	 	{ nom: 'Couleur' , icon:'ios-clipboard-outline', slug: 'couleur', ch: 'color'}
      // { nom: 'Affaires' , icon:'ios-archive-outline', slug: 'affaire', ch: 'file_id'}
  	 ];

  	 return tab;
  }

  //On définit la liste des critères
  //à appliquer dans la vue liste des clients, tribunaux, et contacts
  filtrePartners(){

     let tab = [
      { nom: 'Genre' , icon:'ios-people-outline', slug: 'genre', ch: 'bitcs_genre'},
      { nom: 'Titre' , icon:'ios-man-outline', slug: 'title', ch: 'title'}
     ];

     return tab;
  }

  //On définit la liste des critères
  //à appliquer dans la vue liste des affaires
  filtreAffaires(){

     let tab = [
      { nom: 'Team Sales' , icon:'ios-browsers-outline', slug: 'team', ch: 'bitcs_nature'},
      { nom: 'All' , icon:'ios-school-outline', slug: 'all', ch: 'bitcs_lawyer'}
     ];

     return tab;
  }

}
