import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit } from "@angular/core";
import { IonicModule, ModalController } from "@ionic/angular";

@Component({
  selector: "app-comment-modal",
  templateUrl: "./comment-modal.component.html",
  styleUrls: ["./comment-modal.component.scss"],
})
export class CommentModalComponent implements OnInit {
  comment: string;
  showCreateButton: boolean = true;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  onChange(text) {
    if (text.length > 0) {
      this.showCreateButton = false;
    } else {
      this.showCreateButton = true;
    }
  }

  onClose() {
    this.modalController.dismiss();
  }
  onCreate() {
    this.modalController.dismiss({
      comment: this.comment,
    });
  }
}
