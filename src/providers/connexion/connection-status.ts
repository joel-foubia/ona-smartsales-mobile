import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';
import * as moment from 'moment';


@Injectable()
export class ConnectionStatusProvider {

	private flag = '_ona_flag';

	constructor(
		public storage: Storage,
		public network: Network,
		public toast: ToastController,
	) {}

  /**
   * Function called in the constructor of any view to check internet status and last sync date
   * 
   */
	checkconnstatus(alias) {

		return new Promise((resolve, reject)=>{
			
			this.storage.get(this.flag).then(flag => {
				
				this.storage.get(alias+'_date').then(date => {
					if (flag === false && !date) {
						resolve('i'); //No data save
						console.log('Connect To internet to view content');
					} else if (flag === false && date) {
						resolve('s'); //read data from storage
						console.log('Reading from storage');
					} else if (flag === true && date) {
						if (date === moment().format('DD.MM.YYYY')) {
							resolve('s');
							console.log('Reading from Storage');
						}else{
							resolve('w');
							console.log('Reading from Server and Synchronize with storage');
						}
					} else if (flag === true && !date) {
						resolve('rw');
						console.log('Reading from Server and save data to storage');
					}
				});
			});
		});
		
  }
  
  /**
   * Function called in app.component.ts to check availability of internet connection and last 
   * sync date
   */
  checkstatus(){

    if(this.network.type === 'unknown' || this.network.type === 'none' || this.network.type === 'undefined') {
			this.storage.set(this.flag, false);
			
		} else {
			this.storage.set(this.flag, true);
			
		}
  }

	
}
