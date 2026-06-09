# 🛒 Carrinho de Compras

Sistema de carrinho de compras estático, hospedável no **GitHub Pages**.

## Funcionalidades

- ✅ Adicionar produtos (nome + quantidade)
- ✅ Editar produto existente
- ✅ Excluir produto (com confirmação)
- ✅ Limpar toda a lista
- ✅ Dados salvos automaticamente (persistem ao fechar o navegador)
- ✅ Atalhos de teclado: **Enter** para confirmar, **Esc** para cancelar

## Onde os dados ficam salvos?

O GitHub Pages serve arquivos estáticos e não permite escrita em disco.  
Os dados são salvos no **`localStorage`** do navegador sob a chave:

```
compras/lista.json
```

Isso significa que cada pessoa que acessar o site terá sua própria lista salva localmente no dispositivo.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos:
   ```
   index.html
   style.css
   app.js
   compras/   ← pasta incluída (fica vazia, só para referência)
   ```
3. No repositório → **Settings → Pages**
4. Em *Branch*, selecione `main` e pasta `/root`
5. Clique em **Save**
6. Acesse em: `https://<seu-usuario>.github.io/<nome-do-repo>/`

## Estrutura de arquivos

```
/
├── index.html
├── style.css
├── app.js
└── compras/
    └── .gitkeep
```
