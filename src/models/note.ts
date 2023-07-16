/** Cette classe définit l'objet note (pour la gestion du modele note.note) **/

export class Note {

  public id;
  public name;
  public open;
  // public file_id;
  public stage_ids;
  public message_follower_ids;
  public stage_id;
  public user_id;
  public tag_ids;
  public memo;
  public color;
  public create_date;
  public write_date;
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une note";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";


  constructor(serverJSON: any) {
    if(serverJSON!=null)
      this.setNote(serverJSON);
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
  setNote(data : any){
    
    this.id = data.me.id.me;
    this.open = data.me.open.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;
    
    if(!data.me.write_date.me || data.me.write_date.me=='false')
      this.write_date = "";
    else
      this.write_date = data.me.write_date.me;

    // if(data.me.file_id==undefined || !data.me.file_id.me || data.me.file_id.me=='false')
    //   this.file_id = {id:0, name:''};
    // else
    //   this.file_id = { 
    //     id: data.me.file_id.me[0].me,
    //     name: data.me.file_id.me[1].me 
    //   };
    
    if(data.me.user_id==undefined || !data.me.user_id.me || data.me.user_id.me=='false')
      this.user_id = {id:0, name:''};
    else
      this.user_id = { 
        id: data.me.user_id.me[0].me,
        name: data.me.user_id.me[1].me 
      };
    
    if(data.me.stage_id==undefined || !data.me.stage_id.me || data.me.stage_id.me=='false')
      this.stage_id = {id:0, name:''};
    else
      this.stage_id = { 
        id: data.me.stage_id.me[0].me,
        name: data.me.stage_id.me[1].me 
      };

    if(data.me.stage_ids==undefined || !data.me.stage_ids.me || data.me.stage_ids.me.length==0)
      this.stage_ids = [];
    else{
      this.stage_ids = this.getIdTabs(data.me.stage_ids.me);
    }
    
    if(data.me.message_follower_ids==undefined || !data.me.message_follower_ids.me || data.me.message_follower_ids.me.length==0)
      this.message_follower_ids = [];
    else{
      this.message_follower_ids = this.getIdTabs(data.me.message_follower_ids.me);
    }
      
    if(!data.me.memo.me || data.me.memo.me=='false')
      this.memo = "";
    else
      this.memo = String(data.me.memo.me).replace(/<[^>]+>/gm, '');

    if(!data.me.create_date.me)
      this.create_date = "";
    else
      this.create_date = data.me.create_date.me;

    if(!data.me.color.me)
      this.color = 0;
    else
      this.color = data.me.color.me;


    if(data.me.tag_ids==undefined || !data.me.tag_ids.me || data.me.tag_ids.me.length==0)
        this.tag_ids = [];
      else
        this.tag_ids = this.getIdTabs(data.me.tag_ids.me);
    

  }

  initObjet(){

    this.id = 0;
    this.open = true;
    this.name = "";
    // this.file_id = {id:0, name:''};
    this.stage_id = {id:0, name:''};
    this.user_id = {id:0, name:''};
    this.stage_ids = [];
    this.memo = "";
    this.create_date = "";
    this.write_date = "";
    this.color = 0;
    this.tag_ids = [];
    this.message_follower_ids = [];
    
  }


}
