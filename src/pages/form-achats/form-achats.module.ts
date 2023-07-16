import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormAchatsPage } from './form-achats';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [ FormAchatsPage ],
	imports: [ IonicPageModule.forChild(FormAchatsPage), TranslateModule.forChild() ]
})
export class FormAchatsPageModule {}
