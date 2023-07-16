import { Injectable } from '@angular/core';
//import { ModalController, LoadingController } from 'ionic-angular';
import { OdooProvider } from '../odoo/odoo';
import { LoginProvider } from '../login/login';


@Injectable()
export class AffaireProvider {

  constructor(private odooService: OdooProvider, private lgServ: LoginProvider) {
    
  } 

   /* Cette fonction permet de traiter les informations
    * envoyées par Odoo (les données sur les affaires)
    * @param user struct,  l'api user
    * @param objLogin struct, l'utilisateur de l'appli
    * @parm type string, permet d'identifier l'objet sur lequel faire la requete
    * @param callback any, il retourne un Fonction de retour
    **/
  setListObjetsByCase(type, objSpinner, callback){

    objSpinner= true;
        
    this.odooService.requestObjectToOdoo(type, null, null, objSpinner, (res)=>{
        objSpinner = false;
        callback(res);
    });
   
  }

  /**
   * Cette fonction permet à un utilisateur d'enregistrer
   * un objet (client, contact, tribunal) lors de la création
   * d'un dossier client
   *
   **/
  ajouterObjet(type, objSpinner, objet, callback){
    
    this.lgServ.getLogin().then((res) => {
        
        if(res){
            
          let objLogin = JSON.parse(res);
          this.lgServ.getSettingUser().then((reponse) => {
                
              if(reponse){

                let user = JSON.parse(reponse);
                this.odooService.odoo().createObjet(user, objLogin, type, objet, (data) =>{

                    //console.log(data);
                    objSpinner = false;
                    if(data.errno==0)
                      callback(data.val.me);
                    else
                      this.odooService.displayCustomMessage("Le client n'a pas été créé");
                    
                  });
               }
          });

        }
    });          
    
  }

}
