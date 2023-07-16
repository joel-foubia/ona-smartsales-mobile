/** Cette classe définit l'objet project (pour la gestion du modele project.project) **/
import { ConfigOnglet } from '../config';

export class Project {

  public id;
  public name;
  public code;
  public bg;
  public bitcs_lang;
  public priority;
  public tag_ids;
  public active;
  public bitcs_lawyer;
  public bitcs_court;
  public image_url;
  public analytic_account_id;
  public bitcs_nature;
  public bitcs_stage_id;
  public bitcs_description;
  public bitcs_opposing_lawyer;
  public bitcs_opposing_party;
  public invoice_count;
  public color;
  
  public ona_hearing_count;
  public note_count;
  public meeting_count;
  public task_count;
  public partner_id;
  public user_id;
  public credit; // Montant que le client doit
  
  //Définitions des messages à envoyer
  static error_save = "Impossible d'enregistrer une affaire";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";


  constructor(serverJSON: any) {
    if(serverJSON!=null)
      this.setPartner(serverJSON);
    else
      this.initProject();
    
  }

  private getIdTabs(liste){

    let tab = [];
    for (var i = 0; i < liste.length; i++) {
        tab.push(liste[i].me);
    }

    return tab;
  }

  /** 
   * Cette fonction retourne le libelle de la notification
   * en fonction de l'id
   * @param id string, l'id du titre
   * @return string 
   **/
  getTitreById(id, tab){

    for (let i = 0; i < tab.length; i++) {
      if(tab[i].id==id)
        return tab[i].text;
    }

    return '';

  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setPartner(data : any){
    
    this.id = data.me.id.me;
    this.bg = data.bg;
    this.active = data.me.active.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(data.me.bitcs_lawyer==undefined || !data.me.bitcs_lawyer.me || data.me.bitcs_lawyer.me=='false')
      this.bitcs_lawyer = {id:0, name: ""};
    else
      this.bitcs_lawyer = { 
        id: data.me.bitcs_lawyer.me[0].me,
        name: data.me.bitcs_lawyer.me[1].me 
      };

    if(data.me.partner_id==undefined || !data.me.partner_id.me)
      this.partner_id = {id:0, name:""};
    else
      this.partner_id = { 
        id: data.me.partner_id.me[0].me,
        name: data.me.partner_id.me[1].me 
      };

    if(data.me.bitcs_court==undefined || !data.me.bitcs_court.me || data.me.bitcs_court.me=='false')
      this.bitcs_court = {id:0, name: ""};
    else
      this.bitcs_court = { 
        id: data.me.bitcs_court.me[0].me,
        name: data.me.bitcs_court.me[1].me 
      };

    if(!data.me.bitcs_opposing_lawyer.me || data.me.bitcs_opposing_lawyer.me=='false')
      this.bitcs_opposing_lawyer = {id:0, name: ""};
    else
      this.bitcs_opposing_lawyer = { 
        id: data.me.bitcs_opposing_lawyer.me[0].me,
        name: data.me.bitcs_opposing_lawyer.me[1].me 
      };

    if(!data.me.note_count.me)
      this.note_count = 0;
    else
      this.note_count = data.me.note_count.me;

    if(!data.me.bitcs_description.me || data.me.bitcs_description.me=='false')
      this.bitcs_description = "";
    else
      this.bitcs_description = String(data.me.bitcs_description.me).replace(/<[^>]+>/gm, '');

    if(!data.me.bitcs_stage_id.me || data.me.bitcs_stage_id.me=='false')
      this.bitcs_stage_id = {id:0, name: ""};
    else
      this.bitcs_stage_id = { 
        id: data.me.bitcs_stage_id.me[0].me,
        name: data.me.bitcs_stage_id.me[1].me 
      };

    if(!data.me.ona_hearing_count.me)
      this.ona_hearing_count = 0;
    else
      this.ona_hearing_count = data.me.ona_hearing_count.me;

    if(!data.me.color.me)
      this.color = 0;
    else
      this.color = data.me.color.me;

   /* if(data.me.invoice_statut==undefined || !data.me.invoice_statut.me || data.me.invoice_statut.me=='false')
      this.invoice_statut = "";
    else
      this.invoice_statut = data.me.invoice_statut.me;*/

    if(!data.me.invoice_count.me)
      this.invoice_count = 0;
    else
      this.invoice_count = data.me.invoice_count.me;

    if(data.me.bitcs_opposing_party==undefined || !data.me.bitcs_opposing_party.me)
      this.bitcs_opposing_party = {id:0, name: ""};
    else
      this.bitcs_opposing_party = {
        id: data.me.bitcs_opposing_party.me[0].me,
        name: data.me.bitcs_opposing_party.me[1].me 
      };

    if(!data.me.image_url.me || data.me.image_url.me=='false')
      this.image_url = "assets/images/person.jpg";
    else
      this.image_url = data.me.image_url.me;
    
    //ON attribut des valeurs aux restes des propriétés
    if(data.me.bitcs_nature==undefined || !data.me.bitcs_nature.me)
      this.bitcs_nature = {id:0, name: ""};
    else
      this.bitcs_nature = {
        id: data.me.bitcs_nature.me[0].me,
        name: data.me.bitcs_nature.me[1].me 
      };

    if(data.me.analytic_account_id==undefined || !data.me.analytic_account_id.me)
      this.analytic_account_id = {id:0, name: ""};
    else
      this.analytic_account_id = {
        id: data.me.analytic_account_id.me[0].me,
        name: data.me.analytic_account_id.me[1].me 
      };

    if(data.me.credit==undefined || !data.me.credit.me)
      this.credit = 0;
    else
      this.credit = data.me.credit.me;

    if(data.me.invoice_count==undefined || !data.me.invoice_count.me)
      this.invoice_count = 0;
    else
      this.invoice_count = data.me.invoice_count.me;

    if(data.me.task_count==undefined || !data.me.task_count.me)
      this.task_count = 0;
    else
      this.task_count = data.me.task_count.me; 

    if(data.me.meeting_count==undefined || !data.me.meeting_count.me)
      this.meeting_count = 0;
    else
      this.meeting_count = data.me.meeting_count.me;

    if(data.me.tag_ids==undefined || !data.me.tag_ids.me || data.me.tag_ids.me.length==0)
      this.tag_ids = [];
    else
      this.tag_ids = this.getIdTabs(data.me.tag_ids.me);

    if(data.me.priority==undefined || !data.me.priority.me)
      this.priority = 0;
    else
      this.priority = data.me.priority.me;

    if(!data.me.bitcs_lang.me || data.me.bitcs_lang.me==undefined)
      this.bitcs_lang = { id: 0, titre: ''};
    else  
      this.bitcs_lang = {
          id: data.me.bitcs_lang.me[0].me,
          titre: data.me.bitcs_lang.me[1].me 
      };

    if(!data.me.user_id.me || data.me.user_id.me==undefined)
      this.user_id = { id: 0, name: ''};
    else  
      this.user_id = {
          id: data.me.user_id.me[0].me,
          titre: data.me.user_id.me[1].me 
      };

    //this.bitcs_lang = data.me.bitcs_lang.me;
    this.code = data.me.code.me;

  }

  //Cette fonction permet d'initialiser un objet Project
  initProject(){
    this.id = 0;
    this.bg = '#ffffff';
    this.active = true;
    this.name = "";
    this.bitcs_lawyer = {id:0, name:""};
    this.user_id = {id:0, name:""};
    this.partner_id = {id:0, name:""};
    this.bitcs_court = {id:0, name: ""};
    this.bitcs_opposing_lawyer = {id:0, name:""};
    this.note_count = 0;
    this.bitcs_description = "";
    this.bitcs_stage_id = {id:0, name:""};
    this.ona_hearing_count = 0;
    this.color = 0;
    this.invoice_count = 0;
    this.bitcs_opposing_party = {id:0, name:""};
    this.image_url = "assets/images/person.jpg";
    this.bitcs_nature = {id:0, name: ""};
    this.analytic_account_id = {id:0, name:""};
    this.credit = 0;
    this.invoice_count = 0;
    this.task_count = 0;
    this.meeting_count = 0;
    this.tag_ids = [];
    this.priority = 0;
    this.bitcs_lang = { id: 0, titre: ''};
    this.code = '';
  }


}
