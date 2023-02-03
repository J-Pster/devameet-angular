# Criando a página pai de edição

Ufaaa, criamos todos os 3 componentes que precisamos, agora vamos criar a página pai de edição, que será responsável por renderizar os 3 componentes que criamos.

Vá até `src/app/pages/meet/pages/meets`, clique com o botão direito e crie um módulo com nome de `edit-meet` e selecione o tipo `Lazy-loaded module of pages`.

## **Modificando o Módulo**

Vá até o arquivo `src/app/pages/meet/pages/meets/edit-meet/edit-meet.module.ts`.

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EditMeetRoutingModule } from "./edit-meet-routing.module";
import { EditMeetComponent } from "./edit-meet.component";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedPagesModule } from "src/app/shared/pages/shared-pages.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MeetComponentsModule } from "../../../components/meet-components.module";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";

@NgModule({
  declarations: [EditMeetComponent],
  imports: [
    CommonModule,
    EditMeetRoutingModule,
    SharedComponentsModule,
    SharedDecoratorsModule,
    MeetComponentsModule,
    MatSnackBarModule,
    SharedPagesModule,
  ],
})
export class EditMeetModule {}
```

Aqui, importamos o `SharedComponentsModule`, `SharedPagesModule`, `MatSnackBarModule`, `MeetComponentsModule` e o `SharedDecoratorsModule`.

## **Modificando o TS**

Vá até o arquivo `src/app/pages/meet/pages/meets/edit-meet/edit-meet.module.ts`.

Vamos explicar passo a passo, assim como explicamos o `canvas`.

## Importando e criando o componente

```typescript
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetService } from "src/app/services/meet/meet.service";

import { objects } from "src/assets/images/objects/objects";

@Component({
  selector: "app-edit-meet",
  templateUrl: "./edit-meet.component.html",
  styleUrls: ["./edit-meet.component.scss"],
})
export class EditMeetComponent implements OnInit {}
```

A primeira coisa é importar algumas coisas que vamos usar, como o `FormBuilder`, `FormGroup`, `Validators`, `ActivatedRoute`, `Router`, `MeetService` e o `MatSnackBar`, depois, criamos a classe `EditMeetComponent` que vai ser responsável por renderizar o componente mas implementamos a interface `OnInit` que é responsável por executar uma função quando o componente é inicializado.

## Criando as variáveis

```typescript
form: FormGroup;
selectedColor: string = "#8250C4";

objects: any = objects;
objectsFromMeet: any = [];
id: string = "";
error: string = "";
meet: any = {};
index: number = 1;

selected: any = {};
```

Para controlar toda essa edição, precisamos criar várias variáveis, elas servem para o seguinte:

- `form`: é o formulário que vai ser responsável por controlar o nome da sala;
- `selectedColor`: é a cor da sala;
- `objects`: são os objetos disponíveis e vem lá de `src/assets/images/objects/objects.ts`;
- `objectsFromMeet`: são os objetos que estão no canvas, podemos adicionar ou remover, ou editar.
- `id`: é o id da sala;
- `error`: um local para armazenar o erro;
- `meet`: é o objeto da sala, contem coisas como id, nome, cor e vem da API.
- `index`: é o index do objeto que está sendo editado.
- `selected`: é o objeto que está sendo editado.

## Criando o constructor

```typescript
  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
```

Aqui, criamos o constructor, que é responsável por injetar as dependências (também chamado de instanciar services) que vamos usar, como o `ActivatedRoute`, `Router`, `FormBuilder`, `MatSnackBar` e o `MeetService`, além disso ela é responsável por criar o formulário.

## Função de incicialização

```typescript
  ngOnInit(): void {
    this.loadMeeting();
  }
```

Aqui, criamos a função `ngOnInit`, que é responsável por executar uma função quando o componente é inicializado, nesse caso, ela chama a função `loadMeeting`.

## Função para carregar a sala

```typescript
  async loadMeeting() {
    let meetingId = this.routeActive.snapshot.paramMap.get('id');
    if (!meetingId) {
      this.notLoaded();

      return;
    }

    try {
      const res = await this.meetService.getMeet(meetingId);
      if (!res) {
        this.notLoaded();
        return;
      }

      // Infos Básicas
      this.form.controls['name'].setValue(res.name);
      this.selectedColor = res.color;

      this.meet = res;

      // Objetos
      try {
        const meetObjects = await this.meetService.getMeetObjects(meetingId as string);
        this.objectsFromMeet = meetObjects.map((e: any) => {
          return { ...e, type: e.name.split('_')[0] };
        });
      } catch (error) {
        this.notLoaded();
      }
    } catch (error) {
      this.notLoaded();
    }
  }
```

A função "loadMeeting" carrega uma reunião específica a partir de um identificador de reunião passado como parâmetro na rota ativa. Se o identificador não estiver presente, a função chama "notLoaded".

A função usa o serviço "meetService" para obter a reunião através do identificador da reunião. Se a chamada for bem-sucedida e a reunião for encontrada, a função atribui o nome da reunião ao controle "name" do formulário e salva a cor selecionada. Além disso, a função usa o serviço "meetService" novamente para obter os objetos da reunião e salva-os na propriedade "objectsFromMeet". Se a chamada falhar, a função chama "notLoaded".

## Função auxiliar para caso não carregue

```typescript
  notLoaded(): void {
    this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
    });

    setTimeout(() => {
      this.route.navigateByUrl('/');
    }, 2000);
  }
```

Essa função é responsável por mostrar uma mensagem de erro caso não consiga carregar a sala, ela mostra uma mensagem e depois redireciona para a página inicial.

## Função auxiliar que encontra o objeto na lista de objetos e o remove

```typescript
  changeObjectPosition(obj: any) {
    const index = this.objectsFromMeet.findIndex(
      (item: any) => item._id === obj._id
    );

    this.objectsFromMeet.splice(index, 1, obj);
  }
```

Essa função será usada pela função `moveObject`, o que ela faz é encontrar o objeto selecionado na lista de objetos e remove-lo.

## Selecionando o objeto.

```typescript
  setSelected(obj: any) {
    this.selected = Object.assign({}, obj);
  }
```

O que essa função faz é criar um novo objeto e colocar nele o objeto selecionado, a gente faz isso para ativar o `onChange` do `canvas` e ele entender que o objeto foi alterado, usar `=` não funciona, pois `Object` é um tipo de dado complexo, e ele não escuta alterações dentro do objeto.

## Adicionando um objeto

```typescript
  setObject(obj: any) {
    obj._id = this.index++;
    let found = false;

    // Só vai procurar se o objeto não pode ser selecionado várias vezes, ou seja, ele só realmente procura o objeto na lista de objectsFromMeet se for uma parede ou chão, e ai ele vai procurar e substituir
    if (!obj.selectMultiple) {
      for (let i = 0; i < this.objectsFromMeet.length; i++) {
        if (this.objectsFromMeet[i].type === obj.type) {
          this.objectsFromMeet[i] = obj;
          found = true;
          break;
        }
      }
    }

    // Se não encontrou, adiciona o objeto, se for um objeto que pode ser adicionado vários, como foud começa como false, ele vem direto pra cá e adiciona
    if (!found) {
      this.objectsFromMeet.push(obj);
    }

    // Define o objeto adicionado ao canvas como o objeto selecionado
    this.setSelected(obj);
  }
```

Essa função é usada pelo componente `meet-object-picker`, e ela funciona assim:

1. Ela adiciona um `_id` no objeto, para que ele seja único;
2. Ela verifica se o objeto pode ser selecionado várias vezes, se não, ela verifica se o objeto já existe na lista de objetos, se existir, ela substitui o objeto, se não, ela adiciona o objeto na lista de objetos.

## Removendo um objeto

```typescript
  removeObject(obj: any) {
    if (!obj || !obj._id) return;

    const filtered = this.objectsFromMeet.filter((o: any) => o._id !== obj._id);
    this.objectsFromMeet = filtered;
    this.setSelected({});
  }
```

Essa função é usada pelo `canvas`, ela funciona assim:

1. Ela verifica se o objeto existe e se ele tem um `_id`, se não, ela retorna;
2. Ela filtra a lista de objetos, e remove o objeto que tem o mesmo `_id` do objeto selecionado, depois seta a lista de objetos para a lista filtrada;
3. Ela define o objeto selecionado como um objeto vazio.

## Rotacionando um objeto

```typescript
  rotateObject(obj: any) {
    const { selected, to } = obj;

    if (selected?._id) {
      const orientationMap: any = {
        front: to === 'left' ? 'right' : 'left',
        right: to === 'left' ? 'back' : 'front',
        back: to === 'left' ? 'left' : 'right',
        left: to === 'left' ? 'front' : 'back',
      };

      selected.orientation =
        orientationMap[selected.orientation] || selected.orientation;

      this.setSelected(selected);
      this.changeObjectPosition(selected);
    }
  }
```

A função `rotateObject` recebe um objeto `obj` como argumento. Este objeto tem duas propriedades, `selected` e `to`.

A propriedade `selected` representa o objeto selecionado do array objectsFromMeet. Se `selected._id` existe, significa que um objeto foi selecionado e pode ser rotacionado.

A propriedade `to` determina a direção da rotação. Se for "left", o objeto será rotacionado para a esquerda. Se for "right", o objeto será rotacionado para a direita.

A função verifica a orientação atual do objeto selecionado e atribui uma nova orientação baseada na direção da rotação desejada. Depois disso, a função atualiza a posição do objeto no array `objectsFromMeet` usando a função `changeObjectPosition` e atualiza o objeto selecionado usando a função `setSelected`.

## Movendo um objeto

```typescript
  moveObject(obj: any) {
    const { selected, to } = obj;

    if (!selected?._id || selected.flexStart) {
      return;
    }

    let x = selected.x;
    let y = selected.y;

    switch (to) {
      case 'up':
        y = y > 0 ? y - 1 : 0;
        break;
      case 'left':
        x = x > 0 ? x - 1 : 0;
        break;
      case 'down':
        y = y < 6 ? y + 1 : 6;
        break;
      case 'right':
        x = x < 6 ? x + 1 : 6;
        break;
      default:
        break;
    }

    selected.x = x;
    selected.y = y;
    this.changeObjectPosition(selected);
  }
```

A função `moveObject` é responsável por mover um objeto. Recebe como argumento `obj`, que é um objeto que contém duas propriedades: `selected` e `to`. A propriedade selected representa o objeto a ser movido e a propriedade `to` representa a direção para onde o objeto deve ser movido, podendo ser "up" (para cima), "left" (para a esquerda), "down" (para baixo) ou "right" (para a direita).

Antes de mover o objeto, a função verifica se o objeto `selected` existe e se sua propriedade `flexStart` é falsa. Se não existir ou a propriedade for verdadeira, a função não fará nada e retornará. Caso contrário, a função continuará a sua execução.

A função usa um switch statement para determinar a nova posição `x` e `y` do objeto, de acordo com a direção `to` fornecida. A nova posição é calculada com base nas regras fornecidas para cada direção (por exemplo, se a direção é "up", a nova posição `y` é decrementada em 1, desde que ainda esteja acima de 0).

Por fim, a função atualiza a posição `x` e `y` do objeto e chama a função `changeObjectPosition` para atualizar a posição do objeto na lista `this.objectsFromMeet`.

## Funções do formulário

```typescript
  changeColor(color: string) {
    this.selectedColor = color;
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  onCancel() {
    this.route.navigateByUrl('/');
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const formValues = this.form.value;
    const body = {
      name: formValues.name,
      color: this.selectedColor,
      objects: this.objectsFromMeet,
    };

    this.meetService
      .updateMeet(this.meet._id, body)
      .then((res) => {
        this._snackBar.open('Reunião atualizada com sucesso!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.route.navigateByUrl('/');
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao atualizar reunião!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
  }
```

Aqui temos 4 funções, super simples e bem parecidas com outras que você já fez em `login` e `register`, lembra?

## Então, é assim que vai ficar no fim:

```typescript
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetService } from "src/app/services/meet/meet.service";

import { objects } from "src/assets/images/objects/objects";

@Component({
  selector: "app-edit-meet",
  templateUrl: "./edit-meet.component.html",
  styleUrls: ["./edit-meet.component.scss"],
})
export class EditMeetComponent implements OnInit {
  form: FormGroup;
  selectedColor: string = "#8250C4";

  objects: any = objects;
  objectsFromMeet: any = [];
  id: string = "";
  error: string = "";
  meet: any = {};
  index: number = 1;

  selected: any = {};

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  // Auxiliars

  changeObjectPosition(obj: any) {
    const index = this.objectsFromMeet.findIndex(
      (item: any) => item._id === obj._id
    );

    this.objectsFromMeet.splice(index, 1, obj);
  }

  setSelected(obj: any) {
    this.selected = Object.assign({}, obj);
  }

  // Canvas

  setObject(obj: any) {
    obj._id = this.index++;
    let found = false;

    if (!obj.selectMultiple) {
      for (let i = 0; i < this.objectsFromMeet.length; i++) {
        if (this.objectsFromMeet[i].type === obj.type) {
          this.objectsFromMeet[i] = obj;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      this.objectsFromMeet.push(obj);
    }

    this.setSelected(obj);
  }

  removeObject(obj: any) {
    if (!obj || !obj._id) return;

    const filtered = this.objectsFromMeet.filter((o: any) => o._id !== obj._id);
    this.objectsFromMeet = filtered;
    this.setSelected({});
  }

  rotateObject(obj: any) {
    const { selected, to } = obj;

    if (selected?._id) {
      const orientationMap: any = {
        front: to === "left" ? "right" : "left",
        right: to === "left" ? "back" : "front",
        back: to === "left" ? "left" : "right",
        left: to === "left" ? "front" : "back",
      };

      selected.orientation =
        orientationMap[selected.orientation] || selected.orientation;

      this.setSelected(selected);
      this.changeObjectPosition(selected);
    }
  }

  moveObject(obj: any) {
    const { selected, to } = obj;

    if (!selected?._id || selected.flexStart) {
      return;
    }

    let x = selected.x;
    let y = selected.y;

    switch (to) {
      case "up":
        y = y > 0 ? y - 1 : 0;
        break;
      case "left":
        x = x > 0 ? x - 1 : 0;
        break;
      case "down":
        y = y < 6 ? y + 1 : 6;
        break;
      case "right":
        x = x < 6 ? x + 1 : 6;
        break;
      default:
        break;
    }

    selected.x = x;
    selected.y = y;
    this.changeObjectPosition(selected);
  }

  // Others

  ngOnInit(): void {
    this.loadMeeting();
  }

  notLoaded(): void {
    this._snackBar.open("Não foi possível carregar a reunião!", "OK", {
      duration: 2000,
      verticalPosition: "top",
    });

    setTimeout(() => {
      this.route.navigateByUrl("/");
    }, 2000);
  }

  async loadMeeting() {
    let meetingId = this.routeActive.snapshot.paramMap.get("id");
    if (!meetingId) {
      this.notLoaded();

      return;
    }

    try {
      const res = await this.meetService.getMeet(meetingId);
      if (!res) {
        this.notLoaded();
        return;
      }

      // Infos Básicas
      this.form.controls["name"].setValue(res.name);
      this.selectedColor = res.color;

      this.meet = res;

      // Objetos
      try {
        const meetObjects = await this.meetService.getMeetObjects(
          meetingId as string
        );
        this.objectsFromMeet = meetObjects.map((e: any) => {
          return { ...e, type: e.name.split("_")[0] };
        });
      } catch (error) {
        this.notLoaded();
      }
    } catch (error) {
      this.notLoaded();
    }
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  onCancel() {
    this.route.navigateByUrl("/");
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this._snackBar.open("Preencha todos os campos corretamente!", "OK", {
        duration: 2000,
        verticalPosition: "top",
      });
      return;
    }

    const formValues = this.form.value;
    const body = {
      name: formValues.name,
      color: this.selectedColor,
      objects: this.objectsFromMeet,
    };

    this.meetService
      .updateMeet(this.meet._id, body)
      .then((res) => {
        this._snackBar.open("Reunião atualizada com sucesso!", "OK", {
          duration: 2000,
          verticalPosition: "top",
        });

        setTimeout(() => {
          this.route.navigateByUrl("/");
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || "Erro ao atualizar reunião!";
        this._snackBar.open(errorMsg, "OK", {
          duration: 2000,
          verticalPosition: "top",
        });
      });
  }
}
```

Grande, né?
Foi o que ela disse.

![Gif cachorro badass](https://media.giphy.com/media/kiBcwEXegBTACmVOnE/giphy.gif)

## **Modificando o HTML**

Agora que já temos o código do componente, vamos modificar o HTML para que ele fique com a cara que queremos.

```html
<app-dashboard active="edit"> </app-dashboard>
```

A primeira coisa é usar o componente de dashboard que criamos anteriormente. Ele já tem o menu lateral e o cabeçalho, então não precisamos criar novamente.

```html
<section left>
  <app-meet-name-n-color
    title="Editar reunião"
    [nameControl]="getFormRef('name')"
    [selectedColor]="selectedColor"
    (changeColor)="changeColor($event)"
  ></app-meet-name-n-color>
  <div class="objects">
    <app-meet-object-picker
      title="Paredes"
      iconSrc="assets/images/objects/icons/wall.svg"
      [asset]="objects.wall"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Pisos"
      iconSrc="assets/images/objects/icons/floor.svg"
      [asset]="objects.floor"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Tapetes"
      iconSrc="assets/images/objects/icons/rug.svg"
      [asset]="objects.rug"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Mesas"
      iconSrc="assets/images/objects/icons/table.svg"
      [asset]="objects.table"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Cadeiras"
      iconSrc="assets/images/objects/icons/chair.svg"
      [asset]="objects.chair"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Sofas"
      iconSrc="assets/images/objects/icons/couch.svg"
      [asset]="objects.couch"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Decorações"
      iconSrc="assets/images/objects/icons/majest.svg"
      [asset]="objects.decor"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
    <app-meet-object-picker
      title="Plantas"
      iconSrc="assets/images/objects/icons/plant.svg"
      [asset]="objects.nature"
      (setObject)="setObject($event)"
    ></app-meet-object-picker>
  </div>
  <div class="buttons">
    <app-button
      (click)="onCancel()"
      classeCss="botaoModalAvatar"
      texto="Voltar"
      cor="texto"
    ></app-button>
    <app-button
      (click)="onSubmit()"
      cor="primaria"
      classeCss="botaoModalAvatar"
      texto="Salvar"
    ></app-button>
  </div>
</section>
```

Aqui você pode ver o `app-meet-name-n-color` que criamos anteriormente. Ele é o componente que contém o nome da reunião e a cor que ela vai ter.

E você pode ver o `app-meet-object-picker` em ação, perceba que eles recebem alguns parâmetros:

- `title`: o título do objeto
- `iconSrc`: o caminho da imagem que vai ser exibida
- `asset`: a lista de objetos que serão exibidos, e vem do `this.objects`
- `(setObject)`: o evento que será disparado quando o usuário clicar em um objeto

```html
<app-meet-canvas
  right
  [objects]="objectsFromMeet"
  [selected]="selected"
  (setSelected)="setSelected($event)"
  (removeObject)="removeObject($event)"
  (rotateObject)="rotateObject($event)"
  (moveObject)="moveObject($event)"
></app-meet-canvas>
```

E esse é o nosso maravilhoso `canvas`, lembra que ele emitia 4 eventos, aqui estão eles, cada um sendo usado para fazer uma ação diferente.

Além disso ele recebe quem está selecionado e a lista de objetos da reunião, olha como é maravilhoso a componentização!

![Gif comemoração](https://media.giphy.com/media/pOllmQ4JudvHfaX7bW/giphy.gif)

No fim, vai ficar assim:

```html
<app-dashboard active="edit">
  <section left>
    <app-meet-name-n-color
      title="Editar reunião"
      [nameControl]="getFormRef('name')"
      [selectedColor]="selectedColor"
      (changeColor)="changeColor($event)"
    ></app-meet-name-n-color>
    <div class="objects">
      <app-meet-object-picker
        title="Paredes"
        iconSrc="assets/images/objects/icons/wall.svg"
        [asset]="objects.wall"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Pisos"
        iconSrc="assets/images/objects/icons/floor.svg"
        [asset]="objects.floor"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Tapetes"
        iconSrc="assets/images/objects/icons/rug.svg"
        [asset]="objects.rug"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Mesas"
        iconSrc="assets/images/objects/icons/table.svg"
        [asset]="objects.table"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Cadeiras"
        iconSrc="assets/images/objects/icons/chair.svg"
        [asset]="objects.chair"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Sofas"
        iconSrc="assets/images/objects/icons/couch.svg"
        [asset]="objects.couch"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Decorações"
        iconSrc="assets/images/objects/icons/majest.svg"
        [asset]="objects.decor"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
      <app-meet-object-picker
        title="Plantas"
        iconSrc="assets/images/objects/icons/plant.svg"
        [asset]="objects.nature"
        (setObject)="setObject($event)"
      ></app-meet-object-picker>
    </div>
    <div class="buttons">
      <app-button
        (click)="onCancel()"
        classeCss="botaoModalAvatar"
        texto="Voltar"
        cor="texto"
      ></app-button>
      <app-button
        (click)="onSubmit()"
        cor="primaria"
        classeCss="botaoModalAvatar"
        texto="Salvar"
      ></app-button>
    </div>
  </section>
  <app-meet-canvas
    right
    [objects]="objectsFromMeet"
    [selected]="selected"
    (setSelected)="setSelected($event)"
    (removeObject)="removeObject($event)"
    (rotateObject)="rotateObject($event)"
    (moveObject)="moveObject($event)"
  ></app-meet-canvas>
</app-dashboard>
```

## **Modificando o SCSS**

Agora vamos modificar o SCSS para deixar o nosso `app-meet-edit` mais bonito.

```scss
@import "/src/styles.scss";

app-meet-name-n-color {
  width: 100%;
}

app-meet-object-picker {
  width: 100%;
}

section {
  @include flex(column, center, center);
  width: 100%;
  height: 100%;

  app-meet-name-n-color {
    height: fit-content;
    flex-grow: 0;
  }

  .objects {
    flex-grow: 1;
    width: 100%;

    overflow-y: auto;
  }

  .buttons {
    @include flex(row, center, center);
    width: 100%;
    padding: 20px 0;

    height: fit-content;
    flex-grow: 0;

    align-self: flex-end;
  }
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(37, 203, 211, 0.25);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--primaria03);
  border-radius: 8px;
}
```

# Modificando as Rotas

Depois de criamos essa linda página, vamos configurar as rotas corretamente, vá até `src/app/app-routing.module.ts`, e procure por `routes`, dentro, procure por `edit-meet` e altere para:

```typescript
const routes: Routes = [
  //..
  {
    path: "edit/:id",
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import("./pages/meet/pages/edit-meet/edit-meet.module").then(
        (m) => m.EditMeetModule
      ),
  },
  //..
];
```

Infelizmente não conseguimos visualizar agora a página, por que não temos o `id` de uma sala, e não tem nenhuma sala criada, e não podemos criar, por que a página de criação será feita na próxima aula!
