# Criando validadores

Lembra dos validadores? Então, agora, vamos criar os validadores para o nosso formulário de registro.

Nós vamos criar dois validadores, um chamado `confirm-pass` e um chamado `pass`, e vamos fazer isso dentro da pasta `src/shared/validators`.

Primeiro, crie dois arquivos chamados `confirm-pass.validator.ts` e `pass.validator.ts` na pasta que mencionei.

## **Criando o validador de senha**

Vamos começar pelo validador de senha, então, vamos abrir o arquivo `pass.validator.ts` e vamos criar o validador:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,12}$/;

    if (!control.value) {
      return null;
    }

    if (control.value.match(passwordRegex)) {
      return null;
    }

    return { password: true };
  };
}
```

A função `passwordValidator` é especial, era returna um `ValidatorFn`, que é uma função que recebe um `AbstractControl` e retorna um `ValidationErrors` ou `null`.

Basicamente, é uma função que retorna uma função, essa função será recebida lá no `FormBuilder` e será executada toda vez que o valor do campo for alterado.

A lógica do nosso validador é simples:

```typescript
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,12}$/;
```

Isso é um Regex, que é uma expressão regular, que vai validar se a senha está de acordo com as regras que definimos, que no caso são as seguintes:

- A senha deve ter pelo menos 4 caracteres
- A senha deve ter no máximo 12 caracteres
- A senha deve ter pelo menos uma letra maiúscula
- A senha deve ter pelo menos uma letra minúscula
- A senha deve ter pelo menos um número
- A senha deve ter pelo menos um caractere especial

```typescript
if (!control.value) {
  return null;
}
```

Retorna `null` se o valor do campo for `null` ou `undefined`.

```typescript
if (control.value.match(passwordRegex)) {
  return null;
}
```

Retorna `null` se o valor do campo for válido.

```typescript
return { password: true };
```

Retorna um objeto com o nome do validador e o valor `true` se o valor do campo for inválido, isso marca o campo como inválido.

## **Criando o validador de confirmação de senha**

Agora, vamos criar o validador de confirmação de senha, então, vamos abrir o arquivo `confirm-pass.validator.ts` e vamos criar o validador:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPassVal(): ValidatorFn {
  return (campoForm: AbstractControl): ValidationErrors | null => {
    const form = campoForm.parent;
    const password = form?.get("password")?.value;
    const confirmPass = form?.get("confirmPass")?.value;

    return password === confirmPass ? null : { confirmPass: true };
  };
}
```

Bem parecido com o anterior, a única coisa que muda é a lógica, no caso, vamos pegar o valor do campo de senha e do campo de confirmação de senha e vamos comparar, se forem iguais, retornamos `null`, se não, retornamos um objeto com o nome do validador e o valor `true`.

Em `const form = campoForm.parent;`, o `campoForm` é o campo que está sendo validado, e o `parent` é o formulário, então, vamos pegar o formulário e vamos pegar os valores dos campos de senha e confirmação de senha.

## **Importando os validadores**

Vamos até `src/pages/register/register.component.ts` e vamos importar os validadores:

```typescript
// Outras importações...
import { passwordValidator } from "src/app/shared/validators/pass.validator";
import { confirmPassVal } from "src/app/shared/validators/confirm-pass.validator";

// ...
```

Agora, no `FormBuilder` que está dentro do `constructor`, vamos adicionar os validadores:

```typescript
      password: [
        '',
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
      confirmPass: ['', [Validators.required, confirmPassVal()]],
```

Nós adicionamos o validador `passwordValidator` no campo de senha e o validador `confirmPassVal` no campo de confirmação de senha.

O `constructor` deve ter ficado assim, por dentro das aspas:

```typescript
this.form = this.fb.group({
  nome: ["", [Validators.required, Validators.minLength(3)]],
  email: ["", [Validators.required, Validators.email]],
  password: [
    "",
    [Validators.required, Validators.minLength(4), passwordValidator()],
  ],
  confirmPass: ["", [Validators.required, confirmPassVal()]],
});
```

## **Testando os validadores**

Se quiser, você pode testar os validadores agora, basta acessar `http://localhost:4200/register` e testar os campos do formulário.
