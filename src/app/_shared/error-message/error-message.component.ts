import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'error-msg',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {
  @Input() errorMsg: string;
  @Input() displayError: boolean;

  constructor() { }

}
