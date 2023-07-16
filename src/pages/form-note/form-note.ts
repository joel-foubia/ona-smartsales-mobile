import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController, AlertController, Events, IonicPage } from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo/odoo';
import { LoginProvider } from '../../providers/login/login';

import { TranslateService } from '@ngx-translate/core';

import { Note } from '../../models/note';


@IonicPage()
@Component({
  selector: 'page-form-note',
  templateUrl: 'form-note.html',
})

export class FormNotePage {

	private connexion: any;
  private id_note;
	public note : any;
	public listClients;
	public objSpinner;
  public isHTML;
	public is_modif = false;
  public tags :any = [];
  public autocompleteItems = [];
  public isFile = false;
  private tagIds = []; //Pour stocker les ids des tags
  public tabButtons = [];
  private txtLangue : any;
  private txtPop : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public vc: ViewController, private odooService: OdooProvider, public popCtrl: PopoverController, public alert: AlertController, public evEVT: Events, private lgServ: LoginProvider, public translate: TranslateService) {

  		//ON charge les dossiers clients
      // this.onSelectObjet('briefcase');
  		
      
      this.txtLangue = this.odooService.traduire().module.notes;
      this.translate.get('pop').subscribe(_res=>{
        this.txtPop = _res;
      });
      
      this.tabButtons = this.loadButtonsHeader();

      let objNote = this.navParams.get('objConnect').note;
      let txtVoice = this.navParams.get('objConnect').toSend;
  		// let objAffaire = this.navParams.get('objConnect').affaire;
      
  		this.connexion =  {
          'login': this.navParams.get('objConnect').login, 
          'user':this.navParams.get('objConnect').user
      };

  		if(objNote!=null){
  			this.note = objNote;
        let txtArea = this.stripHtml(objNote.memo);
         
        objNote.memo = txtArea;
        this.id_note = objNote.id;

        this.note.memo = txtArea;
  			this.is_modif = true;
        this.loadTags();

  		}else{
  			
        this.note = new Note(null);
        this.note.memo = txtVoice;
  		}

  }

  ionViewDidLoad() {}

  //Cette fonction permet de supprimer
  //les balises html dans un texte
  private stripHtml(texte){
    let result = "";
      result = texte.replace(/<(?:.|\n)*?>/gm, '\n');
    return result;
  }

  //Afficher la liste des actions 
  //à appliquer sur la note
  showMore(theEvent){
    
    let popover = this.popCtrl.create('PopNote2Page', {'lang': this.txtPop});
    popover.present({ ev: theEvent});

    popover.onDidDismiss((result)=>{

        if(result){
          //console.log(result);
          this.applyUpdateOnNotes(result);
        }
    });

  }

  //Cette fonction permet d'ouvrir le
  //calendrier afin que l'utilisateur puisse
  //choisir une date
  openCalendar(event){
    
    let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
    this.note['rappel'] = '';

    let popover = this.popCtrl.create('CalendrierPage', {}, {cssClass: 'custom-popcalendar'});
    popover.present({ ev});
    popover.onDidDismiss((result)=>{

        if(result){
          this.note.rappel = result;
          //this.applyUpdateOnNotes(result);
        }
    });    
  }

  //Cette fonction permet de charger
  //les boutons
  loadButtonsHeader(){
    
    let tab = [
      { nom: this.txtPop.color, couleur: true, icon:'ios-color-palette-outline', slug: 'color'},
      // { nom: this.txtPop.image, image: true, icon:'ios-image-outline', slug: 'img'},
      { nom: this.txtPop.mic_title , micro: true, icon:'ios-mic-outline', slug: 'micro'},
      { nom: this.txtPop.archive , archive: true, icon:'ios-archive-outline', slug: 'archive'},
      //{ nom: 'Supprimer' , corbeille: true, icon:'ios-trash-outline', slug: 'corbeille'}
    ]; 

    return tab;
  }

  //Cette fonction permet de changer
  //la couleur d'arrière plan d'une note
  onColor(){

    let popover = this.popCtrl.create('PopColorPage', {'couleur': this.note.color}, {cssClass: 'custom-popcolor'});
    let ev = {
        target : { getBoundingClientRect : () => { return { top: '100' }; } }
      };
    popover.present({ev});
    popover.onDidDismiss((result)=>{
      //console.log(result);
        if(result){
          this.note.color = result.code;
          this.note.bg = result.val;

          let data = {'color': result.code};
          this.odooService.updateNoSync('notes', this.note, this.id_note, 'standart');

          setTimeout(() => {
            //On modifie le stage de la note
            this.updateNoteByAction('couleur', this.connexion.user, this.connexion.login, 'notes', this.id_note, data);
          }, 500);
        }
    });

  }

  //Permet la création d'une note à partir
  //de la voix (la voix est convertier en texte)
  onAddVoiceNote(){

    let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
    let popover = this.popCtrl.create('SpeechToTextPage', {'lang': this.txtPop}, {cssClass: 'custom-popaudio'});
    
    popover.present({ev});
    popover.onDidDismiss((result)=>{
      
        if(result){
          //this.onAdd(result);
          this.note.memo += " "+ result;
        }
    });    
  }

  //Cette fonction permet d'appliquer les mises
  //à jour sur la note suite à une action
  applyUpdateOnNotes(result){
    
    let choice_action = '';

    switch(result.slug){
      case 'archive': {
        
        let data = {'open':false };
        this.note.open = false;

        this.evEVT.publish('note:changed', this.note.id);
        this.odooService.updateNoSync('notes', this.note, this.id_note, 'standart');
        this.updateNoteByAction('archive', this.connexion.user, this.connexion.login, 'notes', this.id_note, this.note);
        break;
      }
      case 'corbeille': {
        
        let data = {'corbeille':true, 'data': { active: false } };
        this.updateNoteByAction('corbeille', this.connexion.user, this.connexion.login, 'notes', this.id_note, data);
        break;
      }
      case 'color': {
        
        this.onColor();
        break;
      }
      case 'micro':{
        this.onAddVoiceNote();
        break;
      }
      case 'copie':{

        if(this.note.id!=0){
          
          this.odooService.syncDuplicateObjet('notes', this.note);
          this.evEVT.publish('add_notes:changed', { item: this.note, id: this.note.id});
          this.odooService.showMsgWithButton(this.txtLangue.copy, 'top', 'toast-success');
        }else{
          this.odooService.showMsgWithButton("Impossible de dupliquer cette note car elle n'est pas synchroniser",'top', 'toast-error');
        }
        
        break;
      }
      case 'share':{
        let message = this.note.memo, subject = '';
        this.odooService.doShare(message, subject, null, '', 'notes');
        //this.odooService.shareNoteToUser(this.note);
        break;
      }
      case 'tag':{
        // this.addPromptTag();
        break;
      }
    }

    
  }

  

  //Cette fonction permet de controller
  // la note, la valider puis l'enregistrer sous Odoo
  saveItem(){

  	let newItem = this.note;

  	//close current wien and pass data
    if(!this.note.memo){
      this.odooService.showMsgWithButton(this.txtLangue.f_error, 'top', 'toast-error');
    }else{
      
      // if(!this.is_modif || this.note.me===undefined)
      //   this.evEVT.publish('add_notes:changed', { item: this.note, id: 0});
      this.vc.dismiss(newItem);
             
    }

  }
  
  private getTagNotRegistered(tab){
    let objet = [];
      for (let i = 0; i < tab.length; i++) {
        if(tab[i].id==0){
          objet.push({'id':0, 'name':tab[i].nom}); 
        }
          
      }
    return objet;
  }

  //Fermer le formulaire
  close(){
  	this.vc.dismiss();
  }

  /**
   * Cette fonction permet de mettre à jour
   * une note en fonction de l'action à appliquer sur la note
   * @param action JSONObject, il contient l'action à executer et le message à afficher en cas
   *                          de succès
   * @param user, les paramètres de connexion
   * @param login, les paramètres du user connecté
   * @param idObj int, l'identifiant de la note à modifier
   * @param data JSONObject, les données à insérer
   *
   **/
  private updateNoteByAction(action, user, login, type, idObj, data){

    let message = '', txtError = '';

      switch(action){
        case 'stage': { message = this.txtLangue.stage; break; }
        case 'archive': { message = this.txtLangue.archive; break; }
        case 'corbeille': { message = this.txtLangue.delete; break; }
        case 'note_tag': { message = this.txtLangue.f_tag; break; }
        case 'couleur': { message = this.txtLangue.color; break; }
      }
      
      data['id'] = idObj;
      //Définition de la requête
      this.odooService.updateSyncRequest(type, data);
      this.odooService.showMsgWithButton(message, "top", 'toast-success');
      
      //Mise à jour de la liste des notes (bd interne)
      //this.odooService.updateListStagesSync(type);
  }

  //Cette fonction va récupérer la liste
  //des natures d'affaires, les statuts, les tribunaux
  //les employés qui sont enregistrés en bd
  //@param type string, correspond au type d'objet que l'on souhaite récupérer
  onSelectObjet(type){}

  
  //Cette fonction permet d'afficher la liste des tags
  loadTags(){
    
      this.odooService.getTagsOfType('tag_note', this.note.tag_ids).then((res: any)=>{
        console.log(res);
        this.tags = res;
      });
  
  }
  
  //ajouter un tag
  addTag(event){
      /**/
      let ev = { target : { getBoundingClientRect : () => { return { top: '100' }; } }};
      let popover = this.popCtrl.create('PopTagPage', {lang: this.txtPop}, {cssClass: 'custom-popaudio'});
      
      popover.present({ev});
      popover.onDidDismiss((result)=>{
          
          if(result){ 
            //console.log(result);
            let find = false;
  
            for(let i = 0; i< result.tags.length; i++){
              for (let j = 0; j < this.tags.length; j++) 
                if(this.tags[j].me.id.me==result.tags[i].me.id.me){
                  find = true;
                  break;
                }
              
              if(!find || this.tags.length==0)
                this.tags.push(result.tags[i]);
            }
  
            for(let i = 0; i< result.tab.length; i++){
              if(this.note.tag_ids.indexOf(result.tab[i])==-1 || this.note.tag_ids.length==0)
                this.note.tag_ids.push(result.tab[i]);
            }
  
            if(result.add!=""){
              this.objSpinner = true;
              this.odooService.editTag('tag_note', result, (res)=>{
                console.log(res); 
                this.tags.push(res);
                this.odooService.copiedAddSync('tag_note', res);
                this.note.tag_ids.push(res.me.id.me);
                this.objSpinner = false;
                this.odooService.showMsgWithButton("Tag added", 'bottom', 'toast-info');
              });
            }
  
            //Mettre à jour les tags dans le dossier affaire
            let majData = { tag_ids: this.note.tag_ids};
            // this.updateNoteByAction('note_tag', this.connexion.user, this.connexion.login, 'notes', this.note.id, majData);
  
          }
    
      });//Fin du Pop Tag 
            
    }
  
    //ajouter un tag
    changeTag(tag){
      this.odooService.editTag('note_tag', tag, (res)=>{
        //tag.me.name.me = res;
        this.odooService.showMsgWithButton("Tag is updated", 'bottom');
      });
    }
  
    //Retirer un tag de l'affaire
    removeTag(tag, index){
  
      this.tags.splice(index,1);
      let elements = this.note.tag_ids;
  
      for(let i = 0; i < elements.length; i++){
        if(tag.me.id.me==elements[i]){
          this.note.tag_ids.splice(i,1);
          break;
        }
      }
  
      let majData = { tag_ids: this.note.tag_ids};
      // this.updateNoteByAction('note_tag', this.connexion.user, this.connexion.login, 'notes', this.note.id, majData);
  
    }


}
