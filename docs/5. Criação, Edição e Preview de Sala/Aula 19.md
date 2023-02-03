# Entendendo a Edição de Salas

Finalmente, chegamos no momento de editar uma sala, as páginas e componentes que faremos a seguir são os compõem o núcleo dessa aplicação, as salas, e a lógica construída aqui foi escrita de uma forma que fique mais fácil a sua leitura, mas não significa que seja a melhor forma de se fazer visando desempenho, manutabilidade e escalabilidade, mas sim, a forma mais simples de se fazer.

Sugiro que você faça os passos a seguir e termine o curso de Angular, e depois, **volte, e tente refatorar algumas funções e componentes**, como por exemplo os que usam `switch case`, ou que repetem muitas coisas no `html`, enfim, refatorar vai te ajudar a fixar o conhecimento e a entender melhor como funciona o Angular, e a programação em geral.

## **Entendendo o que precisa ser feito**

Vamos dar uma olhadinha no Figma:

**Essa página só tem Desktop**
![Figma - Edição de Sala](https://i.imgur.com/hIda3Lf.png)
![Figma - Edição de Sala](https://i.imgur.com/H7QoRiP.png)

Bem, a edição de sala é bem completa, você pode adicionar paredes e pisos, que são componentes que você só pode adicionar um, e eles são os que ficam por debaixo de todos.

Você pode adicionar vários móveis, e você pode mover eles, ou remover eles da tela, e até rotacionar eles.

Observando o Figma eu separei essa página em 1 página pai e 3 componentes filhos:

- Página de Edição, é aqui que vai ficar armazenado os estados principais, isso é `form` para nome da sala, `selectedColor` para cor da sala, `objects` são os objetos que temos disponíveis, `objectsFromMeet` são os objetos atualmente colocados e que vem da API e podem ser alterados/adicionados/removidos, `id` é o Id da sala, `error` um local para armazenar erros, `meet` aqui ficarão as informações da sala exceto objetos, `index` é o index do elemento que estamos mechendo e `selected` que é o objeto atualmente selecionado, o motivo disso tudo ficar no pai é que vamos compartilhar essas informações com componentes filhos, e os componentes filhos que vamos criar podem ser usados em outros locais de formas diferentes.

Componentes:

- `meet-name-n-color` é o mais simples, aonde ficará o formulário de seleção de cor da sala e nome da sala.
- `meet-object-picker`, cada uma das abas que abrem tipos de objetos diferentes será um desse, ele armazenará os objetos e pode adicionar eles a sala.
- `meet-canvas` esse é o principal, é o quadrado de 640x640 pixels que vai ser a sala, os objetos ficarão nele e ele terá funções de deletar, selecionar, mover e rotacionar objetos, além, claro, de exibilos.

E ai, bora fazer?

**AVISO: Isso que faremos a seguir é um pouco complexo, e a ordem em que eu farei o tutorial talvez não fique 100% clara para você, então, assista o vídeo, e veja no fim funcionando e vá voltando de trás para frente depois de ter feito, mesmo que sem entender tudo, termine, e comece a voltar de trás para frente, lendo e tentando ver o que cada função faz.**

# Criando os componentes

Vamos criar nosso primeiro componente dessa saga, primeiro, vá até `src/app/pages/meet/components` e vamos criar 3 componentes de uma vez, depois é só editar eles.

Todos eles são componentes normais, crie 3 componentes, cada um com o nome: `meet-name-n-color`, `meet-object-picker` e `meet-canvas`.

Criados, vá até `meet-components.module.ts` e adicione esses componentes em `exports`:

```typescript
// ...
exports: [
  // ...
  MeetNameNColorComponent,
  MeetObjectPickerComponent,
  MeetCanvasComponent,
];
// ...
```

# Criando o componente `meet-name-n-color`

Vamos começar criando os componentes, enquanto tivermos criando um componente tente focar a sua mente nesse componente, e imagine ele funcionando sozinho, por que essa é a intenção de um componente, ele funcionar independente do lugar, então imagine ele funcionando na sua cabeça enquanto a gente cria.

Vá até `src/pages/meet/components/meet-name-n-color` e começe.

![Figma - Meet Name N Color](https://i.imgur.com/5gKLHsW.png)

## **Modificando o TS**

Vá até `meet-name-n-color.component.ts` e cole o seguinte:

```typescript
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-meet-name-n-color",
  templateUrl: "./meet-name-n-color.component.html",
  styleUrls: ["./meet-name-n-color.component.scss"],
})
export class MeetNameNColorComponent {
  @Input() title!: string;
  @Input() defaultNameValue: string = "";
  @Input() nameControl!: AbstractControl;
  @Input() selectedColor!: string;

  @Output() changeColor: EventEmitter<string> = new EventEmitter<string>();
}
```

Observe, esse componente é bem pequeno, ele vai receber um `title`, esse Title é o que vai aparecer acima do nome da reunião, no caso, pelo figma, seria "Nova reunião", `defaultNameValue` é o valor padrão do nome da reunião, esse valor será útil quando formos editar uma sala que já tenha nome, o nome atual dela vai vir nessa prop, `nameControl` é o FormControl que o `getFormRef` da pra gente, `selectedColor` é a cor selecionada, e `changeColor` é um evento que será emitido quando a cor for alterada, enviado a cor selecionada para o pai, para ser colocado lá em `selectedColor` no pai.

## **Modificando o HTML**

Vá até `meet-name-n-color.component.html` e cole o seguinte:

```html
<div class="form">
  <div class="inputs">
    <h1>{{ title }}</h1>
    <app-input
      cssClass="newMeet"
      [default]="defaultNameValue"
      tipo="text"
      placeholder="Digite o nome de sua reunião"
      [referenciaFormulario]="nameControl"
    ></app-input>
  </div>
  <div class="color">
    <app-color-selector
      [selected]="selectedColor"
      (onSelect)="changeColor.emit($event)"
    ></app-color-selector>
  </div>
</div>
```

Super simples né? A não ser por mais um componente que acabamos de criar, o `app-color-selector`, poisé, esse componente precisa ser criado, e ele é o seletor de cor, ele é desse jeito aqui que vou te mostrar, e depois o `SharedComponentsModule` precisa ser importado, para que ele e o `app-input` funcione:

![Figma - Color Selector](https://i.imgur.com/URuDPDE.png)

Então, vamos deixar aqui o componente sem funcionar por enquanto e vamos lá criar esse componente que precisamos, e depois, voltamos aqui.

# `meet-name-n-color` -> Criando o componente `app-color-selector`

**Observe o nome dessa seção, ela tem um `->`, isso significa que paramos de criar o `meet-name-n-color` e vamos criar o `app-color-selector`, depois, mais pra frente, você vai ver `meet-name-n-color <- app-color-selector`, isso significa que voltamos para o `meet-name-n-color` e vamos terminar de criar ele.**

Esse componente será criado na pasta `shared`, então, vá até `src/app/shared/components` e crie um componente comum com nome de `color-selector`.

## **Modificando o TS**

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";

interface Color {
  value: string;
}

@Component({
  selector: "app-color-selector",
  templateUrl: "./color-selector.component.html",
  styleUrls: ["./color-selector.component.scss"],
})
export class ColorSelectorComponent {
  @Input() colors: Color[] = [
    {
      value: "#8250C4",
    },
    {
      value: "#107C10",
    },
    {
      value: "#EB5757",
    },
    {
      value: "#F2994A",
    },
    {
      value: "#2D9CDB",
    },
  ];

  @Input() selected = "#8250C4";
  opened = false;

  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  selectColor(color: string) {
    this.selected = color;
    this.opened = false;
    this.onSelect.emit(color);
  }

  openSelector() {
    this.opened = true;
  }
}
```

Vamos observar, a primeira coisa que recebemos é `colors`, e como valor padrão eu deixei uma lista de cores no formato que precisamos, depos `selected` é a cor atualmente selecionada, `opened` é um booleano que vai dizer se o seletor está aberto ou não, isso mesmo, o seletor será um componente separado, tipo um modal, mas vai ser exibido com `*ngIf`, o `selectColor` é uma callback que vamos passar para o filho, e o `openSelector` é a função que vai abrir o seletor.

## **Modificando o HTML**

```html
<div class="parent">
  <div class="container" (click)="openSelector()">
    <div class="color" [style.color]="selected"></div>
    <img src="assets/images/icons/arrow-down.svg" />
  </div>

  <app-color-selector-modal
    [colors]="colors"
    [selected]="selected"
    (onSelect)="selectColor($event)"
    *ngIf="opened"
  ></app-color-selector-modal>
</div>
```

Aqui, na primeira div temos o seletor de fato, com a cor atualmente selecionada sendo exibida como cor de uma div, e uma imagem de seta apontando para baixo, se você não tem essa imagem, crie `arrow-down.svg` em `src/assets/images/icons` e cole isso;

```svg
<svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0L4 4L8 0H0Z" fill="#7C7786"/>
</svg>
```

Maas, nós vemos novamente um componente filho, o `app-color-selector-modal`, então, vamos pausar a criação desse aqui e vamos para o `app-color-selector-modal`.

# `meet-name-n-color` -> `app-color-selector` -> Criando o componente `app-color-selector-modal`

A lógica do `->` aqui é igual, é como se fossem funções, aninhadas, quando terminamos uma voltamos um nível para trás.

Esse componente será criado dentro da pasta do componente `color-selector`, então, clique com o botão direito na pasta `src/app/shared/components/color-selector` e crie um componente comum com o nome de `color-selector-modal`.

## **Modificando o TS**

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";
interface Color {
  value: string;
}

@Component({
  selector: "app-color-selector-modal",
  templateUrl: "./color-selector-modal.component.html",
  styleUrls: ["./color-selector-modal.component.scss"],
})
export class ColorSelectorModalComponent {
  @Input() colors: Color[] = [
    {
      value: "#8250C4",
    },
    {
      value: "#107C10",
    },
    {
      value: "#EB5757",
    },
    {
      value: "#F2994A",
    },
    {
      value: "#2D9CDB",
    },
  ];

  @Input() selected = "#8250C4";

  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  selectColor(event: any) {
    const color = event.target.title;
    this.onSelect.emit(color);
  }
}
```

O componente filho é bem simples, ele recebe as cores e a cor selecionada, e quando o usuário clica em uma cor, ele emite um evento com a cor selecionada.

## **Modificando o HTML**

```html
<div class="container">
  <div class="material-color-picker">
    <div class="material-color-picker">
      <ol class="color-selector">
        <li *ngFor="let color of colors">
          <input
            name="material-color"
            type="radio"
            [id]="color.value"
            [value]="color.value"
            [checked]="color.value === selected"
          />
          <label
            (click)="selectColor($event)"
            [style.color]="color.value"
            [title]="color.value"
            [for]="color.value"
          ></label>
        </li>
      </ol>
    </div>
  </div>
</div>
```

Pode parecer confuso, mas leia e ten te entender isso, você vai achar até um pouco interessante, ah, e observe o `SCSS` para ver o que cada `div` significa.

## **Modificando o SCSS**

```scss
@import "/src/styles.scss";

@mixin list-reset() {
  margin: 0;
  padding: 0;
  list-style: none;
}

.container {
}

.material-color-picker {
  display: flex;
  width: 50px;
  margin: 0 auto;
}

.color-selector {
  @include list-reset;
  @include flex(column, center, center);

  width: 100%;
  padding: 10px 0;

  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.25);

  input[type="radio"] {
    display: none;
  }

  label {
    position: relative;
    display: inline-block;
    padding: 0.5rem;
    cursor: pointer;

    &:before {
      content: "";
      display: inline-block;
      vertical-align: middle;
      padding: 0.75em;
      background-color: currentColor;
      border-radius: 50%;
    }
  }

  input[type="radio"]:checked + label:after {
    padding: 1em;
  }
}
```

# Voltando a `app-color-selector` <- `app-color-selector-modal`

Se você der uma olhada no `app-color-selector-modal.component.html`, vai ver que agora está tudo funcionando.

## **Modificando o SCSS**

```scss
@import "/src/styles.scss";

.parent {
  position: relative;

  app-color-selector-modal {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}

.container {
  @include flex(row, center, center);
  cursor: pointer;

  img {
    margin-left: 8px;
  }

  padding: 6px;
  border-radius: 0.5rem;

  .color {
    position: relative;
    display: inline-block;

    &:before {
      content: "";
      display: inline-block;
      vertical-align: middle;
      padding: 0.75em;
      background-color: currentColor;
      border-radius: 50%;
    }

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      padding: 0.5em;
      border: 0.25em solid;
      border-radius: 50%;

      transition: padding 250ms;
    }
  }
}
```

Como sabem, SCSS eu explico na aula!

## **Modificando o Módulo**

Agora que temos `ColorSelectorComponent` pronto, precisamos colocar ele em `exports` no `src/app/shared/components/shared-components.module.ts`!

```typescript
// ...
  exports: [
    // ...
    ColorSelectorComponent,
  ],
// ...
```

# Voltando a `meet-name-n-color` <- `app-color-selector`

Bem, agora que criamos tudo que precisamos, vamos voltar para o `meet-name-n-color` e primeiro vamos importar o `SharedComponentsModule` no `src/app/pages/meet/components/meet-components.module.ts`.

```typescript
// Outras importações...
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
// ...

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    SharedComponentsModule,
  ],
  exports: [
    // ...
  ],
})
```

Agora sim, de uma olhada em `meet-name-n-color.component.html` e veja que está tudo funcionando.

## **Modificando o SCSS**

Vá até `meet-name-n-color.component.scss` e cole o seguinte:

```scss
@import "/src/styles.scss";

.form {
  @include flex(row, center, flex-start);

  width: calc(100% - 40px);
  padding: 20px;
  border-bottom: 1px solid var(--cinza01);
}

.inputs {
  @include flex(column, center, flex-start);
  width: 100%;

  h1 {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--cinza02);

    margin-left: 3px;
  }

  app-input {
    width: 100%;
  }
}

.color {
  flex: 1;
  margin-top: 10px;
}
```

Prontinho!

# Explicando mais ainda o `->` e `<-`

Entendeu bem como isso funciona? Poisé, eu só coloquei isso aqui na aula por que as coisas aqui vão começar a ficar mais complexas, então vamos precisar parar de criar algo para começar a criar outro e depois voltar ao primeiro, então, na aula, eu vou explicar um pouco mais disso, peço que assista para tirar qualquer dúvida!

![Gif Felicidade](https://media.giphy.com/media/cMPdlbcUKl3xkMCyD3/giphy.gif)
