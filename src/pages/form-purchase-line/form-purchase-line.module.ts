import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormPurchaseLinePage } from './form-purchase-line';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [ FormPurchaseLinePage ],
	imports: [ IonicPageModule.forChild(FormPurchaseLinePage), TranslateModule.forChild() ]
})
export class FormPurchaseLinePageModule {}
