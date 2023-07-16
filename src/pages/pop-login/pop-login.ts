import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, ToastController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pop-login',
  templateUrl: 'pop-login.html',
})
export class PopLoginPage {

  defaultImg: string;
	@ViewChild('PassWord') myInput;

	public user;
	public image;
	public mot_passe="";

  constructor(public vc: ViewController, public navParams: NavParams, public toastCtrl: ToastController) {
  		
  		this.user = this.navParams.get('data');
      this.defaultImg = "assets/images/person.jpg";
      
	   /*  if(!this.user.me.image_url.me)
	      this.image = "assets/images/person.jpg";
	    else
	      this.image = this.user.me.image_url.me; */

  }

  ionViewLoaded() {

    setTimeout(() => {
      this.myInput.setFocus();
    },150);

 }

  //Cette fonction va valider la connexion de
  //l'utilisateur
  login(){

  	if(this.mot_passe!=""){
  		this.vc.dismiss(this.mot_passe);
  	}else{
  		this.displayMessage();
  	}
  	
  }

  //Cette fonction
  displayMessage(){

    let toast = this.toastCtrl.create({
      message: 'Veuillez saisir votre Mot de passe',
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }


}
