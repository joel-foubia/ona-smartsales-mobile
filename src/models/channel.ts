/** Cette classe définit l'objet channel  (pour la gestion du namee mail.channel) **/

export class Channel {

    public id;
    public name;
    public message_unread_counter;
    public description;
    // public write_date;
    // public body; 
    public message_ids;
    // public author_id;
    // public subject;
    // public email_from;
    public message_partner_ids;
    public channel_partner_ids;
  
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
      
  
      if(!data.me.description.me || data.me.description===undefined)
        this.description = '';
      else
        this.description = data.me.description.me;
    
      if(!data.me.message_unread_counter.me || data.me.message_unread_counter===undefined)
        this.message_unread_counter = 0;
      else
        this.message_unread_counter = data.me.message_unread_counter.me;
      
      if(!data.me.name.me || data.me.name===undefined)
        this.name = '';
      else
        this.name = data.me.name.me;
  
      if(data.me.message_ids==undefined || !data.me.message_ids.me || data.me.message_ids.me.length==0)
        this.message_ids = [];
      else
        this.message_ids = this.getIdTabs(data.me.message_ids.me);      
  
  
      if(data.me.message_partner_ids==undefined || !data.me.message_partner_ids.me || data.me.message_partner_ids.me.length==0)
        this.message_partner_ids = [];
      else
        this.message_partner_ids = this.getIdTabs(data.me.message_partner_ids.me);
      
      if(data.me.channel_partner_ids==undefined || !data.me.channel_partner_ids.me || data.me.channel_partner_ids.me.length==0)
        this.channel_partner_ids = [];
      else
        this.channel_partner_ids = this.getIdTabs(data.me.channel_partner_ids.me);

    }
  
    //Initialisation des données
    initObjet(){
  
      this.id = 0;
      //this.date = '';
      this.name = "";
      this.description = "";
      this.message_ids = [];
      
    //   this.author_id = {id:0, name: ""};
    //   this.email_from = "";
      this.message_unread_counter = 0;
      this.message_partner_ids = [];
      this.channel_partner_ids = [];
      //this.file_id = {id:0, name: ""};
      //this.allday = false;
      //this.subject = "";
    }
  
  
  }
  