import { Component } from '@angular/core';
import { ViewController, NavParams, Events, IonicPage } from 'ionic-angular';
import { ConfigOnglet } from '../../config';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-form-user',
  templateUrl: 'form-user.html',
})
export class FormUserPage {

  txtLangue: any;
  current_lang: string;
	public user;
	public langues = [];
	public timezones = [];
	public notifs = [];

  constructor(public vc: ViewController, public navParams: NavParams, private lgServ: LoginProvider, public evEVT: Events, private translate: TranslateService) {
    
    this.current_lang = this.translate.getDefaultLang();
    this.user = this.navParams.get('objet');
    this.translate.get("form").subscribe(reponse=>{
      this.txtLangue = reponse;
      this.langues = ConfigOnglet.langues(reponse);
      this.notifs = ConfigOnglet.notifs(reponse);
      this.timezones = ConfigOnglet.tz(reponse);
    });
  	

  }

  close(){
  	this.vc.dismiss();
  }

  //Permet de fixer l'attribut titre d'un champ
  //du modèle User
  private find(id, list){

    for (let i = 0; i < list.length; i++) {
      if(list[i].id==id)
        return list[i].text;
    }
  }

  /**
   * Cette fonction permet de modifier la
   * les attributs de l'objet affaire
   **/
  changeValue(event,type){
        
    switch(type){
      case 'lang':{ 
        this.user.lang.titre = this.find(event, this.langues);
        this.changeLangue();
        break;
      }
      case 'tz': {
        this.user.tz.titre = this.find(event, this.timezones);
        break;
      }
      case 'notif': {
        this.user.notify_email.titre = this.find(event, this.notifs);
        break;
      }
    }

  }

  //Cette fonction permet de valider les infos
  //de l'utilisateur
  saveItem(){
    let newItem : any; 
  	
    newItem = this.user;
    this.lgServ.getSettingUser().then((data) => {

        this.lgServ.setTable("me_avocat", this.user);  
        if(data){

          let organe = JSON.parse(data);
          let avocat = { img: organe.logo, nom: organe.customer, user: this.user};
          this.evEVT.publish('avocat:changed', avocat);
        }

        //On ferme le formulaire
        this.vc.dismiss(newItem);
    });
    
  }

  //Cette fonction permet de changer la langue de l'utilisateur
  changeLangue(){
    let prefix = this.user.lang.id.split("_");
    
    this.translate.use(prefix[0]);
  }

}
