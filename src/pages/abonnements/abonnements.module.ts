import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbonnementsPage } from './abonnements';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
	declarations: [ AbonnementsPage ],
	imports: [
		IonicPageModule.forChild(AbonnementsPage),
		TranslateModule.forChild(),
		ComponentsModule
	]
})
export class AbonnementsPageModule {}
