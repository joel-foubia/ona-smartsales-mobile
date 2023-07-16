import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AfProvider } from '../../providers/af/af';
import { LoginProvider } from '../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';

// declare var google: any;

@IonicPage()
@Component({
  selector: 'page-ground',
  templateUrl: 'ground.html',
})
export class GroundPage {

  noLocationCoords: any;
  defaultImg: string;
  txtLangue: any;
  currentPosition: any;
  owner: any;
  txtZoom = 12;
  // @ViewChild('map') mapElement: ElementRef;
  map: any;
  vendeurs: any;
  team: any;
  markers = [];
  mapStyles = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    }
	];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private afServ: AfProvider, private lgServ: LoginProvider, private translate: TranslateService) {
    
    this.team = this.navParams.get('team');
    this.vendeurs = this.navParams.get('membres');
    this.owner = this.navParams.get('owner');
    this.defaultImg = "assets/images/person.jpg";
    
    this.translate.get("module").subscribe(res=>{
      this.txtLangue = res.hr;
    });
  }

  ionViewDidLoad() {
    this.initMap();
  }

  //Cette fonction permet de charger Google Maps
  initMap() {

    //On centre la carte sur la position de l'utilisateur
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout:5000, enableHighAccuracy: true }).then((resp) => {
      
      this.currentPosition = {latitude: resp.coords.latitude, longitude: resp.coords.longitude};
      this.lgServ.setDataNoStringy("coordinates", this.currentPosition);

      this.getListOfSalers();
    }, (err)=>{

      console.log(err);
      if(err.code==3){

        this.lgServ.isTable("coordinates").then(rep=>{
          if(rep){
            // let mylocation = new google.maps.LatLng(rep.latitude, rep.longitude);
            this.currentPosition = {latitude: rep.latitude, longitude: rep.longitude};
          }

          this.getListOfSalers();
        });

      }else if(err.code==2){
        this.afServ.showMessageWithBtn(this.txtLangue.no_gps,'toast-info');
        // this.deleteMarkers();
        this.getListOfSalers();
      }else if(err.code==1){
        this.afServ.showMessageWithBtn(this.txtLangue.required_gps,'toast-info');
      }


    });

    //On capture la position de l'utilisateur à chaque fois
    //que ce dernier se déplace
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data:any) => {

      console.log(data);
      if(data.code!==undefined && data.code==2){
        
      }else{

        this.deleteMarkers();
        this.afServ.updateGeolocation(this.owner.id, data.coords.latitude,data.coords.longitude);
        // let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
  
        this.currentPosition = {latitude: data.coords.latitude, longitude: data.coords.longitude};
  
        let image = 'assets/imgs/user.png';
        this.addMarker(this.currentPosition, image, this.owner);
        // this.setMapOnAll(this.map);
      }

    },(err)=>{
      console.log(err);
    });

  }

  //Effacer les markers
  clearMarkers() {
    this.setMapOnAll(null);
  }

  //Cette fonction permet de supprimer
  //les markeurs sur la carte
  deleteMarkers(){
    // this.clearMarkers();
    this.markers = [];
  }

  /**
   * Ajoute le marqueur sur la carte
   * @param location, Paramètres Lat, long du vendeur
   * @param image, l'icone du representant le vendeur sur la carte
   * @param vendeur User, objet de type user
   */
  addMarker(location, image, vendeur){

    let marker = {
      lat: location.latitude,
      lng: location.longitude,
      infos: vendeur,
      icon: image
    };

    this.markers.push(marker);
  }

  /**
   * Cette fonction permet d'afficher les vendeurs
   * sur la Map
   * @param map Object, GMaps
   */
  setMapOnAll(map){

    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  //On récupère la liste des positions depuis firebase
  getListOfSalers(){
    
    this.afServ.listOfSalers().subscribe(res=>{
      console.log(res);
      this.deleteMarkers();
      let salers = this.matchSalersFromFirebase(res);
      
      for (let i = 0; i < salers.length; i++) {
        const element = salers[i];
        let updatelocation = {latitude: element.latitude, longitude: element.longitude};

        if(element.uuid != this.owner.id) {
          let image = 'assets/imgs/team.png';
          this.addMarker(updatelocation, image, element.infos);
          // this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/user.png';
          this.addMarker(updatelocation, image, element.infos);
          // this.setMapOnAll(this.map);
        }
        
      }

      //initialisation du point markeur
      if (this.markers[0]) {

        this.noLocationCoords = {
          lat: this.markers[0].lat,
          lng: this.markers[0].lng
        };
      }

      console.log(this.noLocationCoords);

    });
  }

  /**
   * Cette fonction permet de faire la correspondance
   * avec la liste des vendeurs
   * @param res Array<any>, le tableau de structure (uuid, lat, long) sur firebase
   */
  matchSalersFromFirebase(res){
    
    let results = [];
    for (let i = 0; i < res.length; i++) {
      let element = res[i];
      for (let j = 0; j < this.vendeurs.length; j++) {
        if(element.uuid==this.vendeurs[j].id){
          element['infos'] = this.vendeurs[j];
          results.push(element);    
        }
      }
    }

    console.log(results);
    return results;
  }

  // /**
  //  * Formatage de la fenetre window
  //  * @param vendeur User
  //  * @returns string html
  //  */
  // contentString(vendeur){

  //   let content = "<ion-item>";
  //   content += "<h3>"+vendeur.name+"</h3>";
  //   content += "<p>"+vendeur.email+"</p>";
  //   content += "</ion-item>";

  //   return content;
  // }

  openUser(vendeur){
    this.navCtrl.push('ProfilePage', { objet: vendeur, modif:'no' });		
  }

}
