import { NgModule } from '@angular/core';
import { SanitizeHtmlPipe } from './sanitazion.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [SanitizeHtmlPipe, CommonModule],
  declarations: [SanitizeHtmlPipe],
  providers: [],
})
export class ApplicationPipesModule { }
