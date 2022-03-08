import { Division } from "@app/models/division";
import { UserList } from "@app/models/user";
import { Country } from "@shared/models/country";
import { Audit } from "./audit";
import { QuestionIntermedietLogic, QuestionLogicBlock } from "./logic";

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
	scoreColor: Array<QuestionnaireScoreColorEdit>;
  avgScore: Number;
}

export class QuestionnaireGetFilter {
	id: string;
	archivedQuestions: boolean;
	riskAssessmentId: string;
}

export class QuestionnaireEditSimple {
	id: string;
	title: string;
	description: string;
	scoreColor: QuestionnaireScoreColorCreate[];
	divisions: string[];
}

export class QuestionnaireStatistics extends QuestionnaireDetails {
	questionnaireSentOuts: Array<QuestionnaireSentOutDetails>;
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
	archived: boolean;
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
  optionOptions: QuestionOptionOptions;

	possibleAnswers: Array<QuestionOption>;
	answeres: Array<QuestionAnsweredEdit>;

  logics: QuestionLogicBlock[];
  intermedietLogics: QuestionIntermedietLogic[];
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
  optionOptions: QuestionOptionOptions;
}

export class QuestionOption {
	id: string;
	text: string;
	weight: number;
	colorHexValue: string;
	index: number;
	answers: Array<QuestionOptionAnswered>;
  	requireComment: boolean;
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
	scoreColor: Array<QuestionnaireScoreColorEdit>;
}

export class questionnaireListFilter {
	divisionIds: Array<string>;
	status: QuestionnaireStatus;
	type: QuestionnaireType;
	searchAuthorTitle: string;
	archived: boolean;
	templates: boolean;
}

export class QuestionnaireCreate {
	title: string;
	latitude: number;
	longitude: number;
	questionnaireType: QuestionnaireType;
	questionnaireStatus: QuestionnaireStatus;
	divisions: Array<string>;
	description: string;
	scoreColor: Array<QuestionnaireScoreColorCreate>;
}

export class QuestionnaireCopy extends QuestionnaireCreate {
	copyId: string;
}

export class QuestionAnsweredCreate {
	questionId: string;
	userAnswerId: string;
	userAnswer: QuestionnaireUserAnswer;
	text: string;
	slider: number;
	numberAnswer: number;
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
	title: string;
	paused: boolean;
	deadline: Date;
	created: Date;
	updated: Date;
	questionnaireSentOutType: QuestionnaireSentType;
	avgScore: number;
	numberOfPeopleAnswered: number;
	numberOfPeopleSentTo: number;
	questionnaireId: string;
	questionnaire: QuestionnaireList;
}

export class QuestionnaireSentOutDetails {
	id: string;
	title: string;
	paused: boolean;
	deadline: Date;
	created: Date;
	updated: Date;
	questionnaireSentOutType: QuestionnaireSentType;
	avgScore: number;
	numberOfPeopleAnswered: number;
	numberOfPeopleSentTo: number;
	questionnaireId: string;
	questionnaire: QuestionnaireDetails;
	auditTitle: string;
	answers: Array<QuestionnaireUserAnswer>;
}

export class QuestionnaireSentOutCreate {
	questionnaireId: string;
	title: string;
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
};

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

export class QuestionOptionOptions {
  id: string;
  questionId: string;
  pointType: OptionPointTypes;
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
	email: string;
}

export class QuestionnaireUserAnswer {
	id: string;
	created: Date;
	updated: Date
	status: QuestionAnsweredStatus;
	userId: string;
	user: UserList;
	avgScore: number;
	questionnaireSentOutId: string;
	questionnaireSentOut: QuestionnaireSentOutDetails;
	questionAnsweres: Array<QuestionAnsweres>;
	audit: Audit;
	auditId: string;
  auditNumber: string;
	email: string;
  previousId: string;
}

export class QuestionnaireUserAnswerCreate {
	UserId: string;
	QuestionnaireId: string;
	QuestionnaireSentOutId: string;
	Email: string;
}

export class QuestionnaireUserAnswerCreateFull {
	userId: string;
	questionnaireId: string;
	questionnaireSentoutId: string;
	auditId: string;
	status: QuestionAnsweredStatus;
	questionAnsweres: Array<QuestionAnsweredCreate>;
}

export class QuestionnaireScoreColorCreate {
	number: number;
	questionnaireId: string;
	hexColor: string;
	label: string;
	siteCategoryId?: string;
}

export class QuestionnaireScoreColorEdit extends QuestionnaireScoreColorCreate {
	id: string;
}

export class QuestionAnsweres {
	id: string;
	answered: boolean;
	questionId: string;
	text: string;
	slider: number;
	numberAnswer: number;
	hasComment: boolean;
	na: boolean;
	question: Question;
	filesUploaded: number;
	userAnswer: QuestionnaireUserAnswer;
	userAnswerId: string;
	locationAnswer: QuestionLocationAnswer;
	optionAnswered: Array<QuestionOptionAnswered>;
  issueId: string;
  isIssue: boolean;
}

export class QuestionLocationAnswerCreate {
  address: string;
  countryId: number;
  latitude?: number | null;
  longitude?: number | null;
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
	"On Request",
	RiskAssessment,
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
	"Location"
}

export enum OptionPointTypes {
  "Accumulated",
  "Max",
}

export namespace OptionPointTypes {
  export function GetDescription(type:OptionPointTypes): string {
    switch(type) {
      case OptionPointTypes.Accumulated:
        return "Accumulate all points for the selected options";
      case OptionPointTypes.Max:
        return "This quesiton will provide points for only the higest selected value";
      default:
        return "";
    }
  }
}

export enum QuestionnaireStatus {
	"Draft",
	"Broadcasted",
	"Archived Draft",
	"Archived Brodcasted"
}

export enum QuestionnaireStatusSeachable {
	"Draft",
	"Published",
}

export enum QuestionnaireType {
	"Default",
	"Unused",
	"Site Category",
  "HumanRisks Template",
  "Treatment Priority"
}

export enum QuestionOptionStandard {
	"Custom",
	"Yes, No",
	"Yes, Maybe, No"
}


