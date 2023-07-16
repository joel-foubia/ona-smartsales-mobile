/** Cette classe définit l'objet taches (pour la gestion du modele project.task) **/

export class Task {

  public id;
  public name;
  public code;
  public active;
  public user_id;
  //public date_start;
  public date_deadline;
  public stage_id;
  public description;
  //public delay_hours;
  public date_end;
  public progress;
  public total_hours;
  public partner_id;
  public bitcs_next_action_type;
  public project_id;
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une tache";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";


  constructor(type, serverJSON: any) {
    
    if(serverJSON==null){
      this.initTask;
    }else{

      if(type!='a')
        this.setTask(serverJSON);
      else
        this.setFromAffaire(serverJSON);
    }
  } 


  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setTask(data : any){
    
    this.id = data.me.id.me;
    //this.active = data.me.active.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(data.me.user_id==undefined || !data.me.user_id.me || data.me.user_id.me=='false')
      this.user_id = {id:0, name:""};
    else
      this.user_id = { 
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = { 
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.bitcs_next_action_type==undefined || !data.me.bitcs_next_action_type.me)
      this.bitcs_next_action_type = {id:0, name:""};
    else
      this.bitcs_next_action_type = { 
        id: data.me.bitcs_next_action_type.me[0].me,
        name: data.me.bitcs_next_action_type.me[1].me 
      };

    if(!data.me.total_hours.me)
      this.total_hours = 0;
    else
      this.total_hours = data.me.total_hours.me;

    if(!data.me.description.me || data.me.description.me=='false')
      this.description = "";
    else
      this.description = String(data.me.description.me).replace(/<[^>]+>/gm, '');

    if(!data.me.stage_id.me || data.me.stage_id.me=='false')
      this.stage_id = {id:0, name:""};
    else
      this.stage_id = { 
        id: data.me.stage_id.me[0].me,
        name: data.me.stage_id.me[1].me 
      };

    if(!data.me.project_id.me || data.me.project_id.me=='false')
      this.project_id = {id:0, name:""};
    else
      this.project_id = { 
        id: data.me.project_id.me[0].me,
        name: data.me.project_id.me[1].me 
      };

    if(!data.me.progress.me)
      this.progress = 0;
    else
      this.progress = data.me.progress.me;

    /*if(!data.me.delay_hours.me)
      this.delay_hours = 0;
    else
      this.delay_hours = data.me.delay_hours.me;*/

    //this.date_start = data.me.date_start.me;
    this.date_deadline = data.me.date_deadline.me;
    this.date_end = data.me.date_end.me;
    this.code = data.me.code.me;
    this.active = data.me.active.me;

  }

  setFromAffaire(data){
    
    this.project_id = {
      id : data.id,
      name : data.name,
    };
      
    this.partner_id = data.partner_id;

    this.date_deadline = '';
    this.date_end = '';
    this.code = '';
    this.active = true;
    this.id = 0;
    this.name = "";
    this.user_id = data.user_id;
    this.bitcs_next_action_type = {id:0, name:""};
    this.total_hours = 0;
    this.description = "";
    this.stage_id = {id:0, name:""};
    this.progress = 0;
  }

  //création d'une tache vide
  initTask(){
    this.date_deadline = '';
    this.date_end = '';
    this.code = '';
    this.active = true;
    this.id = 0;
    this.name = "";
    this.user_id = {id:0, name:""};
    this.bitcs_next_action_type = {id:0, name:""};
    this.total_hours = 0;
    this.description = "";
    this.stage_id = {id:0, name:""};
    this.progress = 0;
    this.project_id = {id:0, name:""}; 
    this.partner_id = {id:0, name:""};
  }


}
