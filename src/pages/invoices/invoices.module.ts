import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicesPage } from './invoices';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [ InvoicesPage ],
	imports: [ IonicPageModule.forChild(InvoicesPage), ComponentsModule, TranslateModule.forChild() ]
})
export class InvoicesPageModule {}
