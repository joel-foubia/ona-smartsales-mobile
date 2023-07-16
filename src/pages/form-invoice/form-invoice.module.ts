import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormInvoicePage } from './form-invoice';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
   FormInvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(FormInvoicePage),
    TranslateModule.forChild()
  ],
})
export class FormInvoicePageModule {}
