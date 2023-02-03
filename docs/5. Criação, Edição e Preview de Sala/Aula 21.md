# Criando o componente `meet-canvas`

Esse é o maior componente de todos, é o `canvas` que exibe a reunião, eu vou explicar ele passo a passo para você, pegue uma agua, foque e vamos lá!

Lembre-se, eu vou explicar as funções mais ou menos em uma ordem que são usadas, e no final eu deixo o arquivo na íntegra, para você ver como ficou.

Ao final, leia novamente, e imagine o componente funcionando na sua cabeça.

## **Modificando o TS**

## Importando o que vamos usar

Primeiro, vamos importar algumas coisas do Angular:

```typescript
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import { MeetCompleteObject } from "src/app/types/meet.type";
```

Nesse componente vamos usar `EventListeners` que são escutadores de evento, e eles precisam ser removidos quando esse componente sair da tela, por isso o `OnInit` e `OnDestroy`.

Também vamos usar o `OnChanges` para quando o componente receber novos dados, ele atualizar o `canvas`.

## Criando a Classe

Crie a classe da seguinte forma:

```typescript
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import { MeetCompleteObject } from "src/app/types/meet.type";

@Component({
  selector: "app-meet-canvas",
  templateUrl: "./meet-canvas.component.html",
  styleUrls: ["./meet-canvas.component.scss"],
})
export class MeetCanvasComponent implements OnInit, OnDestroy, OnChanges {}
```

Por enquanto ela vai ficar dando erro, mas isso é por que estamos usando o `OnInit`, `OnDestroy` e `OnChanges` que ainda não foram criados.

## Criando os `@Input`

```typescript
  @Input() onlyView: boolean = false;

  @Input() objects: any;
  @Input() selected: any;
```

Primeiro, nós vamos receber algumas coisas, nós recebos o seguinte:

- `onlyView`: se é só para visualizar ou se é para editar, quando ativado ele bloqueia selecionar e mover objetos.
- `objects`: os objetos que estão na tela, eles são um array de objetos, cada objeto é um objeto do canvas.
- `selected`: o objeto selecionado, ele é um objeto do canvas.

## Criando o `ngOnChanges`

```typescript
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      this.selected = changes['selected'].currentValue;
    }
  }
```

Usamos o `ngOnChanges` por que queremos escutar toda vez que o `selected` for atualizado, temos que fazer isso manualmente por que o Angular tem um certo problema com atualizar elementos que são `Objetos` e não `Primitivos`, e `selected` é um objeto, o objeto que representa o móvel selecionado.

## Criando os `@Output`

```typescript
  @Output() setSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() rotateObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveObject: EventEmitter<any> = new EventEmitter<any>();
```

Usar o `@Output` é só criar o `EventEmitter`, mas não significa que ele vai emitir um evento, aqui nós estamos criando `Emitters` para:

- `setSelected`: quando o usuário selecionar um objeto.
- `removeObject`: quando o usuário remover um objeto.
- `rotateObject`: quando o usuário rotacionar um objeto.
- `moveObject`: quando o usuário mover um objeto.

O motivo de criar os `Emitters` é que as funções que realmente fazem isso, selecionar, remover, rotacionar e mover objetos ficam lá na página pai que ainda vamos criar, mas imagine na sua cabeça que isso está criando, imagine esse componente funcionando sozinho.

## Criando o `ngOnInit`, `ngOnDestroy` e `constructor`

```typescript
  constructor() {}

  ngOnInit(): void {
    document.addEventListener('keyup', this.moveSelected);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keyup', this.moveSelected);
  }
```

O que fazemos aqui é adicionar um escutador de vai observar se alguma tecla foi clicada, se ela for as teclas de seta, ele vai mover o objeto selecionado, essa lógica de telcas está na função `moveSelected`, que ainda não foi criada.

O `ngOnDestroy` é para remover o escutador de teclas quando o componente sair da tela, para não ficar escutando teclas quando não precisa.

## Pegando a imagem de um objeto

```typescript
getImageFromObject(object: any) {
  if (!object?.name || !object?.name.trim().length) {
    return '';
  }

  const orientation = object.orientation ? `_${object.orientation}` : '';
  return `assets/images/objects/${object.type}/${object.name}${orientation}.png`;
}
```

Nós recebemos uma lista de objetos, em `objects`, cada objeto é tipo assim:

```typescript
{
  name: 'rug_01',
  x: 2,
  y: 2,
  zindex: 1,
  orientation: '',
  selectMultiple: true,
  type: 'rug',
  flexStart: false,
  canRotate: true,
}
```

O que essa função faz, é transformar o nome do objeto em um caminho para a imagem dele, essa função é usada lá no HTML, em um `*ngFor` que renderiza cada objeto.

## Pegando o estilo de um objeto

```typescript
  getObjectStyle(object: any): any {
    return object.zindex ? { zIndex: object.zindex } : {};
  }
```

Essa função pega o estilo de um objeto, e é usada mais para definir o `z-index` do objeto, mas pode ser usado para definir outras coisas, essa função também é usada no mesmo lugar da de cima.

## Pegando a classe de um objeto (posicionando ele)

```typescript
  getClassObject(object: MeetCompleteObject): string {
    let cl = '';

    if (this.selected?._id && object._id && this.selected?._id === object._id) {
      cl += 'selected ';
    }

    const classMap: any = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
    };

    if (
      object?.flexStart ||
      object?.type === 'wall' ||
      object?.type === 'floor'
    ) {
      cl += 'column-start ';

      if (object?.type === 'wall') {
        cl += 'row-start';
      } else {
        cl += 'floor-start';
      }
    } else {
      cl += `column-${classMap[object.x]} row-${classMap[object.y]}`;
    }

    return cl;
  }
```

## Selecionando um objeto

```typescript
  selectObject(obj: any) {
    if (this.onlyView) return;
    this.setSelected.emit(obj);
  }
```

Essa função é chamada quando o usuário clica em um objeto, ela só emite um evento, que é ouvido pela página pai, que vai fazer a lógica de selecionar o objeto.

## Movendo um objeto selecionado

```typescript
moveSelected = (event: any) => {
  if (this.onlyView || !this.selected || !this.selected._id || !event) return;
  const selected = this.selected;

  const to = (() => {
    switch (event.key) {
      case "ArrowUp":
        return "up";
      case "ArrowDown":
        return "down";
      case "ArrowLeft":
        return "left";
      case "ArrowRight":
        return "right";
      default:
        return "";
    }
  })();

  if (to) {
    this.moveObject.emit({ selected, to });
  }
};
```

Essa função é chamada quando o usuário aperta uma tecla, primeiro ela cancela se o usuário está apenas vendo o ambiente, se não tem nenhum objeto selecionado ou se não tem um evento, se não tiver, ela cancela.

Depois ela pega a tecla que foi apertada e transforma em uma direção, se for uma tecla de seta, ela vai mover o objeto selecionado, se não for, ela cancela.

No fim, ela emite um evento, passando quem está selecionado e para aond ele vai, que é ouvido pela página pai, que vai fazer a lógica de mover o objeto.

## Então, é assim que vai ficar no fim:

```typescript
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MeetCompleteObject } from "src/app/types/meet.type";

@Component({
  selector: "app-meet-canvas",
  templateUrl: "./meet-canvas.component.html",
  styleUrls: ["./meet-canvas.component.scss"],
})
export class MeetCanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() onlyView: boolean = false;

  @Input() objects: any;
  @Input() selected: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selected"]) {
      this.selected = changes["selected"].currentValue;
    }
  }

  @Output() setSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() rotateObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveObject: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    document.addEventListener("keyup", this.moveSelected);
  }

  ngOnDestroy(): void {
    document.removeEventListener("keyup", this.moveSelected);
  }

  // Image Functions

  getImageFromObject(object: any) {
    if (!object?.name || !object?.name.trim().length) {
      return "";
    }

    const orientation = object.orientation ? `_${object.orientation}` : "";
    return `assets/images/objects/${object.type}/${object.name}${orientation}.png`;
  }

  getObjectStyle(object: any): any {
    return object.zindex ? { zIndex: object.zindex } : {};
  }

  getClassObject(object: MeetCompleteObject): string {
    let cl = "";

    if (this.selected?._id && object._id && this.selected?._id === object._id) {
      cl += "selected ";
    }

    const classMap: any = {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
    };

    if (
      object?.flexStart ||
      object?.type === "wall" ||
      object?.type === "floor"
    ) {
      cl += "column-start ";

      if (object?.type === "wall") {
        cl += "row-start";
      } else {
        cl += "floor-start";
      }
    } else {
      cl += `column-${classMap[object.x]} row-${classMap[object.y]}`;
    }

    return cl;
  }

  selectObject(obj: any) {
    if (this.onlyView) return;
    this.setSelected.emit(obj);
  }

  // Move

  moveSelected = (event: any) => {
    if (this.onlyView || !this.selected || !this.selected._id || !event) return;
    const selected = this.selected;

    const to = (() => {
      switch (event.key) {
        case "ArrowUp":
          return "up";
        case "ArrowDown":
          return "down";
        case "ArrowLeft":
          return "left";
        case "ArrowRight":
          return "right";
        default:
          return "";
      }
    })();

    if (to) {
      this.moveObject.emit({ selected, to });
    }
  };
}
```

## **Modificando o HTML**

Vá até o arquivo `meet-canvas.component.html` e vamos lá:

```html
<div class="container-objects" (keyup.arrow)="moveSelected($event)"></div>
```

A primeira coisa que fazemos é criar uma div que será de fato o `canvas`, e nela vamos adicionar um evento de tecla, que vai chamar a função `moveSelected` que criamos no componente.

```html
<div class="container-objects" (keyup.arrow)="moveSelected($event)">
  <div class="grid">
    <div *ngIf="!onlyView" class="line column one"></div>
    <div *ngIf="!onlyView" class="line column two"></div>
    <div *ngIf="!onlyView" class="line column three"></div>
    <div *ngIf="!onlyView" class="line column four"></div>
    <div *ngIf="!onlyView" class="line column five"></div>
    <div *ngIf="!onlyView" class="line column six"></div>
    <div *ngIf="!onlyView" class="line column seven"></div>
    <div *ngIf="!onlyView" class="line row one"></div>
    <div *ngIf="!onlyView" class="line row two"></div>
    <div *ngIf="!onlyView" class="line row three"></div>
    <div *ngIf="!onlyView" class="line row four"></div>
    <div *ngIf="!onlyView" class="line row five"></div>
    <div *ngIf="!onlyView" class="line row six"></div>
    <div *ngIf="!onlyView" class="line row seven"></div>
    <img
      *ngFor="let object of objects"
      [src]="getImageFromObject(object)"
      [ngStyle]="getObjectStyle(object)"
      [ngClass]="getClassObject(object)"
      (click)="selectObject(object)"
    />
  </div>
</div>
```

Agora nós adicionamos o `grid`, dentro dela tem duas coisas:

- Linhas horizontais e verticais que aparecem para orientar o usuário na hora de posicionar os objetos.
- Os objetos de verdade, que no caso são imagens, isso mesmo, imagens, pois o canvas é apenas um plano de fundo, e os objetos são imagens que ficam sobre ele, e que podem ser movidas, rotacionadas, selecionadas, etc.

Abaixo dele, vamos colocar a barra de ações:

```html
<div *ngIf="!onlyView" class="actions">
  <div
    (click)="removeObject.emit(selected)"
    [ngClass]="{ active: selected?._id }"
  >
    <img src="assets/images/icons/trashcan.svg" alt="Deletar objeto" />
  </div>
  <div
    [ngClass]="{
        active:
          selected?.canRotate ||
          selected?.type === 'chair' ||
          selected?.type === 'couch'
      }"
    (click)="rotateObject.emit({ selected, to: 'right' })"
  >
    <img src="assets/images/icons/rotate-right.svg" alt="Girar a direita" />
  </div>
  <div
    [ngClass]="{
        active:
          selected?.canRotate ||
          selected?.type === 'chair' ||
          selected?.type === 'couch'
      }"
    (click)="rotateObject.emit({ selected, to: 'left' })"
  >
    <img src="assets/images/icons/rotate-left.svg" alt="Girar a esquerda" />
  </div>
</div>
```

São basicamente 3 quadrados que contém icones, cada um deles faz uma coisa, e eles aparecem de acordo com o objeto selecionado, dê uma lida no `ngClass` de cada um deles para entender melhor.

No fim, vai ficar tudo assim:

```html
<div class="container-objects" (keyup.arrow)="moveSelected($event)">
  <div class="grid">
    <div *ngIf="!onlyView" class="line column one"></div>
    <div *ngIf="!onlyView" class="line column two"></div>
    <div *ngIf="!onlyView" class="line column three"></div>
    <div *ngIf="!onlyView" class="line column four"></div>
    <div *ngIf="!onlyView" class="line column five"></div>
    <div *ngIf="!onlyView" class="line column six"></div>
    <div *ngIf="!onlyView" class="line column seven"></div>
    <div *ngIf="!onlyView" class="line row one"></div>
    <div *ngIf="!onlyView" class="line row two"></div>
    <div *ngIf="!onlyView" class="line row three"></div>
    <div *ngIf="!onlyView" class="line row four"></div>
    <div *ngIf="!onlyView" class="line row five"></div>
    <div *ngIf="!onlyView" class="line row six"></div>
    <div *ngIf="!onlyView" class="line row seven"></div>
    <img
      *ngFor="let object of objects"
      [src]="getImageFromObject(object)"
      [ngStyle]="getObjectStyle(object)"
      [ngClass]="getClassObject(object)"
      (click)="selectObject(object)"
    />
  </div>
  <div *ngIf="!onlyView" class="actions">
    <div
      (click)="removeObject.emit(selected)"
      [ngClass]="{ active: selected?._id }"
    >
      <img src="assets/images/trashcan.svg" alt="Deletar objeto" />
    </div>
    <div
      [ngClass]="{
        active:
          selected?.canRotate ||
          selected?.type === 'chair' ||
          selected?.type === 'couch'
      }"
      (click)="rotateObject.emit({ selected, to: 'right' })"
    >
      <img src="assets/images/rotate-right.svg" alt="Girar a direita" />
    </div>
    <div
      [ngClass]="{
        active:
          selected?.canRotate ||
          selected?.type === 'chair' ||
          selected?.type === 'couch'
      }"
      (click)="rotateObject.emit({ selected, to: 'left' })"
    >
      <img src="assets/images/rotate-left.svg" alt="Girar a esquerda" />
    </div>
  </div>
</div>
```

## **Modificando o SCSS**

```scss
@import "/src/styles.scss";

.container-objects {
  align-self: center;

  .grid {
    display: flex;
    width: 320px;
    height: 320px;
    background-color: white;
    position: relative;

    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14);

    img {
      position: absolute;
      image-resolution: from-image 300dpi;

      img {
        width: 30%;
      }

      &.selected {
        opacity: 0.6;
      }

      &.column-start {
        left: 0%;
      }

      &.row-start {
        top: 0%;
      }

      &.floor-start {
        top: 12.5%;
      }

      &.column-zero {
        left: 2%;
      }

      &.column-one {
        left: 14.5%;
      }

      &.column-two {
        left: 27%;
      }

      &.column-three {
        left: 39.5%;
      }

      &.column-four {
        left: 52%;
      }

      &.column-five {
        left: 64.5%;
      }

      &.column-six {
        left: 77%;
      }

      &.column-seven {
        left: 89.5%;
      }

      &.row-zero {
        top: 2%;
      }

      &.row-one {
        top: 14.5%;
      }

      &.row-two {
        top: 27%;
      }

      &.row-three {
        top: 39.5%;
      }

      &.row-four {
        top: 52%;
      }

      &.row-five {
        top: 64.5%;
      }

      &.row-six {
        top: 77%;
      }

      &.row-seven {
        top: 89.5%;
      }
    }

    .line {
      position: absolute;
      height: 0px;
      margin: 0;
      top: 0;
      z-index: 10;

      &.column {
        top: 0;
        border-left: 0.5px solid var(--primaria03);
        width: 0px;
        height: 100%;

        &.one {
          left: 12.5%;
        }

        &.two {
          left: 25%;
        }

        &.three {
          left: 37.5%;
        }

        &.four {
          left: 50%;
        }

        &.five {
          left: 62.5%;
        }

        &.six {
          left: 75%;
        }

        &.seven {
          left: 87.5%;
        }
      }

      &.row {
        border-bottom: 0.5px solid var(--primaria03);
        width: 100%;
        left: 0;

        &.one {
          top: 12.5%;
        }

        &.two {
          top: 25%;
        }

        &.three {
          top: 37.5%;
        }

        &.four {
          top: 50%;
        }

        &.five {
          top: 62.5%;
        }

        &.six {
          top: 75%;
        }

        &.seven {
          top: 87.5%;
        }
      }
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    display: flex;
    flex: 1;
    align-items: flex-start;
    justify-content: center;

    .grid {
      width: 640px;
      height: 640px;

      .user-avatar {
        &.column-zero {
          left: 1.5%;
        }

        &.column-one {
          left: 14.5%;
        }

        &.column-two {
          left: 27%;
        }

        &.column-three {
          left: 40%;
        }

        &.column-four {
          left: 52.5%;
        }

        &.column-five {
          left: 65%;
        }

        &.column-six {
          left: 77.5%;
        }

        &.column-seven {
          left: 90%;
        }

        &.row-zero {
          top: 0%;
        }

        &.row-one {
          top: 6%;
        }

        &.row-two {
          top: 18%;
        }

        &.row-three {
          top: 30%;
        }

        &.row-four {
          top: 43%;
        }

        &.row-five {
          top: 55%;
        }

        &.row-six {
          top: 67%;
        }

        &.row-seven {
          top: 80%;
        }
      }

      .audio {
        top: 90%;
        left: 90%;
        width: 48px;
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 16px;

      div {
        cursor: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: var(--cinza03);
        margin-bottom: 16px;
        border-radius: 4px;

        &.active {
          cursor: pointer;
          background-color: var(--primaria03);
        }
      }
    }
  }
}
```
