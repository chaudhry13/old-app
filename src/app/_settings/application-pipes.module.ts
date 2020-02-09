import { NgModule } from '@angular/core';
import { SanitizeHtmlPipe } from './sanitazion.pipe';
import { CommonModule } from '@angular/common';
import { RiskLevelPipe } from './risk-level.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [SanitizeHtmlPipe, RiskLevelPipe, CommonModule],
  declarations: [SanitizeHtmlPipe, RiskLevelPipe],
  providers: [],
})
export class ApplicationPipesModule { }
