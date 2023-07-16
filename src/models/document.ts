/** Cette classe définit l'objet document (pour la gestion du modele document.page) **/

export class Document {

    public company_id;
    public id;
    public name;
    public date_done;
    public write_date;
    public type;
    public salutation;
    public content;
    public stage_id;
    public recipient_id;
    public project_id;
    public user_id;
    public model;
    public reference;
    public tag_ids;
    public state;
    public partner_id;
      
     
    /**
     * Initialise un objet
     * @param serverJSON Array<any>, il s'agit des données provennan du server
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null){
        this.setDocument(serverJSON);
      }else{
        this.initObjet();
      }
      
      
    } 
    
    /**
     * Cette fonction retourne un tableau d'ids
     * @param liste Array<int>, liste ids
     * @returns Array
     */
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
    setDocument(data : any){
      
      this.id = data.me.id.me;
  
      if(!data.me.salutation.me || data.me.salutation.me==undefined)
        this.salutation = "";
      else
        this.salutation = data.me.salutation.me;
      
      if(!data.me.write_date.me || data.me.write_date.me==undefined)
        this.write_date = "";
      else
        this.write_date = data.me.write_date.me;
  
      if(!data.me.reference.me || data.me.reference.me==undefined)
        this.reference = "";
      else
        this.reference = data.me.reference.me;
  
      if(data.me.tag_ids==undefined || !data.me.tag_ids.me || data.me.tag_ids.me.length==0)
        this.tag_ids = [];
      else
        this.tag_ids = this.getIdTabs(data.me.tag_ids.me);
      
      if(!data.me.name.me || data.me.name.me==undefined)
        this.name = "";
      else
        this.name = data.me.name.me;
  
      if(!data.me.content.me || data.me.content==undefined)
        this.content = "";
      else
        this.content = data.me.content.me;
  
      if(data.me.model==undefined || !data.me.model.me || data.me.model.me.length==0)
        this.model = {id:0, name: ""};
      else
        this.model = { 
          id: data.me.model.me[0].me,
          name: data.me.model.me[1].me 
        };
  
      if(!data.me.stage_id.me || data.me.stage_id===undefined)
        this.stage_id = {id:0, name: ""};
      else
        this.stage_id = { 
          id: data.me.stage_id.me[0].me,
          name: data.me.stage_id.me[1].me 
        };
  
      if(!data.me.date_done.me)
        this.date_done = '';
      else
        this.date_done = data.me.date_done.me;
      
      if(data.me.project_id==undefined || !data.me.project_id.me || data.me.project_id.me=='false')
        this.project_id = {id:0, name: ""};
      else
        this.project_id = { 
          id: data.me.project_id.me[0].me,
          name: data.me.project_id.me[1].me 
        };
      
      if(data.me.user_id==undefined || !data.me.user_id.me || data.me.user_id.me=='false')
        this.user_id = {id:0, name: ""};
      else
        this.user_id = { 
          id: data.me.user_id.me[0].me,
          name: data.me.user_id.me[1].me 
        };
      
      if(data.me.recipient_id==undefined || !data.me.recipient_id.me)
        this.recipient_id = {id:0, name: ""};
      else
        this.recipient_id = { 
          id: data.me.recipient_id.me[0].me,
          name: data.me.recipient_id.me[1].me 
        };
  
      if(data.me.type==undefined || !data.me.type.me || data.me.type.me.length==0)
        this.type = {id:0, name: ""};
      else
        this.type = { 
          id: data.me.type.me[0].me,
          name: data.me.type.me[1].me 
        };
  
      if(data.me.partner_id==undefined || !data.me.partner_id.me || data.me.partner_id.me.length==0)
        this.partner_id = {id:0, name: ""};
      else
        this.partner_id = { 
          id: data.me.partner_id.me[0].me,
          name: data.me.partner_id.me[1].me 
        };
      
      if(data.me.company_id==undefined || !data.me.company_id.me || data.me.company_id.me.length==0)
        this.company_id = {id:0, name: ""};
      else
        this.company_id = { 
          id: data.me.company_id.me[0].me,
          name: data.me.company_id.me[1].me 
        };
      
      if(!data.me.state.me || data.me.state===undefined)
        this.state = '';
      else  
        this.state = data.me.state.me; 
    }
  
      
    //Initialisation des données
    initObjet(){
  
      this.id = 0;
      this.date_done = '';
      this.name = "";
      this.content = "";
      this.salutation = "";
      this.project_id = { id:0, name:""};
      this.model = { id:0, name:""};
      this.stage_id = {id:0, name: ""};
      this.recipient_id = {id:0, name: ""};
      this.tag_ids = [];
      this.type = { id:0, name:""};
      this.partner_id = { id:0, name:""};
      this.company_id = { id:0, name:""};
      this.state = ''; 

    }
  
  }
  