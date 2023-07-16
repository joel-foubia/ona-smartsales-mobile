import { ToastController, NavController } from 'ionic-angular';
import { DataProvider } from '../providers/data/data';
import { OdooProvider } from '../providers/odoo/odoo';
import { LoginProvider } from '../providers/login/login';
import { MainPage } from '../pages/main/main';


export class Offline {

  constructor(public sqlServ: DataProvider, public toastCtrl: ToastController, public navCtrl: NavController, public odooServ: OdooProvider, private lgService: LoginProvider) {} 


  /**
   * Cette fonction permet de récupérer la liste
   * des clients en mode hors connexion 
   * @param type, le nom de la table
   * @param objContenu, il va lié la variable clients à l'objet data
   *
   **/
   getAllObjets(type, objContenu){
    
    this.sqlServ.fetchFromPartner(type).then(data => {
        objContenu = data;
    })
    .catch( error => {

        console.error( error );
        this.odooServ.alertNoInternet().present();
        this.navCtrl.push(MainPage); // on retourne à la page d'accueil
    });
  }

  /**
   * Cette fonction permet d'enregistrer
   * les données dans la table <type>
   * @param type , le nom de la table
   * @param data, les données à insérer
   **/
  addObjet(type, data){

    this.lgService.isTable(type).then((resTable) => {
        
        //if(!resTable){ return; }
        let isSaved = JSON.parse(resTable);
        if(resTable){ //La données ont été inséré dans la table alors on fait une mise à jour
          
          for(var i in data){

              let current = data[i];
              
              this.sqlServ.updateFromRemote(current, type).then(response => {
                  console.log('updated', response);
                }).catch( error => {
                    console.error( error );
                });
          }
           

        }else{ //Aucune données n'a été inséré alors on fait une insertion
            
            for(var key in data){

              this.sqlServ.insertPartner(data[key], type).then(response => {
                  console.log('added', response);
              }).catch( error => {
                  console.error( error );
              });
            }
        } 
    });

    
  }

}
