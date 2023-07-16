/** Cet modèle représente le calendar **/

export class Calendar {

	date: any;
	daysInThisMonth: any;
	daysInLastMonth: any;
	daysInNextMonth: any;
	monthNames: string[];
	weekNames: string[];
	currentMonth: any;
	currentYear: any;
	currentDate: any;
	currentTime: any;
	selectedDate: any;
	isSelected: any;
	lang = "fr_FR";

  constructor() {
   	
  }

  
  //Cette fonction permet de charger
  //les jours de la semaine
  loadWeeks(){

  	if(this.lang=="fr_FR")
  		this.weekNames = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  	else if(this.lang=="en_US")
  	  this.weekNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  }

  //Cette fonction permet de charger
  //les mois d'une année
  loadMonths(){
    
    this.date = new Date();
  	if(this.lang=="fr_FR")
  		this.monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  	else if(this.lang=="en_US")
  		this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  	this.getDaysOfMonth();
  }

  //On récupère la date sélectionner
  //par l'utilisateur
  selectDate(day, event) {
    console.log(day);
    this.selectedDate = day;
   
    let segments = event.target.parentNode.children;
    let len = segments.length;

    for (let i=0; i < len; i++) {
      segments[i].classList.remove('active');
    }
    event.target.classList.add('active');


  }

  //Cette fonction permet de valider le choix
  //de l'utilisateur
  validateDate(){

  	let thisDate, heure;
  	if(this.currentTime)
  		heure = this.currentTime+":00";
  	else
  		heure = "08:00:00";

  	thisDate = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.selectedDate+" "+heure;
  }

  /**
   * Cette fonction permet d'obtenir
   * un visuel dynamique du calendrier
   *
   **/
  getDaysOfMonth() {
  
	  this.daysInThisMonth = new Array();
	  this.daysInLastMonth = new Array();
	  this.daysInNextMonth = new Array();
	  this.currentMonth = this.monthNames[this.date.getMonth()];
	  this.currentYear = this.date.getFullYear();
	  
	  if(this.date.getMonth() === new Date().getMonth()) {
	    this.currentDate = new Date().getDate();
	  } else {
	    this.currentDate = 999;
	  }

	  var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
	  var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
	  for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
	    this.daysInLastMonth.push(i);
	  }

	  var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
	  for (var i = 0; i < thisNumOfDays; i++) {
	    this.daysInThisMonth.push(i+1);
	  }

	  var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
	  var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
	  for (var i = 0; i < (6-lastDayThisMonth); i++) {
	    this.daysInNextMonth.push(i+1);
	  }
	  var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
	  if(totalDays<36) {
	    for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
	      this.daysInNextMonth.push(i);
	    }
	  }

  }

  goToLastMonth() {
	  this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
	  this.getDaysOfMonth();
  }

  goToNextMonth() {
	   this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
	   this.getDaysOfMonth();
  }

  goToMonth(theDate){
    this.date = new Date(theDate.getFullYear(), theDate.getMonth()+1, 0);
    this.getDaysOfMonth();
    this.currentDate = theDate.getDate();
  }

  //Cette fonction permet de remplir la liste des
  //audiences en fonction de la date choisit
  getListAudiences(list, strDate){

    let jour;

    if(typeof strDate=="number"){
      jour = this.date.getFullYear()+'-'+this.date.getMonth()+'-'+(strDate+2);
    }else{
      let objDate = new Date(strDate);
      jour = objDate.getFullYear()+'-'+objDate.getMonth()+'-'+objDate.getDate();
    }

    
    let txtJour = jour.toString();

    let events = [];
    for (let i = 0; i < list.length; i++) {
      let objets = list[i].tab;
      let tab = [];

      for (let j = 0; j < objets.length; j++) {
        let jourj = new Date(objets[i].date_done);
        let strjourj = jourj.getFullYear()+'-'+jourj.getMonth()+'-'+jourj.getDate();

          if(strjourj.toString()==txtJour){
            objets[i]['hour'] = jourj.getHours()+":"+jourj.getMinutes();
            tab.push(objets[i]);
          }
      }

      //Inserer les données dans le tableau
      if(tab.length!=0){
        events.push({'id':list[i].id, 'nom':list[i].nom, 'tab': tab}); 
      }
    }

    return events;
  }


}
