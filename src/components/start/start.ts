// import { LoginPage } from './../../../pages/login/login';
import { Component, Input } from '@angular/core';
import { NavController, Slides, Events } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { QrCodeProvider } from '../../providers/qr-code/qr-code';
import { LoginProvider } from '../../providers/login/login';
import { ImageProvider } from '../../providers/image/image';
import { AfProvider } from '../../providers/af/af';

// @IonicPage()
@Component({
    selector: 'start',
    templateUrl: 'start.html'
})

export class StartComponent { 
	txtDescription: any;
    @Input() data: any;
    @Input() events: any;
    @ViewChild('wizardSlider') slider: Slides;
	
	public abonneNumber = null;
	public clientNumber = null;
	public objSetting = null;
	public objSpinner = false;
	public logo_client : any;
	private lock = false;

    constructor(public navCtrl: NavController, private lgService: LoginProvider, private evETS: Events, private imgServ: ImageProvider, public qrServ: QrCodeProvider, private servAF: AfProvider) {
		this.lgService.getSettingUser().then((data) => {
			if(data){
				this.objSetting = data;
				this.lock = true;
			}

			//On remplie abonneNumber et clientNumber
			// if(this.data.subChanged!==undefined){
			// 	this.clientNumber = this.data.subChanged.abonneNumber;
			// 	this.abonneNumber = this.data.subChanged.subNumber;
			// }

		});
		
		this.showDescription();
	}

	//Cette fonction permet de définir la description
	showDescription(){
		
    this.servAF.getListMessages().subscribe(_data =>{
		let myLang;

          for(var k in _data){
			  
						if(this.data===undefined)
							myLang = 'fr';
						else
							myLang=this.data.lang;
				   		   
            if(myLang==_data[k].$key){
              this.txtDescription = _data[k].$value;
              break; 
            }
          }
         
        }, (err=>{
			//this.txtDescription = this.data.description_start;
		}));
	}

    changeSlide(index: number): void {
        
		this.goToLogin(index);
		 
		/*if (index > 0) {
			this.slider.slideNext(300);
        } else {
            this.slider.slidePrev(300);
        }*/
    }

    goToLogin(index){

    	if(this.slider.getActiveIndex() == 0){
			//console.log(index);
			if(this.objSetting){
				this.navCtrl.push('LoginPage');
			}else{ //no abonne

				if (index > 0) {
					this.slider.slideNext(300);
		        } else {
		            this.slider.slidePrev(300);
		        }
			}
		}
    } 
    

    //Le Slide s'apprete à etre changé
    slideWillChange(){

    	if(this.lock){
    		this.navCtrl.push('LoginPage');
    	} 
    }

    //Cette fonction permet d'ouvrir l'utilitaire scanning
    //afin de capturer une image QR
    openScan(){
    	
    	this.qrServ.scan().then((result:any)=>{
    		let texte = result.text;
    		let tab = texte.split(";");

    		this.clientNumber = tab[0];
    		this.abonneNumber = tab[1];

    	}).catch((error)=>{
    		this.qrServ.showMessage(error);

    	});
    }

    //Le Slide a été changé
    slideHasChanged() {

		if(this.slider.getActiveIndex() == 1){
			this.lgService.getSettingUser().then((data) => {
				if(data){
					//console.log(data);
					this.objSetting = JSON.parse(data);
					
					this.imgServ.getCallbackURL(this.objSetting.logo, (res)=>{
					   this.logo_client = res;
					});
				}else{
					//console.log('no data');
				}
			});
		} 
    }

    show(value: string): boolean {

        let result: boolean = false;
		if(this.data.items!==undefined){
			
			try {
				if (value == 'prev') {
					result = !this.slider.isBeginning();
				} else if (value == 'next') {
					
					if(this.slider.getActiveIndex()==1){
						this.slider.lockSwipeToNext(true);
						result = false;
					}else{
						this.slider.lockSwipeToNext(false);
						result = this.slider.getActiveIndex() < (this.slider.length() - 1);
					}
						
				} 
				else if (value == 'valid'){
					if(this.slider.getActiveIndex() == 0)
						result = true;
				}
				else if (value == 'finish') {
					result = this.slider.isEnd();
				}
				
				
			} catch (e) {}
			
			return result;
		}

    }
	
	showSpinner(){
		this.objSpinner = true;
	}
	 
	setSpinnerVal(value){
		this.objSpinner = value;
	}

    onEvent(event: string) {
        if (this.events!==undefined && this.events[event]) {
            //this.events[event]();
					this.events[event]({
						'abonneNumber' : this.abonneNumber,
						'clientNumber' : this.clientNumber,
						'currentSlider': this.slider,
						'objSpinner' : {
							isActif: (value) =>{
								this.setSpinnerVal(value);
							}
						}
					});
        }
        //console.log(event);
		
		//Move Slider
		this.evETS.subscribe('slide:changed', (slide) => {
			//On redirige le vers le formulaire d'abonnement
			//console.log("slide"+slide);
			this.slider.slideTo(slide);
			
		});
		
		//Move Slider and load data subscription
		this.evETS.subscribe('subscription:changed', (slide) => {
			//On redirige le vers le formulaire d'abonnement
			console.log(slide);
			this.clientNumber = slide.abonneNumber;
			this.abonneNumber = slide.subNumber;
			this.slider.slideTo(slide.toSlide);
			
		});

  }
}
