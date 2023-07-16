import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestOcrPage } from './test-ocr';
import { ProgressBarModule } from 'angular-progress-bar';

@NgModule({
  declarations: [
    TestOcrPage,
  ],
  imports: [
    IonicPageModule.forChild(TestOcrPage),
    ProgressBarModule
  ],
})
export class TestOcrPageModule {}
