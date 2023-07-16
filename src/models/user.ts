/** Cette classe définit l'objet User (res.user) **/
import { ConfigOnglet } from '../config';

export class User {

  public id;
  public display_name;
  public name;
  public login;
  public login_date;
  public image_url;
  public mobile;
  public email;
  public city;
  public signature;
  public tz;
  public notify_email;
  public lang;
  public partner_id;
  public country_id;
  public state_id;
  public sale_team_id;
  public company_id;
  public currency_id;
  public meeting_ids;
  public invoice_ids;
  public opportunity_ids;
  public sale_order_ids;
  public groups_id;
  public __last_update;
  public target_sales_done; //activities done target
  public target_sales_won; // won in opportunities target
  public target_sales_invoiced; // invoiced in sales order target
  private popLang;

  //Définitions des messages à envoyer
  static error_phone = "Le numéro de téléphone n'a pas été attribué. Aller dans la rubrique Modifier";
  static error_email = "Vous ne pouvez pas envoyer de mail, l'Email n'a pas été attribué. Attribuez un Email";
  static success_update = "Vos informations ont été actualisées";
  static noInternet = "Problème de connexion Internet";
  static errSaving = "Une erreur est survenu lors de la mise à jour";

  constructor(objLang:any, serverJSON: any) {
    this.popLang = objLang;
    if(serverJSON!=null)
      this.setUser(serverJSON);
    else
      this.initUser();
  } 

  private getIdTabs(liste){

    let tab = [];
    for (var i = 0; i < liste.length; i++) {
        tab.push(liste[i].me);
    }

    return tab;
  }
  
  /** 
   * Cette fonction retourne le libelle de la notification
   * en fonction de l'id
   * @param id string, l'id du titre
   * @return string 
   **/
  getTitreById(id, tab){

    for (let i = 0; i < tab.length; i++) {
      if(tab[i].id==id)
        return tab[i].text;
    }

  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setUser(data : any){
    
    this.id = data.me.id.me;

    if(data.me.display_name==undefined || !data.me.display_name.me || data.me.display_name.me=='false')
      this.display_name = "";
    else
      this.display_name = data.me.display_name.me;

    if(data.me.name==undefined || !data.me.name.me)
      this.name = "";
    else
      this.name = data.me.name.me;
    
    if(data.me.login_date==undefined || !data.me.login_date.me)
      this.login_date = "";
    else
      this.login_date = data.me.login_date.me;
    
    if(data.me.city==undefined || !data.me.city.me)
      this.city = "";
    else
      this.city = data.me.city.me;
    
    if(data.me.__last_update==undefined || !data.me.__last_update.me)
      this.__last_update = "";
    else
      this.__last_update = data.me.__last_update.me;
    
    if(data.me.mobile==undefined || !data.me.mobile.me)
      this.mobile = "";
    else
      this.mobile = data.me.mobile.me;

    if(data.me.login==undefined || !data.me.login.me || data.me.login.me=='false')
      this.login = "";
    else
      this.login = data.me.login.me;
    
    if(data.me.target_sales_done==undefined || !data.me.target_sales_done.me)
      this.target_sales_done = 0;
    else
      this.target_sales_done = data.me.target_sales_done.me;
    
    if(data.me.target_sales_won==undefined || !data.me.target_sales_won.me)
      this.target_sales_won = 0;
    else
      this.target_sales_won = data.me.target_sales_won.me;
    
    if(data.me.target_sales_invoiced==undefined || !data.me.target_sales_invoiced.me)
      this.target_sales_invoiced = 0;
    else
      this.target_sales_invoiced = data.me.target_sales_invoiced.me;

    if(!data.me.email.me || data.me.email.me=='false')
      this.email = "";
    else
      this.email = data.me.email.me;

    if(!data.me.tz.me || data.me.tz.me=='false')
      this.tz = { id: '', titre: 'Aucune'};
    else
      this.tz = { id: data.me.tz.me, 
                  titre: this.getTitreById(data.me.tz.me, ConfigOnglet.tz(this.popLang))
                };

    if(data.me.signature==undefined || !data.me.signature.me || data.me.signature.me=='false')
      this.signature = "";
    else
      this.signature = String(data.me.signature.me).replace(/<[^>]+>/gm, '');

    if(data.me.image_url==undefined || !data.me.image_url.me)
      this.image_url = "assets/images/person.jpg";
    else
      this.image_url = data.me.image_url.me;
  
    
    //ON attribut des valeurs aux restes des propriétés
    if(!data.me.notify_email.me || data.me.notify_email.me==undefined)
      this.notify_email = { id: 'none', titre: 'Jamais'};
    else 
      this.notify_email = {
        id: data.me.notify_email.me,
        titre: this.getTitreById(data.me.notify_email.me, ConfigOnglet.notifs(this.popLang))
      };

    if(!data.me.lang.me || data.me.lang.me==undefined)
      this.lang = { id: '', titre: 'Aucune'};
    else  
      this.lang = {
        id: data.me.lang.me,
        titre: this.getTitreById(data.me.lang.me, ConfigOnglet.langues(this.popLang))
      };

    if(!data.me.partner_id.me || data.me.partner_id.me==undefined)
      this.partner_id = { id: 0, name: ''};
    else  
      this.partner_id = {
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me,
      };
    
    if(!data.me.country_id.me || data.me.country_id.me==undefined)
      this.country_id = { id: 0, name: ''};
    else  
      this.country_id = { id: data.me.country_id.me[0].me, name: data.me.country_id.me[1].me};
    
    if(!data.me.state_id.me || data.me.state_id.me==undefined)
      this.state_id = { id: 0, name: ''};
    else  
      this.state_id = { id: data.me.state_id.me[0].me, name: data.me.state_id.me[1].me};
    
    if(!data.me.currency_id.me || data.me.currency_id.me==undefined)
      this.currency_id = { id: 0, name: ''};
    else  
      this.currency_id = {
        id: data.me.currency_id.me[0].me,
        name: data.me.currency_id.me[1].me,
      };
    
    if(!data.me.company_id.me || data.me.company_id.me==undefined)
      this.company_id = { id: 0, name: ''};
    else  
      this.company_id = {
        id: data.me.company_id.me[0].me,
        name: data.me.company_id.me[1].me,
      };

    if(!data.me.sale_team_id.me || data.me.sale_team_id.me==undefined)
      this.sale_team_id = { id: 0, name: ''};
    else  
      this.sale_team_id = {
        id: data.me.sale_team_id.me[0].me,
        name: data.me.sale_team_id.me[1].me,
      };

    if(data.me.meeting_ids==undefined || !data.me.meeting_ids.me || data.me.meeting_ids.me.length==0)
      this.meeting_ids = [];
    else
      this.meeting_ids = this.getIdTabs(data.me.meeting_ids.me);
    
    if(data.me.groups_id==undefined || !data.me.groups_id.me || data.me.groups_id.me.length==0)
      this.groups_id = [];
    else
      this.groups_id = this.getIdTabs(data.me.groups_id.me);
    
    if(data.me.invoice_ids==undefined || !data.me.invoice_ids.me || data.me.invoice_ids.me.length==0)
      this.invoice_ids = [];
    else
      this.invoice_ids = this.getIdTabs(data.me.invoice_ids.me);
    
    if(data.me.opportunity_ids==undefined || !data.me.opportunity_ids.me || data.me.opportunity_ids.me.length==0)
      this.opportunity_ids = [];
    else
      this.opportunity_ids = this.getIdTabs(data.me.opportunity_ids.me);
    
    if(data.me.sale_order_ids==undefined || !data.me.sale_order_ids.me || data.me.sale_order_ids.me.length==0)
      this.sale_order_ids = [];
    else
      this.sale_order_ids = this.getIdTabs(data.me.sale_order_ids.me);
    
  }

  //initialisation de l'objet User
  initUser(){

    this.id = 0;
    this.target_sales_invoiced = 0;
    this.target_sales_won = 0;
    this.target_sales_done = 0;
    this.display_name = "";
    this.name = "";
    this.mobile = "";
    this.login = "";
    this.email = "";
    this.city = "";
    this.__last_update = "";
    this.tz = { id: '', titre: 'Aucune'};
    this.signature = "";
    this.image_url = "assets/images/person.jpg";
    this.notify_email = { id: 'none', titre: 'Jamais'};
    this.lang = { id: '', titre: 'Aucune'};
    this.partner_id = { id: 0, name: ''};
    this.sale_team_id = { id: 0, name: ''};
    this.company_id = { id: 0, name: ''};
    this.currency_id = { id: 0, name: ''};
    this.country_id = { id: 0, name: ''};
    this.state_id = { id: 0, name: ''};
    this.meeting_ids = [];
    this.invoice_ids = [];
    this.groups_id = [];
    this.opportunity_ids = [];
    this.sale_order_ids = [];
    
  }

}
