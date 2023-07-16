/** Cette classe définit l'objet avocat (hr.employee) **/
export class Employe {

  public idx;
  public id;
  public name;
  public active;
  public is_absent_totay;
  public code;
  public name_related;
  public job_id;
  public image_url;
  public time_efficiency;
  public mobile_phone;
  public address_id;
  public work_email;
  public image;
  public genre;
  public birthdate;
  public address_home_id;
  public country_id;
  public passport_id;
  public identification_id;
  public contracts_count;
  public marital;
  public work_location;
  public children;
  public user_id;
  public resource_id; // Resources
  public resource_type; //nombre de factures liées au client

   

  //Définitions des messages à envoyer
  static error_phone = "Le numéro de téléphone n'a pas été attribué. Aller dans la rubrique Modifier";
  static error_work_mail = "Vous ne pouvez pas envoyer de mail, l'Email n'a pas été attribué. Attribuez un Email";
  static error_contracts_count = "Le site web ne peut pas s'ouvrir, l'adresse du site internet n'a pas été enregistré";
  static noInternet = "Impossible d'enregistrer. Problème de connexion Internet";
  static errSaving = "Une erreur est survenu lors de la création d'un nouveau";


  constructor(serverJSON: any) {

    
    if(serverJSON!=null)
      this.setEmployee(serverJSON);
    else
      this.createEmploye();
    
  } 

  //Permet de définir la liste des titres
  //à attribuer à un parternaire
  private listTabmaritals(){

    let tab_marital = [
      { id:'single', text:"Single"},
      { id:'married', text:"Married" },
      { id:'widover', text:"Widover"},
      { id:'divorced', text:"Divorced"}
      
    ];  

    return tab_marital;
  }

  /** 
   * Cette fonction retourne le titre
   * en fonction de l'id
   * @param id int, l'id du titre
   * @return string
   **/
  getMaritalById(id){

    let tab = this.listTabmaritals();

    for (let i = 0; i < tab.length; i++) {
      if(tab[i].id==id)
        return tab[i].text;
    }
 
  }

  /** Cette fonction permet de définir 
   * les valeurs des champs
   * @param data JSONObject, il s'agit des données JSON du serveur
   *
   ***/
  setEmployee(data : any){
    
    this.id = data.me.id.me;

    if(!data.me.name.me || data.me.name.me=='false')
      this.name = "";
    else
      this.name = data.me.name.me;

    if(data.me.name_related==undefined || !data.me.name_related.me || data.me.name_related.me=='false')
      this.name_related = "";
    else
      this.name_related = data.me.name_related.me;

    if(data.me.job_id==undefined || !data.me.job_id.me || data.me.job_id.me=='false')
      this.job_id = { id: 0, name: '' };
    else
      this.job_id = { id: data.me.job_id.me[0].me, name: data.me.job_id.me[1].me };

    if(data.me.work_email===undefined || !data.me.work_email.me || data.me.work_email.me=='false')
      this.work_email = "";
    else
      this.work_email = data.me.work_email.me;

    if(data.me.contracts_count.me=="http://false")
      this.contracts_count = "";
    else
      this.contracts_count = data.me.contracts_count.me;

    if(!data.me.address_id.me || data.me.address_id.me=='false')
      this.address_id = { id: 0, name: '' };
    else
      this.address_id = { id: data.me.address_id.me[0].me, name: data.me.address_id.me[1].me };

    if(!data.me.mobile_phone.me || data.me.mobile_phone.me=='false')
      this.mobile_phone = "";
    else
      this.mobile_phone = data.me.mobile_phone.me;

    if(!data.me.identification_id.me || data.me.identification_id.me=='false')
      this.identification_id = "";
    else
      this.identification_id = data.me.identification_id.me;

    if(!data.me.passport_id.me || data.me.passport_id.me=='false')
      this.passport_id = "";
    else
      this.passport_id = data.me.passport_id.me;

    if(!data.me.work_location.me || data.me.work_location.me=='false')
      this.work_location = "";
    else
      this.work_location = data.me.work_location.me;

    if(!data.me.address_home_id.me || data.me.address_home_id.me=='false')
      this.address_home_id = { id: 0, name: '' };
    else
      this.address_home_id = { id: data.me.address_home_id.me[0].me, name: data.me.address_home_id.me[1].me };

    if(!data.me.country_id.me || data.me.country_id.me===undefined)
      this.country_id = { id: 0, name: '' };
    else
      this.country_id = { id: data.me.country_id.me[0].me, name: data.me.country_id.me[1].me };

    if(data.me.birthdate==undefined || !data.me.birthdate.me || data.me.birthdate.me=='false')
      this.birthdate = "";
    else
      this.birthdate = data.me.birthdate.me;

    if(data.me.genre==undefined || !data.me.genre.me || data.me.genre.me=='false')
      this.genre = "";
    else
      this.genre = data.me.genre.me;

    if(data.me.image_url===undefined || !data.me.image_url.me)
      this.image_url = "assets/images/person.jpg";
    else
      this.image_url = data.me.image_url.me;

    /*if(!data.me.image.me || data.me.image.me=='false')
      this.image = "";
    else
      this.image = data.me.image.me;*/
    
    //ON attribut des valeurs aux restes des propriétés
    if(data.me.time_efficiency===undefined || !data.me.time_efficiency.me)
      this.time_efficiency = 0;
    else
      this.time_efficiency = data.me.time_efficiency.me;
 
    if(data.me.resource_id===undefined || !data.me.resource_id.me || data.me.resource_id.me=='false')
      this.resource_id = { id: 0, name: '' };
    else
      this.resource_id = { id: data.me.resource_id.me[0].me, name: data.me.resource_id.me[1].me };

    if(data.me.resource_type===undefined || !data.me.resource_type.me || data.me.resource_type.me=='false')
      this.resource_type = '';
    else
      this.resource_type = data.me.resource_type.me;

    if(data.me.marital===undefined || !data.me.marital.me || data.me.marital.me=='false')
      this.marital = ''; 
    else
        this.marital = data.me.marital.me;

    if (data.me.user_id == undefined || !data.me.user_id.me || data.me.user_id.me == 'false')
        this.user_id = { id: 0, name: '' };
    else
        this.user_id = { id: data.me.user_id.me[0].me, name: data.me.user_id.me[1].me };
     
    if(!data.me.children.me)
      this.children = 0;
    else  
      this.children = data.me.children.me;
    
    this.code = data.me.code.me;
    this.active = data.me.active.me;
    this.is_absent_totay = data.me.is_absent_totay.me;

  }


  //On créé un objet de type Partner
  createEmploye(){
    this.id = 0;
    this.name = "";
    this.name_related = "";
    this.job_id = { id: 0, name: '' };
    this.work_email = "";
    this.contracts_count = 0;
    this.address_id = { id: 0, name: '' };
    this.mobile_phone = "";
    this.identification_id = "";
    this.passport_id = "";
    this.address_home_id = { id: 0, name: '' };
    this.country_id = { id: 0, name: '' };
    this.birthdate = "";
    this.genre = "";
    this.image_url = "assets/images/person.jpg";
    this.image = "";
    this.time_efficiency = 0;
    this.resource_id = { id: 0, name: '' };
    this.resource_type = "";
    this.marital = '';
    this.user_id = { id: 0, name: '' };
    this.children = 0;
    this.code = "";
    this.work_location = "";
    this.active = true;
  }

}
