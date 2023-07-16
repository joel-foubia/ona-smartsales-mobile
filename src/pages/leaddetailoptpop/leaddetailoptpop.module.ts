import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaddetailoptpopPage } from './leaddetailoptpop';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LeaddetailoptpopPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaddetailoptpopPage),
    TranslateModule.forChild()
  ],
})
export class LeaddetailoptpopPageModule {}
