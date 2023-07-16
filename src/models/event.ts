/** Cette classe définit l'objet évènement (pour la gestion du modele event.event) **/

export class Evenement {

    public id;
    public name;
    public active;
    public address_id;
    public organizer_id;
    public event_type_id;
    public date_begin;
    public date_end;
    public state;
    public date_tz;
    public seats_min;
    public seats_availability;
    public seats_max;
    public event_ticket_ids;
    public seats_available;
    public user_id;
    public seats_reserved;
    public seats_expected;
    public seats_unconfirmed;
    public seats_used;
    public registration_ids;

    // public lines = [];

  
    /*
     * @param type string, correspond au type de données à insérer
     * @param serverJSON JSONObject, il s'agit des données qui proviennent du server ou 
     *                              d'une autre soruce
     *
     */
    constructor(serverJSON: any) {
      
      if(serverJSON!=null)
        this.setEvent(serverJSON);  
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
    setEvent(data : any){
      
      this.id = data.me.id.me;
  
      if(!data.me.active.me || data.me.active.me==undefined)
        this.active = false;
      else
        this.active = data.me.active.me;
      
      if(!data.me.name.me || data.me.name.me=='false')
        this.name = "";
      else
        this.name = data.me.name.me;
  
      if(!data.me.seats_availability.me || data.me.seats_availability.me=='false')
        this.seats_availability = "";
      else
        this.seats_availability = data.me.seats_availability.me;
  
      if(data.me.seats_reserved==undefined || !data.me.seats_reserved.me)
        this.seats_reserved = 0;
      else
        this.seats_reserved = data.me.seats_reserved.me;
        
      if(data.me.address_id==undefined || !data.me.address_id.me)
        this.address_id = {id:0, name:""};
      else
        this.address_id = { 
          id: data.me.address_id.me[0].me,
          name: data.me.address_id.me[1].me 
        };
  
      if(!data.me.state.me || data.me.state.me=='false')
        this.state = '';
      else
        this.state = data.me.state.me;
      
      if(!data.me.date_tz.me || data.me.date_tz.me=='false')
        this.date_tz = '';
      else
        this.date_tz = data.me.date_tz.me;
  
      if(data.me.seats_min==undefined || !data.me.seats_min.me)
        this.seats_min = 0;
      else
        this.seats_min = data.me.seats_min.me;
  
       if(data.me.seats_max==undefined || !data.me.seats_max.me)
        this.seats_max = 0;
      else
        this.seats_max = data.me.seats_max.me;
  
      if(data.me.seats_available==undefined || !data.me.seats_available.me)
        this.seats_available = 0;
      else
        this.seats_available = data.me.seats_available.me;
  
      if(data.me.seats_unconfirmed==undefined || !data.me.seats_unconfirmed.me)
        this.seats_unconfirmed = 0;
      else
        this.seats_unconfirmed = data.me.seats_unconfirmed.me;
  
      if(data.me.user_id==undefined || !data.me.user_id.me)
        this.user_id = {id:0, name:""};
      else
        this.user_id = {
          id: data.me.user_id.me[0].me,
          name: data.me.user_id.me[1].me 
        };
      
      if(data.me.organizer_id==undefined || !data.me.organizer_id.me)
        this.organizer_id = {id:0, name:""};
      else
        this.organizer_id = {
          id: data.me.organizer_id.me[0].me,
          name: data.me.organizer_id.me[1].me 
        };
  
      if(data.me.seats_used==undefined || !data.me.seats_used.me)
        this.seats_used = 0;
      else
        this.seats_used = data.me.seats_used.me;
  
      if(data.me.date_end.me==undefined || !data.me.date_end.me)
        this.date_end = '';
      else
        this.date_end = data.me.date_end.me;
      
      
      if(data.me.registration_ids==undefined || !data.me.registration_ids.me || data.me.registration_ids.me.length==0)
        this.registration_ids = [];
      else
        this.registration_ids = this.getIdTabs(data.me.registration_ids.me);
      
      if(data.me.seats_expected==undefined || !data.me.seats_expected.me)
        this.seats_expected = 0;
      else
        this.seats_expected = data.me.seats_expected.me;
  
      if(data.me.event_ticket_ids==undefined || !data.me.event_ticket_ids.me || data.me.event_ticket_ids.me.length==0)
        this.event_ticket_ids = [];
      else
        this.event_ticket_ids = this.getIdTabs(data.me.event_ticket_ids.me);
      
      if(data.me.event_type_id==undefined || !data.me.event_type_id.me || data.me.event_type_id.me=='false')
        this.event_type_id = {id:0, name:""};
      else
        this.event_type_id = { 
          id: data.me.event_type_id.me[0].me,
          name: data.me.event_type_id.me[1].me 
        };

      if(data.me.date_begin==undefined || !data.me.date_begin.me)
        this.date_begin = "";
      else
        this.date_begin = data.me.date_begin.me;
    }
  
      
    //Initialisation des données
    initObjet(){
    
      this.id = 0;
      this.date_begin = "";
      this.date_end = "";
      this.name = "";
      this.seats_availability = "unlimited";
      this.date_tz = "";
      this.user_id = {id:0, name: ""};
      this.seats_unconfirmed = 0;
      this.address_id = {id:0, name: ""}; 
      this.organizer_id = {id:0, name: ""};
      this.event_type_id = {id:0, name: ""};
      this.seats_used = 0;
      this.registration_ids = [];
      this.event_ticket_ids = [];
      this.seats_min = 0;
      this.seats_max = 0;
      this.seats_available = 0;
      this.state = 'open';
      this.seats_reserved = 0;
      this.seats_expected = 0;
      
    }
  
  
  }
  