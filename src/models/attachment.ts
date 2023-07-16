/** Cette classe définit l'objet message  (pour la gestion du res_modele ir.attachment) **/

export class Attachment {

    public id;
    public res_id;
    public res_model;
    public company_id;
    public name;
    public website_url;
    // public write_date;
  
    /*
     * 
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                                d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      if(serverJSON!=null)
        this.setMessage(serverJSON);
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
    setMessage(data : any){
    
      this.id = data.me.id.me;
      
      if(!data.me.name.me || data.me.name===undefined)
        this.name = '';
      else
        this.name = data.me.name.me;
      
      if(!data.me.res_id.me || data.me.res_id===undefined)
        this.res_id = 0;
      else
        this.res_id = data.me.res_id.me;
  
      if(!data.me.res_model.me || data.me.res_model===undefined)
        this.res_model = '';
      else
        this.res_model = data.me.res_model.me;
        
      if(!data.me.company_id.me || data.me.company_id===undefined)
        this.company_id = {id:0, name: ""};
      else{
        if(Array.isArray(data.me.company_id.me))
          this.company_id = { id: data.me.company_id.me[0].me, name: data.me.company_id.me[1].me };
        else
          this.company_id = { id: data.me.company_id.me, name: "" };
      }
  
      if(data.me.website_url==undefined || !data.me.website_url.me)
        this.website_url = "";
      else
        this.website_url = data.me.website_url.me;

    }
  
    //Initialisation des données
    initObjet(){
  
      this.id = 0;
      this.res_id = 0;
      this.res_model = "";      
      this.company_id = {id:0, name: ""};
      this.website_url = "";
      this.name = "";
      
    }
  
  
  }
  