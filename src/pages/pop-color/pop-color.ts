import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { AfProvider } from '../../providers/af/af';

@IonicPage()
@Component({
  selector: 'page-pop-color',
  templateUrl: 'pop-color.html',
})
export class PopColorPage {

	public couleur : any;
  public colors = [];
  public activeColor;

  constructor(public navParams: NavParams, public vc: ViewController, private afServ: AfProvider) {
  	this.activeColor = this.navParams.get('couleur');
    this.setPalette();
  }

  ionViewDidLoad() {
    
  }

  //Cette fonction permet de capturer
  //la couleur
  setColor(obj, event){ 
  	
  	this.couleur = obj;
    
    /*let couleurs = event.target.parentNode.children;
    let len = couleurs.length;

    for (let i=0; i < len; i++) {
      couleurs[i].classList.remove('on-activated');
    }
    
    event.target.classList.add('on-activated');*/

    this.vc.dismiss(this.couleur);
  }

  getCurrentCouleur(){
  	
  }

  exitPalette(){
  	this.vc.dismiss();
  }

  setPalette(){
    this.afServ.setPalette((res)=>{
      
      this.colors =res;
    });
  }

}
