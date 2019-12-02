import { TestBed, inject } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { ToastController } from '@ionic/angular';

describe('ToastService', () => {
    let toastController: ToastController;
    let service: ToastService;
    let message: string;

   beforeEach(() => {
        message = "This is the test toast message"
        service = new ToastService(toastController);
        toastController = new ToastController(null);
        TestBed.configureTestingModule({
            providers: [
                ToastService,
              { provide: ToastController, useValue: toastController }
            ]
          });
   });

   it('does some test where it is injected',
    inject([ToastService], (service: ToastService) => {
      expect(service).toBeTruthy();
    })
  );
});