import { NgModule } from '@angular/core';
import { GroupNotePage } from './group-note';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [GroupNotePage],
  imports: [IonicPageModule.forChild(GroupNotePage), TranslateModule.forChild()],
})
export class GroupNotePageModule {}
