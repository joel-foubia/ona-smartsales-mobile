import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LoginProvider } from '../login/login';


@Injectable()
export class AfProvider {

	private items: any;
	// private userInfos: any;

  constructor(private afDB: AngularFireDatabase, public toastCtrl: ToastController, private lgServ: LoginProvider, private offServ: AngularFireOfflineDatabase) {
    //console.log('Hello AfProvider Provider');
  }

  /**
   * Cette fonction va vérifier que
   * cette utilisateur est bien enregistré
   * dans la BD
   * @param idAbonne string, le numéro de l'abonné
   * @param idClient string, le numéro client
   * @return callback
   *
   **/
  login(idAbonne, idClient, callback){
  	
    return this.afDB.list('/subcription').subscribe(_data =>{
    	
      let tab_client : any;
      let isClient = false;
      let tab_abonne : any;
      let isAbonne = false;

      for (var key in _data) {
	       	    
	       tab_client = _data[key];
      
         if(tab_client.$key==idClient){
            isClient = true;

            for(var j in tab_client){

              tab_abonne = tab_client[j];
              if(tab_abonne.subNumber==idAbonne){
                isAbonne=true;
      
                callback({correct:true, data: tab_abonne});
                break;
              }
            }

            break;
         }
	    }

      if(!isClient){
        callback({correct:false, data: "Vous n'êtes pas encore enregistré sur la plateforme ONA SMART SALES"});  
      }

      if(isClient && !isAbonne){
        callback({correct:false, data: "Ce numéro d'abonnement est incorrecte. Réessayer avec un numéro d'abonnement VALIDE"});
      }
    }); 

  }

  /**
	 * Cette fonction permet de vérifier que l'abonnement
	 * de l'utilisateur n'a pas expiré
	 * @author Arthur Dave
	 */
	isAbonne(){
    
    return new Promise((resolve, reject)=>{
      
      this.lgServ.getDataAbonne().then(res=>{
				let data_abonne = JSON.parse(res);
        this.login(data_abonne.abonne, data_abonne.client, (res)=>{
                  
          //console.log(res);
          // params.objSpinner.isActif(false);
          if(res.correct){ 

            //Si l'abonnement est toujours active
            if(res.data.active){
              resolve(res.data);
            }else{
              reject({error:2}); //Abonnement expiré
            }

          }else{
            reject({error:3}); //client et abonné non défini
          }
 
        });

      });
      
    });
    
	}


  /***
   * Cette fonction permet d'afficher
   * les informations A Propos de l'entreprise
   *
   **/
  getInfosAbout(callback){

    return this.offServ.list('/about').subscribe( _data =>{

      let result = {};

      for(var i in _data){
        let current = _data[i];
        let key = current.$key;
        
        if(key=='map'){
          result['map'] = current;
        }else{
          result[key]= current.$value;  
        }
        
      }
      callback(result);

    }); 
  }

  /**
   * Cette fonction permet de récupérer
   * la palette couleur définit pour l'application
   *
   **/
  setPalette(callback){
   
   return this.offServ.list('/palette_couleur').subscribe( _data =>{
      this.lgServ.setTable('palette_ona', _data);
      callback(_data);

    }); 
  }
  
  /**
   * Cette fonction permet de récupérer
   * la palette couleur définit pour l'application
   *
   **/
  getUrlSuscriber(callback){
   
   this.afDB.list('/subscriber_request').subscribe( _data =>{
      // this.lgServ.setTable('palette_ona', _data);
      console.log(_data);
      callback(_data);

    }, (err)=>{
      console.log(err);
    }); 
  }

  /***
   * Cette fonction permet de récupérer
   * l'objet Image in background
   *
   **/
  getImgSplashScreen(callback){

    return this.offServ.list('/start').subscribe( _data =>{

      //console.log(_data);
      callback(_data[0]);

    }); 
  }

  
  /***
   * Cette fonction permet de récupérer
   * les fonctionnalités principales de l'app mobile
   *
   **/
  getListFonctions(callback){

    return this.offServ.list('/fonctions').subscribe( _data =>{
      //this.lgServ.setTable('fonctions_ona', _data);
      callback(_data);

    }); 
  }
  
  /***
   * Cette fonction permet de récupérer
   * les xml_ids (pour la gestion de la sécurité) de l'app mobile
   *
   **/
  getListXmlIds(callback){

    return this.offServ.list('/xml_ids').subscribe( _data =>{
      //this.lgServ.setTable('fonctions_ona', _data);
      callback(_data);

    }); 
  }

  /**
   * Cette fonction permet de récupérer
   * la liste des Questions et Réponses
   *
   **/
  getFAQ(){
   
    return this.offServ.list('/faq');
   }

  /**
   * Cette fonction permet de récupérer le message
   * de la page d'accueil
   */
  getListMessages(){

    return this.offServ.list('/welcomeMessages');
   
  }

  /**
   * Cette fonction renvoie la liste
   * des vendeurs (avec leur id, latitude, longitude)
   */
  listOfSalers(){ 

    return this.afDB.list('/geos_map');
  }

  /**
   * Cette fonction permet d'enregistrer ou de modifier
   * les informations des vendeurs sur firebase
   * @param uuid int, l'identifiant du vendeur
   * @param lat double, latitude du vendeur à insérer
   * @param lng double, longitude du vendeur à insérer
   */
  updateGeolocation(uuid, lat, lng) {
    
    let newData = {
      uuid: uuid,
      latitude: lat,
      longitude: lng
    };

    
    if(localStorage.getItem('_ona_map')) {
      this.afDB.list('geos_map').update(localStorage.getItem('_ona_map'), newData);
    } else {
      let number = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      localStorage.setItem('_ona_map', '_Xmap_'+newData.uuid+number);
      
      this.afDB.list('geos_map').update(localStorage.getItem('_ona_map'), newData);
      
      //localStorage.setItem('_ona_map', '_Xmap_'+newData.uuid+number);
    }
  }

  /**
   * 
   * @author Landry Fongang (mr_madcoder_fil)
   * @param modules Object Module to check availability
   */
	checkModuleAvailability(module) {

		return new Promise((resolve, reject) => {
      
      this.afDB.list('/subcription').subscribe((result) => {
				this.lgServ.isTable('setting').then((data) => {
					for (let i = 0; i < result.length; i++) {
						for (let k = 0; k < result[i].length; k++) {
							if (result[i][k].subNumber == JSON.parse(data).subNumber) {
								this.afDB
									.list('/subcription/' + result[i].$key + '/' + i + '/modules')
									.subscribe((modules) => {
										for (let j = 0; j < modules.length; j++) {
											if (modules[j].id == module.id) {
												if (modules[j].active == false) {
													resolve(true);
												} else { 
													reject(false);
												}
											}
										}
									});
							}
						}
					}
				});
			});
		});
	}



  //Cette fonction permet d'afficher un message
  // en cas d'erreur ou de success
  showMessage(msg) {
	  
	  let toast = this.toastCtrl.create({
	    message: msg,
	    duration: 3000,
      cssClass: "toastErr",
	    position: 'top'
	  });

	  toast.present();
  }

  showMessageWithBtn(msg, options?: any){
  	let toast = this.toastCtrl.create({
	    message: msg,
	    showCloseButton: true,
      cssClass: options!==undefined ? options: "toast-info",
	    closeButtonText: 'OK',
	    position: 'top'
	  });

  	toast.present();
  }
  
  /**
	 * Method to retrieve the different categories of the list of announcements
	 * @param list List of announcements
	 */
	getCategories(list: Array<any>) {
    // var ids = [];
    console.log('List => ', list);
		var listCategories = [];
		var listCategoriesObj = [];
		for (let k = 0; k < list.length; k++) {
				if (listCategories.indexOf(list[k].pos_categ_id.id) < 0 && list[k].pos_categ_id.id != 0) {
					listCategories.push(list[k].pos_categ_id.id);
					listCategoriesObj.push(list[k].pos_categ_id);
				}
		}

		//console.log('Locations list=>', listCategories);
		return listCategoriesObj;
  }
  // getUnClassified(list: Array<any>){
  //   var unClassified = [];
  //   for (let k = 0; k < list.length; k++) {
  //     if (unClassified.indexOf(list[k].pos_categ_id.id) < 0 && list[k].pos_categ_id.id == 0) {
  //       unClassified.push(list[k].pos_categ_id.id);
  //       unClassified.push(list[k].pos_categ_id);
  //     }
  //   }
  //   return unClassified;
  // }
}
