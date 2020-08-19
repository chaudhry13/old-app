import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionItemComponent } from './division-item/division-item.component';
import { DivisionListComponent } from './division-list/division-list.component';
import { DivisionSelectorComponent } from './division-selector/division-selector.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/_settings/application-pipes.module';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [DivisionItemComponent, DivisionListComponent, DivisionSelectorComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ApplicationPipesModule,
  ],
  exports: [
    DivisionItemComponent,
    DivisionListComponent,
    DivisionSelectorComponent,
    CommonModule,
    FormsModule
  ]
})
export class HumanrisksComponentsModule { }
