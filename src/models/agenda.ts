/** Cette classe définit l'objet agence (pour la gestion du modele calendar.event) **/

export class Agenda {

  public id;
  public name;
  public allday;
  public start_datetime;
  public stop_datetime;
  public stop;
  public start_date;
  public stop_date;
  public description;
  public alarm_ids;
  public categ_ids; //tags
  public active;
  public user_id;
  public color_partner_id;
  public duration;
  public opportunity_id;
  public location;
  public partner_ids;
    
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer un rendez vous";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

  /*
   * @param active string, correspond au active de données à insérer
   * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
   *                                d'une autre soruce
   *
   */
  constructor(serverJSON: any) {
    if(serverJSON!=null)
      this.setAudience(serverJSON);
    else
      this.initObjet();
  }

  //Cette fonction permet de générer un tableau
  //d'identifiant
  private getIdTabs(liste){

    let tab = [];

    for (var i = 0; i < liste.length; i++) {
        tab.push(liste[i].me);
    }

    return tab;
  } 


  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setAudience(data : any){
  
    this.id = data.me.id.me;
    
    if(!data.me.start_datetime.me)
      this.start_datetime = '';
    else
      this.start_datetime = data.me.start_datetime.me;

    if(!data.me.stop.me)
      this.stop = '';
    else
      this.stop = data.me.stop.me;

    if(!data.me.start_date.me)
      this.start_date = '';
    else
      this.start_date = data.me.start_date.me;

    if(!data.me.stop_date.me)
      this.stop_date = '';
    else
      this.stop_date = data.me.stop_date.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(!data.me.description.me || data.me.description.me=='false')
      this.description = "";
    else
      this.description = data.me.description.me;

    if(data.me.alarm_ids==undefined || !data.me.alarm_ids.me || data.me.alarm_ids.me.length==0)
      this.alarm_ids = [];
    else
      this.alarm_ids = this.getIdTabs(data.me.alarm_ids.me);

    if(data.me.categ_ids==undefined || !data.me.categ_ids.me || data.me.categ_ids.me.length==0)
      this.categ_ids = [];
    else
      this.categ_ids = this.getIdTabs(data.me.categ_ids.me);

    if(!data.me.color_partner_id.me)
      this.color_partner_id = 0;
    else
      this.color_partner_id = data.me.color_partner_id.me;

    if(!data.me.user_id.me || data.me.user_id.me=='false')
      this.user_id = {id:0, name: ""};
    else
      this.user_id = { 
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };

    if(data.me.location==undefined || !data.me.location.me)
      this.location = "";
    else
      this.location = data.me.location.me;

    if(data.me.active==undefined || !data.me.active.me)
      this.active = false;
    else
      this.active = true;

    if(data.me.partner_ids==undefined || !data.me.partner_ids.me || data.me.partner_ids.me.length==0)
      this.partner_ids = [];
    else
      this.partner_ids = this.getIdTabs(data.me.partner_ids.me);

    if(!data.me.opportunity_id.me || data.me.opportunity_id.me=='false')
      this.opportunity_id = {id:0, name: ""};
    else
      this.opportunity_id = { 
        id: data.me.opportunity_id.me[0].me,
        name: data.me.opportunity_id.me[1].me 
      };

    this.allday = data.me.allday.me; 
    this.duration = data.me.duration.me; 

  }

  //Initialisation des données
  initObjet(){

    this.id = 0;
    this.start_datetime = '';
    this.name = "";
    this.description = "";
    this.alarm_ids = [];
    this.categ_ids = [];
    this.color_partner_id = 0;
    this.user_id = {id:0, name: ""};
    this.location = "";
    this.active = true;
    this.partner_ids = [];
    this.opportunity_id = {id:0, name: ""};
    this.allday = false;
    this.duration = 0.0;
  }


}
