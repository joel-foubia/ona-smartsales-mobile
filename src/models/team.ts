/** Cette classe définit l'objet team (pour la gestion du modele crm.team Team Sales) **/

export class Team {

  public id;
  public name;
  public use_leads;
  public use_opportunities;
  public use_quotations;
  public use_invoices;
  public code;
  public color;
  public resource_calendar_id;
  public working_hours;
  public invoiced_target;
  public user_id;
  public member_ids;
  public stage_ids;
    
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une audience";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

  /*
   * @param color string, correspond au color de données à insérer
   * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
   *                              d'une autre soruce
   *
   */
  constructor(serverJSON: any) {
    
    if(serverJSON!=null){
      this.setTeam(serverJSON);
    }else{
      this.initObjet();
    }
    
  }

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
  setTeam(data : any){
    
    this.id = data.me.id.me;
    this.use_invoices = data.me.use_invoices.me;
    this.use_quotations = data.me.use_quotations.me;
    this.use_opportunities = data.me.use_opportunities.me;
    this.use_leads = data.me.use_leads.me;

    if(!data.me.working_hours.me || data.me.working_hours.me==undefined)
      this.working_hours = 0;
    else
      this.working_hours = data.me.working_hours.me;
    
    if(!data.me.name.me || data.me.name.me==undefined)
      this.name = "";
    else
      this.name = data.me.name.me;

    if(!data.me.invoiced_target.me || data.me.invoiced_target.me==undefined)
      this.invoiced_target = 0;
    else
      this.invoiced_target = data.me.invoiced_target.me;


    if(!data.me.resource_calendar_id.me || data.me.resource_calendar_id.me==undefined)
      this.resource_calendar_id = {id:0, name: ""};
    else
      this.resource_calendar_id = { 
        id: data.me.resource_calendar_id.me[0].me,
        name: data.me.resource_calendar_id.me[1].me 
      };
    
    if(data.me.member_ids==undefined || !data.me.member_ids.me || data.me.member_ids.me.length==0)
      this.member_ids = [];
    else
      this.member_ids = this.getIdTabs(data.me.member_ids.me);
    
    if(data.me.stage_ids==undefined || !data.me.stage_ids.me || data.me.stage_ids.me.length==0)
      this.stage_ids = [];
    else
      this.stage_ids = this.getIdTabs(data.me.stage_ids.me);

    if(data.me.color==undefined || !data.me.color.me)
      this.color = 0;
    else
      this.color = data.me.color.me;

    if(data.me.user_id==undefined || !data.me.user_id.me)
      this.user_id = {id:0, name:""};
    else
      this.user_id = {
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };

  }

  static findTeam(id, teams){
    for (let i = 0; i < teams.length; i++) {
        if(teams[i].id==id)
          return teams[i];
    }
  }


  //Initialisation des données
  initObjet(){

    this.id = 0;
    this.use_invoices = '';
    this.use_quotations = '';
    this.use_opportunities = '';
    this.use_leads = '';
    this.name = "";
    this.invoiced_target = 0;
    this.code = '';
    this.user_id = {id:0, name: ""};
    this.color = 0;
    this.working_hours = '';
    this.resource_calendar_id = {id:0, name: ""};
    this.member_ids = [];    
    this.stage_ids = [];
  }


}
