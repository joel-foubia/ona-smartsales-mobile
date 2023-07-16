import { Component, Input, ViewChild } from '@angular/core';
import { Slides, Events } from 'ionic-angular';

/**
 * Generated class for the WalkingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'walking',
  templateUrl: 'walking.html'
})
export class WalkingComponent {

  isActive: boolean;
  @Input() data: any;
  @Input() events: any;
  @ViewChild('wizardSlider') slider: Slides;

  constructor(public evETS: Events) {
    // console.log('Hello WalkingComponent Component');
    // this.text = 'Hello World';
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

    	
			  //console.log(index);
			
				if (index > 0) {
					this.slider.slideNext(300);
        } else {
          this.slider.slidePrev(300);
        }
			
		  
  } 
    

    //Le Slide s'apprete à etre changé
    slideWillChange(){ 
      
      this.isActive = false;
    }


    //Le Slide a été changé
    slideHasChanged() {
      this.isActive = true;
      // if(this.slider.getActiveIndex() == 2){ 
      // } 

    }

    show(value: string): boolean {

      let result: boolean = false;
      if(this.data.items!==undefined){
        
        try {
          if (value == 'prev') {
              result = !this.slider.isBeginning();
          } else if (value == 'next') {
              result = this.slider.getActiveIndex() < (this.slider.length() - 1);
          } else if (value == 'finish') {
              result = this.slider.isEnd();
          }
        } catch (e) { }
      
        return result;  
          
      }

    }
	

    onEvent(event: string) {
        if (this.events!==undefined && this.events[event]) {
            //this.events[event]();
			      this.events[event]();
        }
        //console.log(event);
		
		// this.evETS.subscribe('slide:changed', (slide) => {
		// 	//console.log("slide"+slide);
		// 	this.slider.slideTo(slide);
			
		// });
  }

}
