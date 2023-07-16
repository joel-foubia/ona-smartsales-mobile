import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pop-note2',
  templateUrl: 'pop-note2.html',
})
export class PopNote2Page {
	public actions = [];
	public maxItems = 5;
	public mask = false;
  public agenda = false;
  public pipeline = false;
  private txtPop;

  constructor(public navParams: NavParams, public vc: ViewController) {
      
      this.txtPop = this.navParams.get('lang');

      if(this.navParams.get('agenda')!==undefined){ 
        this.actions = this.getListModes();
        this.agenda = true;
      }else if(this.navParams.get('pipeline')!==undefined){
        this.actions = this.navParams.get('reasons');
        this.pipeline = true;
      }else{
        this.actions = this.getListOfActions();
      }
  }

  ionViewDidLoad() {}

  onAction(item){
  	if(item.more!==undefined){
  		if(item.more){
  			this.maxItems = 10;
  			this.mask = true;
  		}else{
  			this.maxItems = 5;
  			this.mask =false;
  		}
  	}else{
  		this.vc.dismiss(item);	
  	}
    
  }

  //sélection du mode d'affichage calendrier
  onSelect(item){
    this.vc.dismiss(item);
  }

  //On définit la liste des filtres
  //à appliquer dans la vue liste des notes
  getListOfActions(){
 
  	 let tab = [
  	 	/*{ nom: 'Choisir la couleur' , couleur: true, icon:'ios-color-palette-outline', slug: 'color'},
  	 	{ nom: 'Ajouter une image' , image: true, icon:'ios-image-outline', slug: 'img'},
  	 	{ nom: 'Dictatophone' , micro: true, icon:'ios-mic-outline', slug: 'micro'},
  	 	{ nom: 'Archiver' , archive: true, icon:'ios-archive-outline', slug: 'archive'},
  	 	{ nom: 'Plus' , more: true, icon:'ios-more', slug: 'more'},
  	 	{ nom: 'Supprimer' , corbeille: true, icon:'ios-trash-outline', slug: 'corbeille'},*/
  	 	// { nom: this.txtPop.tag, tag: true, icon:'ios-pricetag-outline', slug: 'tag'},
  	 	{ nom: this.txtPop.copy, copie: true, icon:'ios-copy-outline', slug: 'copie'},
  	 	{ nom: this.txtPop.share, share: true, icon:'share-alt', slug: 'share'},
  	 	//{ nom: 'Réduire' , more: false, icon:'ios-arrow-up-outline', slug: 'reduce'}
  	 ];

  	 return tab;
  }

  //Cette fonction permet de retourner
  //la liste des modes
  getListModes(){

    return [
      { nom: this.txtPop.month, slug: 'month'},
      { nom: this.txtPop.week, slug: 'week'},
      { nom: this.txtPop.day, slug: 'day'},
      { nom: this.txtPop.list_view, slug: 'list'}
    ];
  }

}
