import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './auth-config.service';
import { QuestionnaireList, QuestionnaireDetails, QuestionnaireCopy, QuestionnaireUserAnswer, QuestionnaireUserAnswerList, QuestionnaireUserAnswerCreate } from '../_models/questionaire';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionaireService extends GenericService {

  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/questionnaire", appConfigService);
  }

  async list(): Promise<QuestionnaireList[]> {
    return this.http.post<QuestionnaireList[]>(this.apiBase + "/list", null).toPromise();
  }

  async insert(questionnaire: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, questionnaire).toPromise();
  }

  async get(id: string): Promise<QuestionnaireDetails> {
    return this.http.get<QuestionnaireDetails>(this.apiBase + "/" + id).toPromise();
  }

  async copy(questionnaireCopy: QuestionnaireCopy): Promise<string> {
    return this.http.post<string>(this.apiBase + "/copy", questionnaireCopy).toPromise();
  }

  async delete(id: string): Promise<any> {
    return this.http.delete<string>(this.apiBase + "/" + id).toPromise();
  }

  async editSimple(id: string, title: string, description: string): Promise<any> {
    var form = {
      id: id,
      title: title,
      description: description,
    }

    return this.http.put<string>(this.apiBase + "/UpdateSimple", form).toPromise();
  }
}

@Injectable()
export class QuestionnaireUserAnswerService extends GenericService {
  constructor(private http: HttpClient, public appConfigService: AppConfigService) {
    super("/questionnaire-user-answer", appConfigService);
  }

  async get(id: string): Promise<QuestionnaireUserAnswer> {
    return this.http.get<QuestionnaireUserAnswer>(this.apiBase + "/" + id).toPromise();
  }

  async finishAnswer(Id: string): Promise<string> {
    var model = {
      Id: Id,
    }
    return this.http.put<string>(this.apiBase, model).toPromise();
  }

  async CanFinish(id: string): Promise<boolean> {
    return this.http.get<boolean>(this.apiBase + "/CanFinish/" + id).toPromise();
  }

  list(): Observable<QuestionnaireUserAnswerList[]> {
    return this.http.post<QuestionnaireUserAnswerList[]>(this.apiBase + "/list", null);
  }

  async insert(form: QuestionnaireUserAnswerCreate): Promise<string> {
    return this.http.post<string>(this.apiBase, form).toPromise();
  }
}