import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Contato} from './contato/contato';
import {PaginaContato} from './contato/pagina-contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  private url: string = environment.apiBaseUrl + '/api/contatos';

  constructor(
    private http: HttpClient
  ) {
  }

  public save(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.url, contato);
  }

  public list(page, size): Observable<PaginaContato> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.url}?${params.toString()}`);
  }

  public favourite(contato: Contato): Observable<any> {
    // o patch faz uma alteração parcial
    // informa null, pois nãõ quer mudar o objeto inteiro
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }

  public upload(contato: Contato, formData: FormData): Observable<any> {
    return this.http.put(`${this.url}/${contato.id}/foto`, formData, { responseType: 'blob' });
  }
}
