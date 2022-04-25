import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigService } from "@app/services/app-config.service";
import { GenericService } from "@app/services/generic.service";
import { Question, QuestionnaireUserAnswer } from "../models/questionnaire";

@Injectable()
export class LogicService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/logic", appConfigService);
  }

  async WhichToSkip(
    questions: Question[],
    something: QuestionnaireUserAnswer
  ): Promise<string[]> {
    var questionAnswers = something.questionAnsweres.map((qa) => {
      if (qa.locationAnswer && qa.locationAnswer.country)
        qa.locationAnswer.countryId = qa.locationAnswer.country.id;
      return {
        id: qa.id,
        answered: qa.answered,
        questionId: qa.questionId,
        text: qa.text,
        slider: qa.slider,
        numberAnswer: qa.numberAnswer,
        hasComment: qa.hasComment,
        na: qa.na,
        userAnswerId: qa.userAnswerId,
        locationAnswer: qa.locationAnswer,
        optionAnswers: qa.optionAnswered.map((oa) => {
          return {
            id: oa.id,
            questionAnsweredId: oa.questionAnsweredId,
            questionOptionId: oa.questionOptionId,
            selected: oa.selected,
          };
        }),
      };
    });
    var answer = {
      questionAnsweres: questionAnswers,
    };
    var questionLogics = questions.map((q) => {
      return {
        id: q.id,
        logics: q.logics.map((l) => {
          return { type: l.type, logicString: l.logicString };
        }),
      };
    });
    return this.http
      .post<string[]>(this.apiBase + "/WhichToSkip", {
        questions: questionLogics,
        answer: answer,
      })
      .toPromise();
  }
}
