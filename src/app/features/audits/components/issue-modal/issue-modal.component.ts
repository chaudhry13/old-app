import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Comment } from "@app/models/comment";
import { AlertController, ModalController } from "@ionic/angular";
import { CommentService } from "@app/services/comment.service";
import { IssueService } from "@app/services/issue.service";
import { IssueCategory, IssueSeverityLevel } from "../../models/issue";
import {
  Question,
  QuestionAnsweres,
  QuestionnaireUserAnswer,
} from "../../models/questionnaire";
import { CommentModalComponent } from "../comment-modal/comment-modal.component";

@Component({
  selector: "app-issue-modal",
  templateUrl: "./issue-modal.component.html",
  styleUrls: ["./issue-modal.component.scss"],
})
export class IssueModalComponent implements OnInit {
  @Input() questionAnswer: QuestionAnsweres;
  @Input() id: string;
  @Input() question: Question;
  @Input() questionnaireUserAnswer: QuestionnaireUserAnswer;
  @Input() answerForm: FormGroup;
  @Input() hasComment: boolean = false;
  commentData: Comment[];
  showComment = false;
  @Input() isInRole: string;
  @Input() issueId: string;

  issueTitle: string;
  issueCategory: IssueCategory;
  issueSeverityLevel: IssueSeverityLevel;
  issueDetails: string;

  showData: boolean = false;

  constructor(
    public modalController: ModalController,
    private commentService: CommentService,
    public alertController: AlertController,
    private issueService: IssueService
  ) {}

  ngOnInit() {
    this.getCommentById();
    this.setDataToIssueField();
  }

  onClose() {
    this.modalController.dismiss({
      data: "data is here",
    });
  }

  getCommentById() {
    this.commentService.list(this.issueId, 7).then((val) => {
      console.log("Comment Toggle");
      console.log(val);
      console.log(this.questionAnswer.id);
      this.commentData = val;
    });
  }

  setDataToIssueField() {
    this.issueService
      .get(this.issueId)
      .then((val) => {
        this.issueTitle = val.title;
        this.issueCategory = IssueCategory[val.category.toString()];
        this.issueDetails = val.details;
        this.issueSeverityLevel =
          IssueSeverityLevel[val.severityLevel.toString()];
      })
      .finally(() => {
        this.showData = true;
      });
  }

  toggleComment() {
    this.showComment = !this.showComment;
    this.getCommentById();
  }

  async onReplayComment(id) {
    const modal = this.modalController.create({
      component: CommentModalComponent,
    });
    (await modal).onDidDismiss().then((data) => {
      console.log(data.data);
      this.commentService
        .insertComment({
          riskAssessmentId: null,
          incidentReportId: null,
          commentId: id,
          activityLogId: null,
          activityId: null,
          auditId: null,
          questionAnswerId: this.questionAnswer.id,
          text: data.data.comment,
        })
        .then((val) => {
          console.log(val);
          this.getCommentById();
        });
    });
    return (await modal).present();
  }
  async onDeleteComment(id) {
    const alert = this.alertController.create({
      header: "Delete",
      message: "Are you sure you want to delete the comment?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Delete",
          handler: async () => {
            await this.commentService.delete(id).then((val) => {
              console.log(val);
            });
            this.getCommentById();
          },
        },
      ],
    });
    return await (await alert).present();
  }

  async onDeleteChildComment(id) {
    const alert = this.alertController.create({
      header: "Delete",
      message: "Are you sure you want to delete the comment?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "Delete",
          handler: async () => {
            await this.commentService.delete(id).then((val) => {
              console.log(val);
            });
            this.getCommentById();
          },
        },
      ],
    });
    return await (await alert).present();
  }

  async onCreateComment() {
    // this.showCreateComment = !this.showCreateComment;
    const modal = this.modalController.create({
      component: CommentModalComponent,
    });
    (await modal).onDidDismiss().then((data) => {
      console.log(data.data);
      this.commentService
        .insertComment({
          riskAssessmentId: null,
          incidentReportId: null,
          commentId: null,
          activityLogId: null,
          activityId: null,
          auditId: null,
          questionAnswerId: null,
          text: data.data.comment,
          issueId: this.issueId,
        })
        .then((val) => {
          console.log(val);
          this.getCommentById();
        });
    });
    return (await modal).present();
  }
}
