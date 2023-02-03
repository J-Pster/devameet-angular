# Criando o componente `meet-object-picker`

Agora, vamos até `src/app/pages/meet/components/meet-object-picker` e vamos começar a modificar algumas coisas.

## **Modificando o TS**

Vamos começar pelo `meet-object-picker.component.ts`, importando algumas coisas, criando as variáveis e o constructor.

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-meet-object-picker",
  templateUrl: "./meet-object-picker.component.html",
  styleUrls: ["./meet-object-picker.component.scss"],
})
export class MeetObjectPickerComponent {
  @Input() title!: string;
  @Input() iconSrc!: string;
  @Input() asset!: any;

  @Output() setObject: EventEmitter<any> = new EventEmitter<any>();

  show: boolean = false;
  selected: any;

  constructor() {}
}
```

Bem, vamos falar sobre os `@Input`, primeiro, eu recebo um title, esse titulo é o nome do tipo de objeto, por exemplo "Mesas", `iconSrc` é o icone que fica do lado do titulo, `asset` esse é um objeto especial, de uma olhada abaixo desse texto, eu coloquei um exemplo do `rug`, esse objeto vem lá de `src/assets/objects/objects.ts`, e por fim, temos o `setObject`, que é um evento que eu emito quando o usuário seleciona um objeto.

Além disso, temos o `show`, que é um booleano que eu uso para expandir ou não o menu de objetos, e o `selected`, que é o objeto que o usuário selecionou.

```typescript
  rug: {
    path: 'rug',
    selectMultiple: true,
    canRotate: false,
    defaultXPosition: 2,
    defaultYPosition: 2,
    defaulZIndex: 1,
    objects: ['rug_01', 'rug_02', 'rug_03'],
  },
```

![Figma - Seleção de Objetos](https://i.imgur.com/E8XwOLH.png)

Agora, observe as 3 funções que esse componente tem:

```typescript
  // Constructor ...
  toggleShow() {
    this.show = !this.show;
  }

  getImageFromObject(object: any) {
    if (object && object.trim().length > 0) {
      const path = `assets/images/objects/${this.asset?.path}/${object}${
        this.asset?.defaultOrientation
          ? '_' + this.asset?.defaultOrientation
          : ''
      }.png`;
      return path;
    }

    return '';
  }

  selectObject(object: any) {
    this.selected = object;

    const objectFinal = {
      name: object,
      x: this.asset?.defaultXPosition,
      y: this.asset?.defaultYPosition,
      zindex: this.asset?.defaulZIndex,
      orientation: this.asset?.defaultOrientation || '',
      selectMultiple: this.asset?.selectMultiple,
      type: this.asset?.path,
      flexStart: this.asset?.flexStart,
      canRotate: this.asset?.canRotate,
    };

    this.setObject.emit(objectFinal);
  }
```

- `toggleShow` é uma função que eu uso para expandir ou não o menu de objetos, quando o usuário clica no titulo do componente, ele expande ou fecha o menu de objetos.
- `getImageFromObject` é uma função que eu uso para pegar a imagem do objeto, ela recebe o nome do objeto, e retorna o caminho da imagem, por exemplo, se eu passar `rug_01`, ela vai retornar `assets/images/objects/rug/rug_01.png`.
- `selectObject` é uma função que eu uso para selecionar um objeto, ela recebe o nome do objeto, e emite um evento com o objeto selecionado, por exemplo, se eu passar `rug_01`, ela vai emitir um evento com o objeto abaixo:

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

## **Modificando o HTML**

Agora, `meet-object-picker.component.html`:

Mas antes, precisamos criar 2 icones novos, vá até `src/assets/images/icons/meet` e crie:

- `arrow-down.svg`

```
<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L5 5L9 1" stroke="#25CBD3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- `arrow-right.svg`

```
<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9L5 5L1 1" stroke="#25CBD3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

```html
<div class="container-object-picker">
  <div class="action" (click)="toggleShow()">
    <img [src]="iconSrc" alt="Paredes da sala" />
    <span>{{ title }}</span>
    <img
      src="assets/images/icons/meet/arrow-right.svg"
      alt="Mostrar objetos"
      *ngIf="!show"
    />
    <img
      src="assets/images/icons/meet/arrow-down.svg"
      alt="Esconder objetos"
      *ngIf="show"
    />
  </div>
  <div class="objects" *ngIf="show">
    <div
      *ngFor="let object of asset?.objects"
      (click)="selectObject(object)"
      [ngClass]="
        asset?.selectMultiple === false && object == selected ? 'selected' : ''
      "
    >
      <img
        class="object"
        [src]="getImageFromObject(object)"
        [ngClass]="
          asset?.path === 'couch' || asset?.path === 'wall' ? 'large' : ''
        "
      />
      <img
        class="add"
        src="assets/images/icons/plus-circle.svg"
        *ngIf="asset?.selectMultiple"
      />
    </div>
  </div>
</div>
```

A primeira `div`, que tem classe `action` é o titulo do componente, quando o usuário clica nela, ele expande ou fecha o menu de objetos.
A segunda `div`, que tem classe `objects` é a div que contem uma lista de `divs` que representam os objetos, quando o usuário clica em um objeto, ele seleciona o objeto.

Dentro dessa `div` com classe `objects` temos uma `img` com classe `add`, essa `img` só aparece quando o usuário pode selecionar mais de um objeto, por exemplo, se o usuário selecionar uma mesa, ele pode selecionar mais de uma mesa, mas se ele selecionar uma parede, ele só pode selecionar uma parede.

## **Modificando o SCSS**

Agora, `meet-object-picker.component.scss`:

```scss
@import "/src/styles.scss";

.container-object-picker {
  @include flex(column, center, flex-start);

  width: calc(100% - 40px);
  padding: 20px;
  border-bottom: 1px solid var(--cinza01);

  &.disabled {
    cursor: auto;
  }

  .action {
    @include flex(row, center, center);

    cursor: pointer;

    img {
      margin-right: 9px;
    }

    span {
      margin-right: 14px;
    }
  }

  .objects {
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    gap: 6px;

    width: 100%;
    margin-left: -3px;
    margin-top: 18px;

    div {
      @include flex(column, center, center);
      position: relative;
      width: 30%;
      aspect-ratio: 1/1;

      cursor: pointer;

      border: 2px solid transparent;

      &:hover {
        border: 2px solid var(--cinza03);
      }

      &.selected {
        border: 2px solid var(--primaria03);
      }

      .object {
        height: 90%;

        &.large {
          height: auto;
          width: 100%;
        }
      }

      .add {
        position: absolute;
        align-self: center;
        justify-self: center;
      }
    }
  }
}
```
