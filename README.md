# Brasil Fighters ’04

Protótipo de luta arcade para navegador, inspirado nas referências fornecidas. Oito personagens: Caio Silva, Lívia Costa, Zé Teimoso, Iara do Axé, Thiago “Zé”, Zé Pilantra, Bruno Santos e Taxad. Arte própria em pixel art, sem sprites ou arquivos oficiais de KOF. Projeto fan-made, não afiliado à SNK.

## Rodar

Requer Node.js 20 ou superior. Não há dependências para instalar.

```sh
cd /workspace/kof2004
npm run dev
```

O servidor usa a porta 3000 (sobrescreva com `PORT`). Abra a aplicação no navegador pela ferramenta de preview disponível no seu ambiente. Para verificar localmente: `curl --fail http://127.0.0.1:3000/`.

## Jogar

Selecione um personagem, dificuldade e cenário, e clique em **Vamos pra luta**. Vença dois rounds de 60 segundos. O modo padrão é contra a CPU. O botão **1P VS CPU** alterna para dois jogadores no mesmo teclado; clique em **P.2** no retrato inferior para escolher o adversário; **P.1** volta à escolha do seu lutador.

| Ação | Jogador 1 | Jogador 2 |
| --- | --- | --- |
| Mover | A / D | ← / → |
| Pular | W | ↑ |
| Defender | S | ↓ |
| Soco | J | 1 |
| Chute | K | 2 |
| Especial | L | 3 |

O especial exige 50% de energia. Golpes acertados e recebidos carregam a barra. A defesa reduz o dano, mas impede atacar e andar. ESC pausa; M ativa/desativa o áudio sintetizado. O áudio começa desligado. Em telas de toque há controles na tela para o jogador 1. O modo de dois jogadores exige teclado compartilhado.

Dois cenários ilustrados: Rio ao pôr do sol e Brasília. Carregamento, seleção, efeitos de golpes, combos, defesa, rounds, desempate, pausa, resultado e revanche. Empates repetem o round até alguém vencer dois. O progresso da seleção fica salvo localmente; partidas não são persistidas.

## Verificar

```sh
npm run check
npm test
```

O jogo usa Canvas 2D, HTML e CSS. Fontes são locais e têm fallback e o jogo funciona sem serviços externos, contas ou chaves. É um protótipo em pixel art, com sprites e retratos próprios gerados para estes personagens, quatro poses-base por lutador e IA simples. Não reproduz integralmente KOF 2002: não inclui times de três, o conjunto completo de animações ou multiplayer online.
