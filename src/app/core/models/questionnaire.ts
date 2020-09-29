import { UserList } from "./user";
import { Division } from "./division";
import { Audit } from "./audit";
import { Country } from "./country";

export class QuestionnaireDetails {
  id: string;
  author: UserList;
  title: string;
  latitude: number;
  longitude: number;
  questionnaireType: QuestionnaireType;
  questionnaireStatus: QuestionnaireStatus;
  description: string;
  created: Date;
  Updated: Date;
  divisions: Array<Division>;
  questionGroups: Array<QuestionGroupDetails>;
  questions: Array<Question>;
}

export class QuestionnaireStatistics extends QuestionnaireDetails {
  questionnaireSentOuts: Array<QuestionnaireSentOutDetails>;
  score: Number;
}

export class QuestionGroupDetails {
  id: string;
  groupTitle: string;
  weight: number;
  index: number;
  created: Date;
  updated: Date;
  questionnaireId: string;
  archived: boolean;
  questions: Array<Question>;
}

export class QuestionGroupEdit {
  id: string;
  groupTitle: string;
  weight: number;
  index: number;
}

export class QuestionGroupCreate {
  questionnaireId: string;
  groupTitle: string;
  weight: number;
  index: number;
}

export class Question {
  id: string;
  title: string;
  index: number;
  weight: number;
  archived: boolean;
  required: boolean;
  questionGroupId: string;
  questionnaireId: string;
  type: QuestionTypes;

  sliderOptions: QuestionSliderOptions;
  textOptions: QuestionTextOptions;
  numberOptions: QuestionNumberOptions;

  possibleAnswers: Array<QuestionOption>;
  answeres: Array<QuestionAnsweredEdit>;
}

export class QuestionCreate {
  id: string;
  title: string;
  index: number;
  weight: number;
  archived: boolean;
  required: boolean;
  questionGroupId: string;
  questionnaireId: string;
  type: QuestionTypes;
  sliderFrom: number;
  sliderTo: number;
  sliderStep: number;
  sliderLabelMin: string;
  sliderLabelMax: string;
  PossibleAnswers: Array<QuestionOption>;
}

export class QuestionEdit {
  title: string;
  index: number;
  weight: number;
  archived: boolean;
  required: boolean;
  questionGroupId: string;
  questionnaireId: string;
  type: QuestionTypes;
  sliderOptions: QuestionSliderOptions;
  textOptions: QuestionTextOptions;
  numberOptions: QuestionNumberOptions;
}

export class QuestionOption {
  id: string;
  text: string;
  weight: number;
  colorHexValue: string;
  index: number;
  answers: Array<QuestionOptionAnswered>;
}

export class QuestionnaireList {
  id: string;
  author: UserList;
  title: string;
  latitude: number;
  longitude: number;
  questionnaireType: QuestionnaireType;
  questionnaireStatus: QuestionnaireStatus;
  description: string;
  divisions: Array<Division>;
  created: Date;
  Updated: Date;
}

export class QuestionnaireCreate {
  title: string;
  latitude: number;
  longitude: number;
  questionnaireType: QuestionnaireType;
  questionnaireStatus: QuestionnaireStatus;
  divisions: Array<string>;
  description: string;
}

export class QuestionnaireCopy extends QuestionnaireCreate {
  copyId: string;
}

export class QuestionAnsweredCreate {
  questionId: string;
  userAnswerId: string;
  text: string;
  slider: number;
  numberAnswer: number;
  comment: string;
  na: boolean;
  optionAnswered: Array<optionAnswerFromQuestionAnswer>;
  answered: boolean;
  locationAnswer: QuestionLocationAnswer;
}

export class QuestionAnsweredEdit extends QuestionAnsweredCreate {
  id: string;
}

export class QuestionnaireSentOut {
  id: string;
  paused: boolean;
  deadline: Date;
  created: Date;
  updated: Date;
  questionnaireSentOutType: QuestionnaireSentType;
  score: number;
  numberOfPeopleAnswered: number;
  numberOfPeopleSentTo: number;
  questionnaireId: string;
  questionnaire: QuestionnaireList;
}

export class QuestionnaireSentOutDetails {
  id: string;
  paused: boolean;
  deadline: Date;
  created: Date;
  updated: Date;
  questionnaireSentOutType: QuestionnaireSentType;
  score: number;
  numberOfPeopleAnswered: number;
  numberOfPeopleSentTo: number;
  questionnaireId: string;
  questionnaire: QuestionnaireDetails;
  auditTitle: string;
  answers: Array<QuestionnaireUserAnswer>;
}

export class QuestionnaireSentOutCreate {
  questionnaireId: string;
  paused: boolean;
  deadline: Date;
  questionnaireType: QuestionnaireSentType;
  usersSentTo: Array<UsersSentTo>;
}

export class UsersSentTo {
  questionnaireId: string;
  userId: string;
}

export class QuestionAndGroups {
  index: number;
  type: string;
  reference: any;
}

export class QuestionTextOptions {
  id: string;
  questionId: string;
  regex: string;
  type: QuestionTextType;
}

export class QuestionNumberOptions {
  id: string;
  questionId: string;
  from: number;
  to: number;
}

export class QuestionSliderOptions {
  id: string;
  questionId: string;
  sliderFrom: number;
  sliderTo: number;
  sliderStep: number;
  sliderLabelMin: string;
  sliderLabelMax: string;
}

export class QuestionnaireUserAnswerList {
  id: string;
  questionnaireId: string;
  questionnaireSentOutId: string;
  title: string;
  status: QuestionAnsweredStatus;
  created: Date;
  finalScore: number;
  questionsAnswered: number;
  numberOfQuestions: number;
}

export class QuestionnaireUserAnswer {
  id: string;
  created: Date;
  updated: Date;
  status: QuestionAnsweredStatus;
  userId: string;
  user: UserList;
  score: number;
  questionnaireSentOutId: string;
  questionnaireSentOut: QuestionnaireSentOutDetails;
  questionAnsweres: Array<QuestionAnsweres>;
  audit: Audit;
  auditId: string;
}

export class QuestionnaireUserAnswerCreate {
  UserId: string;
  QuestionnaireId: string;
  QuestionnaireSentOutId: string;
}

export class QuestionAnsweres {
  id: string;
  answered: boolean;
  questionId: string;
  text: string;
  slider: number;
  numberAnswer: number;
  comment: string;
  na: boolean;
  question: Question;
  userAnswerId: string;
  locationAnswer: QuestionLocationAnswer;
  userAnswer: QuestionnaireUserAnswer;
  optionAnswered: Array<QuestionOptionAnswered>;
}

export class QuestionLocationAnswer {
  id: string;
  questionAnswerId: string;
  address: string;
  city: string;
  country: Country;
  latitude?: number | null;
  longitude?: number | null;
}

export class QuestionLocationAnswerCreate {
  address: string;
  countryId: number;
  latitude?: number | null;
  longitude?: number | null;
}

export class QuestionnaireSentoutToAuditCreate {
  questionnaireIds: Array<string>;
  controlId: string;
}

export class optionAnswerFromQuestionAnswer {
  selected: boolean;
  questionOptionId: string;
}

export class QuestionOptionAnsweredCreate extends optionAnswerFromQuestionAnswer {
  questionAnsweredId: string;
}

export class QuestionOptionAnswered extends QuestionOptionAnsweredCreate {
  id: string;
}

export enum QuestionTextType {
  "Free Text",
  "Custom Regex",
  "Email",
  "Phone Number",
}

export enum QuestionnaireSentType {
  Normal,
  Anonymous,
  Audit,
}

export enum QuestionAnsweredStatus {
  Draft,
  Completed,
}

export enum QuestionTypes {
  "Slider",
  "Text",
  "Checkbox",
  "Radio Button",
  "Number",
  "Location",
}

export enum QuestionnaireStatus {
  "Draft",
  "Broadcasted",
  "Archived Draft",
  "Archived Published",
  "HumanRisks Template",
}

export enum QuestionnaireStatusSeachable {
  "Draft",
  "Published",
}

export enum QuestionnaireType {
  "Default",
  "Audit",
  "Site Review",
}

export enum QuestionOptionStandard {
  "Custom",
  "Yes, No",
  "Yes, Maybe, No",
}
