/** Cette classe définit l'objet message  (pour la gestion du modele mail.mail) **/

export class Mail {

    public id;
    public needaction;
    public res_id;
    public model;
    public date;
    public message_type;
    public write_date;
    public body;
    public channel_ids;
    public attachment_ids;
    public author_id;
    public mail_message_id;
    public subject;
    public email_cc;
    public email_from;
    public email_to;
    public partner_ids;
  
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
      this.needaction = data.me.needaction.me;
      
      if(!data.me.date.me || data.me.date===undefined)
        this.date = '';
      else
        this.date = data.me.date.me;
      
      if(!data.me.email_cc.me || data.me.email_cc===undefined)
        this.email_cc = '';
      else
        this.email_cc = data.me.email_cc.me;
      
      if(!data.me.email_to.me || data.me.email_to===undefined)
        this.email_to = '';
      else
        this.email_to = data.me.email_to.me;
      
      if(!data.me.res_id.me || data.me.res_id===undefined)
        this.res_id = 0;
      else
        this.res_id = data.me.res_id.me;
  
      if(!data.me.message_type.me || data.me.message_type===undefined)
        this.message_type = '';
      else
        this.message_type = data.me.message_type.me;
      
      if(!data.me.model.me || data.me.model===undefined)
        this.model = '';
      else
        this.model = data.me.model.me;
  
      if(!data.me.write_date.me)
        this.write_date = '';
      else
        this.write_date = data.me.write_date.me;

  
      if(!data.me.body.me || data.me.body.me===undefined)
        this.body = "";
      else
        this.body = String(data.me.body.me).replace(/<[^>]+>/gm, '');
  
      if(data.me.channel_ids==undefined || !data.me.channel_ids.me || data.me.channel_ids.me.length==0)
        this.channel_ids = [];
      else
        this.channel_ids = this.getIdTabs(data.me.channel_ids.me);      
      
      if(data.me.attachment_ids==undefined || !data.me.attachment_ids.me || data.me.attachment_ids.me.length==0)
        this.attachment_ids = [];
      else
        this.attachment_ids = this.getIdTabs(data.me.attachment_ids.me);      
  
        
      if(!data.me.author_id.me || data.me.author_id===undefined)
        this.author_id = {id:0, name: ""};
      else{
        if(Array.isArray(data.me.author_id.me))
          this.author_id = { id: data.me.author_id.me[0].me, name: data.me.author_id.me[1].me };
        else
          this.author_id = { id: data.me.author_id.me, name: "" };
      }
      
      if(!data.me.mail_message_id.me || data.me.mail_message_id===undefined)
        this.mail_message_id = {id:0, name: ""};
      else{
        if(Array.isArray(data.me.author_id.me))
          this.mail_message_id = { id: data.me.mail_message_id.me[0].me, name: data.me.mail_message_id.me[1].me };
        else
          this.mail_message_id = { id: data.me.mail_message_id.me, name: "" };
      }
        
  
      if(data.me.email_from==undefined || !data.me.email_from.me)
        this.email_from = "";
      else
        this.email_from = data.me.email_from.me;
  
      if(data.me.partner_ids==undefined || !data.me.partner_ids.me || data.me.partner_ids.me.length==0)
        this.partner_ids = [];
      else
        this.partner_ids = this.getIdTabs(data.me.partner_ids.me);
    
      if(data.me.subject==undefined || !data.me.subject.me)
        this.subject = "";
      else
        this.subject = data.me.subject.me;

    }
  
    //Initialisation des données
    initObjet(){
  
      this.id = 0;
      this.res_id = 0;
      this.needaction = false;
      this.date = '';
      this.model = "";
      this.body = "";
      this.channel_ids = [];
      this.attachment_ids = [];
      
      this.author_id = {id:0, name: ""};
      this.mail_message_id = {id:0, name: ""};
      this.email_from = "";
      //this.active = false;
      this.partner_ids = [];
      this.subject = "";
      this.email_cc = "";
      this.email_to = "";
    }
  
  
  }
  