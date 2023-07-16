/** Cette classe définit l'objet audience (pour la gestion du modele ona.lawyer.hearing) **/

export class Audience {

  public id;
  public name;
  public create_date;
  public date_done;
  public description;
  public file_id;
  public type;
  public stage_id;
  public bitcs_opposing_lawyer;
  public bitcs_opposing_party;
  public reference;
  public recipient_id;
  public ona_court;
  public partner_id;
  public user_id;
    
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une audience";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";

  /*
   * @param type string, correspond au type de données à insérer
   * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
   *                              d'une autre soruce
   *
   */
  constructor(type, serverJSON: any) {
    
    if(serverJSON!=null){
      if(type!='a')
        this.setAudience(serverJSON);
      else
        this.setFromAffaire(serverJSON);  
    }else{
      this.initObjet();
    }
    
    
  } 


  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setAudience(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.reference.me || data.me.reference.me=='false')
      this.reference = "";
    else
      this.reference = data.me.reference.me;
    
    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(!data.me.description.me || data.me.description.me=='false')
      this.description = "";
    else
      this.description = data.me.description.me;

    if(data.me.file_id==undefined || !data.me.file_id.me || data.me.file_id.me=='false')
      this.file_id = {id:0, name:""};
    else
      this.file_id = { 
        id: data.me.file_id.me[0].me,
        name: data.me.file_id.me[1].me 
      };

    if(!data.me.bitcs_opposing_lawyer.me || data.me.bitcs_opposing_lawyer.me=='false')
      this.bitcs_opposing_lawyer = {id:0};
    else
      this.bitcs_opposing_lawyer = { 
        id: data.me.bitcs_opposing_lawyer.me[0].me,
        name: data.me.bitcs_opposing_lawyer.me[1].me 
      };

    if(!data.me.stage_id.me || data.me.stage_id.me=='false')
      this.stage_id = {id:0, name: ""};
    else
      this.stage_id = { 
        id: data.me.stage_id.me[0].me,
        name: data.me.stage_id.me[1].me 
      };

    if(data.me.bitcs_opposing_party==undefined || !data.me.bitcs_opposing_party.me)
      this.bitcs_opposing_party = {id:0, name: ""};
    else
      this.bitcs_opposing_party = {
        id: data.me.bitcs_opposing_party.me[0].me,
        name: data.me.bitcs_opposing_party.me[1].me 
      };

    if(data.me.ona_court==undefined || !data.me.ona_court.me)
      this.ona_court = {id:0, name: ""};
    else
      this.ona_court = {
        id: data.me.ona_court.me[0].me,
        name: data.me.ona_court.me[1].me 
      };

    if(data.me.type==undefined || !data.me.type.me)
      this.type = {id:0, name:""};
    else
      this.type = {
        id: data.me.type.me[0].me,
        name: data.me.type.me[1].me 
      };

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = {
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.user_id==undefined || !data.me.user_id.me)
      this.user_id = {id:0, name:""};
    else
      this.user_id = {
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };


    if(data.me.date_done.me==undefined || !data.me.date_done.me)
      this.date_done = new Date();
    else
      this.date_done = data.me.date_done.me;
    
    //this.create_date = data.me.create_date.me;
    this.recipient_id = this.partner_id;

  }

  setFromAffaire(data){
    
    this.date_done = new Date();
    this.ona_court = data.bitcs_court;
    this.file_id = data.id;
    this.partner_id = data.partner_id;
    this.bitcs_opposing_party = data.bitcs_opposing_party;
    this.bitcs_opposing_lawyer = data.bitcs_opposing_lawyer;

  }

  //Initialisation des données
  initObjet(){

    this.id = 0;
    this.date_done = '';
    this.name = "";
    this.description = "";
    //this.user_id = {id:0, name: ""};
    this.partner_id = {id:0, name: ""};
    this.recipient_id = {id:0, name: ""};
    this.type = {id:0, name: ""};
    this.ona_court = {id:0, name: ""};
    this.bitcs_opposing_party = {id:0, name: ""};
    this.bitcs_opposing_lawyer = {id:0, name: ""};
    this.stage_id = {id:0, name: ""};
    this.file_id = {id:0, name: ""};
    
  }


}
