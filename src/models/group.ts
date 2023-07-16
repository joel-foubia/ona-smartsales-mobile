/** Cette classe définit l'objet groupe (pour la gestion du modele res.groups) **/

export class Group {

    public id;
    public name;
    public display_name;
    public users;
    public color;

  
    constructor(serverJSON: any) {
      
      if(serverJSON==null){
        this.initGroup();
      }else{
        this.setGroup(serverJSON);
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
    setGroup(data : any){
      
      this.id = data.me.id.me;
      //this.users = data.me.users.me;
  
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;

      if(!data.me.color.me || data.me.color===undefined)
        this.color = "";
      else
        this.color = data.me.color.me;
      
      if(!data.me.display_name.me || data.me.display_name===undefined)
        this.display_name = "";
      else
        this.display_name = data.me.display_name.me;
      
        if(data.me.users==undefined || !data.me.users.me || data.me.users.me.length==0)
        this.users = [];
      else
        this.users = this.getIdTabs(data.me.users.me);
  
    }
  
    
  
    //création d'une tache vide
    initGroup(){

      this.color = '';
      this.display_name = '';
      this.users = "";
      this.id = 0;
      this.name = "";
    }
  
  
  }
  