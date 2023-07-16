/** Cette classe définit l'objet modèle (pour la gestion du modele ir.model.data) **/

export class ModelData {

    public id;
    public name;
    public model;
    public __last_update;
    public res_id;

  
    constructor(serverJSON: any) {
      
      if(serverJSON==null){
        this.initModel();
      }else{
        this.setModel(serverJSON);
      }
    } 
  
  
    /** Cette fonction permet de définir 
     * les valeurs des champs
     * @param data JSONObject, il s'agit des données JSON du serveur
     *
     ***/
    setModel(data : any){
      
      this.id = data.me.id.me;
      //this.__last_update = data.me.__last_update.me;
  
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;

      if(!data.me.res_id.me || data.me.res_id===undefined)
        this.res_id = 0;
      else
        this.res_id = data.me.res_id.me;
      
      if(!data.me.model.me || data.me.model===undefined)
        this.model = "";
      else
        this.model = data.me.model.me;
      
      if(!data.me.__last_update.me || data.me.__last_update===undefined)
        this.__last_update = "";
      else
        this.__last_update = data.me.__last_update.me;  
  
    }
  
    
    //création d'une tache vide
    initModel(){

      this.res_id = 0;
      this.model = '';
      this.__last_update = "";
      this.id = 0;
      this.name = "";
    }
  

  }
  