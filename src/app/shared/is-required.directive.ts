import {Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[appIsRequired]'
})
export class IsRequiredDirective {

  constructor(public element: ElementRef, public renderer: Renderer2) { }

  @Input() set appIsRequired(condition: boolean){
    if(condition){
      console.log(this.element.nativeElement)
      this.element.nativeElement.insertAdjacentHTML('afterend', '<i class="required">*</i>')
    }
  }

}
