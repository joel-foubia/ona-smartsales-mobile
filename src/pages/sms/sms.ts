import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-sms',
  templateUrl: 'sms.html',
})
export class SmsPage {
	
	public description;
  constructor(public navCtrl: NavController, public navParams: NavParams, public vc: ViewController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {}

  sendMessage(){

  	let objMessage = this.description;
  	
  	if(objMessage){
  		//close current wien and pass data
  		this.vc.dismiss(objMessage);
  	}else{
  		let toast = this.toastCtrl.create({
		    message: "Veuillez écrire un message avant d'envoyer votre SMS",
		    duration: 3000,
		    position: 'top'
		  });
  		toast.present();
  	}
  	

  }

  //Fermer le formulaire
  close(){
  	this.vc.dismiss();
  }

}
