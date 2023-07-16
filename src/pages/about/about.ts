import { Component } from '@angular/core';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { AfProvider } from '../../providers/af/af';
import { TranslateService } from '@ngx-translate/core';
import { ImageProvider } from '../../providers/image/image';
import { OdooProvider } from '../../providers/odoo/odoo';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  txtEvaluate: any;
  defaultLogo: string;
  defaultImg: string;
  public data : any;
  private pending : string = "";
  txtMessage: string;
  objEvaluate: any;
  //public isAbout = false;

  constructor(public navCtrl: NavController, private servAF: AfProvider, private imgServ: ImageProvider, public loadCtrl: LoadingController, public odooServ: OdooProvider, public translate: TranslateService) {
    this.defaultImg = "assets/images/team.jpg";
    this.defaultLogo = "assets/images/logo.png";
      this.displayAbout();
        
      this.txtMessage = "";
      this.translate.get('message').subscribe(text=>{
          this.txtMessage = text.website;
          this.pending = text.load_about;
          
         this.objEvaluate = {
              title: text.title_evaluate,
              plutard: text.plutard,
              no: text.nonmerci,
              ok: text.evaluate,
              txtEvaluate: text.txt_evaluate
          };
      });

  }

  //THis method is used to call 
  onEvent(type, data){
    if(type=='onAgreement' || type=='onGoogle' || type=='onLinkedIn' || type=='onInstagram' || type=='onTwitter' || type=='onFacebook'){
        // this.odooServ.doWebsite(data, this.txtMessage); 
    }else if(type=='onEvaluate'){
        this.odooServ.doEvaluate(data, this.objEvaluate);
    }
  }

  ionViewDidLoad() {}

  displayAbout(){

    // let loading = this.loadCtrl.create({content: this.pending});
    // loading.present();

  	this.servAF.getInfosAbout((res)=>{
  		// console.log(res);
  		this.data = {
            iconLike: 'icon-thumb-up',
            iconFavorite: 'icon-heart',
            iconShare: 'icon-share-variant',
            title: res.name,
            titleDescription: res.compagnyDescription,
            contentTitle: res.product,
            versionName: res.version,
            contentDescription: res.productDescription,
            iconLoacation: 'icon-map-marker-radius',
            iconLoacationText: res.address,
            postalCode: res.postalCode+", "+res.city,
            iconFace: 'assets/icon/fb.png',
            iconFaceText: res.facebookPage,
            iconGoogle: 'assets/icon/googleplus.png',
            iconGoogleText: res.googleplusPage,
            iconInstagram: 'assets/icon/instagram.png',
            iconInstagramText: res.instagramPage,
            iconLinkedIn: 'assets/icon/linkedin.png',
            iconLinkedInText: res.linkedinPage,
            iconPhone: 'icon-phone',
            iconPhoneText: res.phoneNumber,
            iconEarth: 'assets/icon/twitter.png',
            iconEarthText: res.twitterPage,
            iconEmail: 'icon-email-outline',
            iconEmailText: res.email,
            iconWeb: 'icon-earth',
            iconWebText: res.website,
            agreementText: res.agreement,
            appstore: res.appstore,
            playstore: res.playstore,
            copyright: res.copyright,
            aboutimg: res.about_image
        };

        //Mettre à jour le logo
        this.imgServ.getCallbackURL(res.logo, (res)=>{
           //console.log(res);
           this.data['logo'] = res;
           
        });

        //loading.dismiss();
  	});
  }
  testOcr(){
    this.navCtrl.push('TestOcrPage');
  }

}
