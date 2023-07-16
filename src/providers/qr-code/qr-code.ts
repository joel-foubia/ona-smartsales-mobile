import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Injectable()
export class QrCodeProvider {

  constructor(public toastCtrl: ToastController, private qrScanner: BarcodeScanner) {
    
  }

  scan(){

  	return new Promise((resolve, reject) => {

		this.qrScanner.scan().then((barcodeData) => {
		 resolve(barcodeData);
		}, (err) => {
		    reject(err);
		});

	});

  }

  //Cette fonction permet d'afficher les messages
  showMessage(msg){
  	
  	let toast = this.toastCtrl.create({
	    message: msg,
	    duration: 5000,
	    position: 'top'
	  });
	  
	toast.present();
  }

}
