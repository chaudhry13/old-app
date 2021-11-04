import { QuestionTypes } from "./questionnaire";

export class LogicBlock {
  id: string;
  logicString: string;
}

export class QuestionLogicBlock {
  id: string;
  questionId: string;
  type: QuestionLogicTypes;
  logicString: string;
  issueId: string;
}

// Logic interface
export interface ILogicExpression {
}

export class LogicOr implements ILogicExpression{
  left: ILogicExpression;
  right: ILogicExpression;
}

export class LogicAnd implements ILogicExpression{
  left: ILogicExpression;
  right: ILogicExpression;
}

export class LogicNegate implements ILogicExpression{
  child: ILogicExpression;
}

// Questionnaire logic expression (Can meight be deleted. TODO: check if it can be deleted)
export class QuestionTextLogic implements ILogicExpression {
  questionBasedOnId: string;
  operator: TextOperators;
  textAnswer: string;
}

export class QuestionNumberLogic implements ILogicExpression {
  questionBasedOnId: string;
  operator: NumberOperators;
  numberAnswer: number;
}

export class QuestionRadioButtonLogic implements ILogicExpression {
  questionBasedOnId: string;
  operator: CheckboxOperators;
  optionIds: string[];
}

export class QuestionCheckboxLogic implements ILogicExpression {
  questionBasedOnId: string;
  operator: CheckboxOperators;
  optionIds: string[];
}

export class QuestionIntermedietLogic {
  id: string;
  questionId: string;
  basedOn: string;
  basedOnType: QuestionTypes;
  operator;
  textAnswer: string;
  numberAnswer: number;
  questionOptions: string[];
  andOr: CheckboxOperators;
  basedOnTitle: string;
  type: QuestionLogicTypes;
  issueId: string;
}

export enum TextOperators {
  StartsWith,
  DoesNotStartWith,

  EndsWith,
  DoesNotEndWith,

  Contains,
  DoesNotContain,

  Equals,
  DoesNotEqual
}

export enum NumberOperators
{
  IsAbove,
  IsNotAbove,

  IsBelow,
  IsNotBelow,

  Equals,
  DoesNotEqual
}

export enum CheckboxOperators
{
  Or,
  And
}

export enum QuestionLogicTypes
{
    ShowQuestion,
    RaiseIssue
}
