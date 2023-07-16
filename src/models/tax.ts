/** Cette classe définit l'objet note (pour la gestion du modele account.tax) **/

export class Tax {

    public id;
    public name;
    public display_name;
    //public brand_id;
    public amount;
  
    constructor(serverJSON: any) {
      if(serverJSON!=null)
        this.setCar(serverJSON);
      else
        this.initObjet();
    } 
  
  
    /** Cette fonction permet de définir 
     * les valeurs des champs
     * @param data JSONObject, il s'agit des données JSON du serveur
     *
     ***/
    setCar(data : any){
      
      this.id = data.me.id.me;
  
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
      
      if(!data.me.display_name.me || data.me.display_name===undefined)
        this.display_name = "";
      else
        this.display_name = data.me.display_name.me;
    
      if(!data.me.amount.me || data.me.amount==undefined)
        this.amount = 0;
      else
        this.amount = data.me.amount.me;
    }
  
    initObjet(){
      
      this.id = 0;
      this.name = "";
      this.display_name = "";
      this.amount = 0;
    }
    
  }
  