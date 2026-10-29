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

Selecione um personagem, dificuldade e cenário, e clique em **Vamos pra luta**. Vença dois rounds de 60 segundos. O modo padrão é contra a CPU. O botão **1P VS CPU** alterna para dois jogadores no mesmo teclado; Na seleção, use A/D para o jogador 1 e as setas para o jogador 2; também é possível clicar em **1P** ou **2P** e depois em um retrato.

| Ação | Jogador 1 | Jogador 2 |
| --- | --- | --- |
| Mover | A / D | ← / → |
| Pular | W | ↑ |
| Defender | S | ↓ |
| Soco | J | 1 |
| Chute | K | 2 |
| Especial | L | 3 |
| Gancho | U | 4 |
| Rasteira | I | 5 |

O jogador 2 também pode usar as teclas 1 a 5 do teclado numérico.

O especial exige 50% de energia. Golpes acertados e recebidos carregam a barra. A defesa reduz o dano, mas impede atacar e andar. ESC pausa; M ativa/desativa o áudio sintetizado. O áudio começa desligado. Em telas de toque há controles na tela para o jogador 1. O modo de dois jogadores exige teclado compartilhado.

Quatro cenários ilustrados: Rio, Brasília, Salvador e São Paulo. Carregamento, seleção, efeitos de golpes, combos, defesa, rounds, desempate, pausa, resultado e revanche. Empates repetem o round até alguém vencer dois. O progresso da seleção fica salvo localmente; partidas não são persistidas.

## Verificar

```sh
npm run check
npm test
```

O jogo usa Canvas 2D, HTML e CSS. Fontes são locais e têm fallback e o jogo funciona sem serviços externos, contas ou chaves. É um protótipo em pixel art, com sprites e retratos próprios gerados para estes personagens, poses de preparação, caminhada, joelhada, rasteira, salto, soco e chute por lutador e IA simples. Não reproduz integralmente KOF 2002: não inclui times de três, o conjunto completo de animações ou multiplayer online.

## Dois jogadores no Wi-Fi local (experimental)

Um computador deve executar `npm run dev` e os dois aparelhos devem estar na mesma rede Wi-Fi. No computador, clique em **JOGAR POR WI-FI** na seleção. Abra o endereço exibido no navegador do segundo aparelho. Depois que ele conectar, escolha os personagens no computador e inicie a luta. O segundo aparelho mostra a luta e tem botões próprios. Se o endereço sugerido não for o IP do computador na rede Wi-Fi, substitua-o pelo endereço IPv4 exibido em `ipconfig` no Windows. A transmissão usa imagens periódicas e pode ter atraso; não é multiplayer online nem conexão direta entre dois celulares.

## Android

O APK de teste está em `downloads/BrasilFighters-debug.apk`. Ele foi compilado e sua assinatura verificada, mas ainda não foi testado em um aparelho Android. Para o Wi-Fi, um computador deve hospedar a partida: no aplicativo Android, toque em **Entrar no Wi-Fi pelo celular** e cole o endereço da sala exibido no computador. Para compilar novamente, abra `android/` no Android Studio, instale o SDK 35 e gere um APK de depuração pelo menu Build. Por ser uma versão de teste assinada com chave de depuração, futuras versões com outra chave podem exigir desinstalar esta antes de instalar.
