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

Na tela inicial, pressione **Enter** ou toque para começar. Selecione três personagens diferentes na ordem em que vão lutar, a dificuldade e o cenário, e clique em **Start Team Battle**. O time rival começa preenchido; use **2P · TIME** e toque nas vagas para editá-lo. Cada confronto dura até 60 segundos. O vencedor continua com a vida restante e recupera até 15 pontos; o perdedor dá lugar ao próximo integrante. Elimine os três adversários para vencer. Empates eliminam os dois integrantes ativos; se ambos os times acabarem juntos, a partida termina empatada. O modo padrão é contra a CPU. O botão **1P VS CPU** alterna para dois jogadores no mesmo teclado; Na seleção, use A/D para mover o cursor do jogador 1 e J para confirmar; para o jogador 2, use as setas e 1; também é possível clicar em **1P** ou **2P** e depois em um retrato.

| Ação | Jogador 1 | Jogador 2 |
| --- | --- | --- |
| Mover | A / D | ← / → |
| Pular (segure para salto normal) | W | ↑ |
| Agachar | S | ↓ |
| Defesa sem recuar | R | Ctrl direito |
| Soco fraco / chute fraco | J / K | 1 / 2 |
| Soco forte / chute forte | N / B | 9 / 0 |
| Especial I / especial II | L / P | 3 / − |
| Ativar MAX | Q | = |
| Gancho / rasteira (atalhos) | U / I | 4 / 5 |
| Especial II (atalho antigo) | O | 6 |
| Agarrão | H | 7 |
| Esquiva para a frente | E | 8 |

O jogador 2 também pode usar os números e os sinais `−`/`+` do teclado numérico. Os quatro ataques têm versões em pé, agachadas e aéreas, com dano, alcance e recuperação diferentes. O jogo usa passos fixos de simulação de 1/60 s e uma janela de entrada de 0,12 s para encaixar comandos próximos ao fim da recuperação.

### Movimentação e defesa

- Dois toques para a frente: corrida; dois para trás: recuo rápido. Frente/trás são relativos ao adversário.
- Soltar o pulo nos primeiros 0,16 s dá salto curto; segurar dá salto normal. Baixo e depois cima em até 0,23 s dá super salto; soltar cedo dá super salto curto. A corrida aumenta o avanço horizontal do salto.
- Segure para trás para defender em pé; baixo + trás para defender agachado. `R`/Ctrl direito ou o botão DEF também defendem sem recuar. Golpes médios permitem as duas guardas, golpes baixos exigem guarda baixa e ataques aéreos vencem a guarda baixa. Não há defesa no ar.
- A barra azul de guarda perde resistência com golpes defendidos e recupera quando você deixa de defender. Ao zerar, a guarda quebra e deixa o lutador vulnerável por 0,85 s.
- Durante o impacto de um golpe defendido, esquiva ou chute forte gasta 50 de energia para realizar, respectivamente, rolamento de guarda ou contra-ataque de guarda.
- Agarrões vencem defesa e esquiva de perto, mas não pegam oponentes no ar. Esquivas atravessam o rival, evitam golpes e projéteis no início e têm recuperação vulnerável.

### Dois especiais de cada lutador

Cada técnica custa 50 de energia; a barra armazena 100 (dois estoques). As setas abaixo são relativas ao rival e funcionam nos dois lados. Os atalhos L/P continuam disponíveis, inclusive nos botões de toque e no controle LAN.

| Lutador | Especial I — ↓ ↘ → + ataque, ou L | Especial II — ↓ ↙ ← + ataque, ou P |
| --- | --- | --- |
| Caio Silva | Joelhada térmica: joelhada com avanço e elevação | Cotovelada solar: ataque ascendente de maior altura |
| Lívia Costa | Giro de capoeira: giro de alcance amplo | Rasteira do berimbau: deslizamento que exige defesa baixa |
| Zé Teimoso | Movimento de rua: investida curta | Rajada do asfalto: projétil rápido |
| Iara do Axé | Ondas de fúria: golpe de grande alcance | Maré de axé: projétil grande e lento |
| Thiago “Zé” | Choque técnico: golpe elétrico com avanço | Curto-circuito: investida de alta velocidade |
| Zé Pilantra | Cartola giratória: golpe circular de alcance longo | Passo da malandragem: agarrão especial com avanço |
| Bruno Santos | Só força: golpe pesado que absorve um impacto sem interromper (ainda recebe dano) | Abalo amazônico: onda pelo chão que exige defesa baixa |
| Taxad | Golpe do imposto: golpe com avanço | Malha fina: dois projéteis em sequência |

`→ ↓ ↘ + soco` executa o gancho. A sequência direcional deve terminar dentro de aproximadamente 0,5 s. Atalhos antigos de gancho e rasteira continuam disponíveis. A seleção mostra os nomes e os comandos dos dois especiais do lutador destacado.

### Combos e MAX

Após confirmar um ataque fraco, cancele em um forte ou em especial durante a recuperação. Golpes defendidos ou que não acertaram não permitem esse cancelamento. O dano diminui progressivamente dentro da sequência, até um mínimo de 45% do dano base. Ataques comuns e dano recebido carregam energia. Rasteiras, agarrões e os especiais corpo a corpo fora do MAX derrubam; a queda e a levantada impedem novos golpes enquanto o adversário se recupera.

MAX custa 50 de energia e dura 8 segundos de combate. Os especiais passam a custar 25, recebem 12% de dano adicional e os golpes corpo a corpo mantêm o rival em reação em vez de derrubar, permitindo cancelar um especial confirmado no outro, inclusive durante a subida dos ataques ascendentes do Caio. Não é possível cancelar repetidamente no mesmo especial. O modo tem indicação de tempo no HUD e uma aura própria. Essa é uma implementação original inspirada em jogos arcade, sem equivalência de regras ou quadros ao KOF 2002.

ESC pausa; M ativa/desativa o áudio sintetizado. O áudio começa desligado. Em telas de toque há controles de movimento, quatro ataques, dois especiais, MAX, agarrão e esquiva para o jogador 1. No modo LAN, o segundo aparelho tem os mesmos comandos. O modo de dois jogadores no mesmo computador usa teclado compartilhado.

Quatro cenários ilustrados: Rio, Brasília, Salvador e São Paulo. Carregamento, seleção, apresentação dos estilos antes da luta, projéteis de energia, especiais, combos, defesa, rounds, comemoração, pausa, resultado e revanche. O progresso da seleção fica salvo localmente; partidas não são persistidas.

## Verificar

```sh
npm run check
npm test
```

O jogo usa Canvas 2D, HTML e CSS. Fontes são locais e têm fallback e o jogo funciona sem serviços externos, contas ou chaves. É um protótipo em pixel art, com sprites e retratos próprios gerados para estes personagens, poses de preparação, caminhada, joelhada, rasteira, salto, soco e chute por lutador e IA simples. Não reproduz integralmente KOF 2002: inclui times de três, mas as regras, os tempos de golpes e as animações são próprios, sem equivalência exata ao KOF 2002. Não inclui multiplayer online. A apresentação usa uma tela inicial arcade, seleção azul com retratos e ordem dos times, barras de vida espelhadas e estoques de energia nos cantos inferiores, inspirados nas referências.

## Dois jogadores no Wi-Fi local (experimental)

Um computador deve executar `npm run dev` e os dois aparelhos devem estar na mesma rede Wi-Fi. No computador, clique em **JOGAR POR WI-FI** na seleção. Abra o endereço exibido no navegador do segundo aparelho. Depois que ele conectar, escolha os personagens no computador e inicie a luta. O segundo aparelho mostra a luta e tem botões próprios. Se o endereço sugerido não for o IP do computador na rede Wi-Fi, substitua-o pelo endereço IPv4 exibido em `ipconfig` no Windows. Os botões de ataque usam contadores de acionamento para preservar toques rápidos entre as leituras do anfitrião. A transmissão usa imagens periódicas e pode ter atraso; não é multiplayer online nem conexão direta entre dois celulares.

## Android

**O APK de teste inclui os times de três e as novas mecânicas de combate.** O APK está em `downloads/BrasilFighters-debug.apk`. Ele foi compilado e sua assinatura verificada, mas ainda não foi testado em um aparelho Android. Para o Wi-Fi, um computador deve hospedar a partida: no aplicativo Android, toque em **Entrar no Wi-Fi pelo celular** e cole o endereço da sala exibido no computador. Para compilar novamente, abra `android/` no Android Studio, instale o SDK 35 e gere um APK de depuração pelo menu Build. Este APK foi assinado com uma chave de depuração diferente da versão anterior: desinstale o APK anterior antes de instalá-lo. A desinstalação pode apagar os dados locais do aplicativo.

## Validação no navegador

`npm test` executa 25 testes de combate e times. Para o teste opcional de navegador, tenha Python com Playwright e Chromium instalado, inicie o servidor e execute:

```sh
GAME_URL=http://127.0.0.1:3000 python tests/browser-smoke.py
```

Use `CHROMIUM_PATH` caso o executável não esteja em `/usr/bin/chromium`. As capturas ficam em `/tmp/brasil-fighters-checks` (ou no diretório `GAME_ARTIFACTS`). O teste cobre tela inicial, seleção e edição da ordem, HUD, pausa, layouts móveis, vitórias completas dos dois lados contra times locais sem comandos, empate por tempo, revanche, os 16 especiais em cenários com energia cheia, ataques agachados/aéreos, MAX, comandos direcionais e controles de toque. Também verifica os novos comandos LAN em dois navegadores, incluindo acionamentos já soltos no controle quando o anfitrião os processa. O avanço de quadros desse teste usa uma ponte injetada apenas na resposta HTTP, sem atalhos de teste no jogo publicado. Isso não substitui partidas de equilíbrio, teste de APK em celular ou dois aparelhos em Wi-Fi real.
