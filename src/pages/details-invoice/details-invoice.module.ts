import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TranslateModule } from '@ngx-translate/core';
import { DetailsInvoicePage } from './details-invoice';

@NgModule({
  declarations: [
    DetailsInvoicePage
  ],
  imports: [
    IonicPageModule.forChild(DetailsInvoicePage), TranslateModule.forChild()
  ],
})
export class DetailsInvoicePageModule {}
