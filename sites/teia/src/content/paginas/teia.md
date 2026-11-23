---
# Página do Teia (https://oranilom.com.br/homolog/teia/). Textos copiados do Figma (frame "Teia", 212:2903),
# trazidos do projeto teia-teste (app/content/teia.php) sem mudanças.
# Links: deixe '' para "pendente" (o botão aparece, mas não navega).
titulo: 'Teia — Coworkings e estúdios públicos'
descricao: 'Um programa gratuito do Sampa Empreende, ligado à Prefeitura de São Paulo e executado pela Ade Sampa, que ajuda pequenos empreendedores e MEIs.'

# Destino de todos os botões "Faça seu agendamento".
linkAgendamento: 'https://app.adesampa.com.br/welcome'

banner:
  etiqueta: 'Espaços públicos de trabalho'
  titulo: 'Teia'
  texto: 'Um programa gratuito do Sampa Empreende, ligado à Prefeitura de São Paulo e executado pela Ade Sampa, que ajuda pequenos empreendedores e MEIs.'

# Uma seção por espaço (a âncora é o endereço do submenu: #coworking etc.).
# Com 2 ou mais fotos, aparecem os pontinhos do carrossel.
espacos:
  - ancora: coworking
    etiqueta: 'Uso 100% gratuito'
    titulo: 'Coworkings públicos'
    texto: 'Espaço compartilhado focado no networking e produtividade. Conta com mesas de trabalho, Wi-Fi de alta velocidade, ambiente climatizado e salas de reunião disponíveis para uso dos empreendedores.'
    fotos:
      - { imagem: ../../assets/fotos/foto-coworking.jpg, alt: 'Coworking público do Teia com mesas compartilhadas e salas de reunião envidraçadas' }
  - ancora: podcast
    etiqueta: 'Uso 100% gratuito'
    titulo: 'Estúdios de podcast'
    texto: 'Salas com tratamento acústico, microfones padrão broadcast, fones de retorno e mesas de som multipista. Ideal para gravação de áudio, videocasts e entrevistas.'
    fotos:
      - { imagem: ../../assets/fotos/foto-podcast.jpg, alt: 'Estúdio de podcast do Teia com mesa, microfones e iluminação' }
  - ancora: fotografia
    etiqueta: 'Uso 100% gratuito'
    titulo: 'Estúdios de fotografia'
    texto: 'Equipado com fundo infinito nas cores branca, preta e verde (chroma key), além de kits de iluminação softbox contínua e tripés para celular e câmera. Perfeito para catálogos de e-commerce e produtos.'
    fotos:
      - { imagem: ../../assets/fotos/foto-fotografia.jpg, alt: 'Espaço do Teia com mural colorido e estações de trabalho' }
  - ancora: musica
    etiqueta: 'Uso 100% gratuito'
    titulo: 'Estúdios de música'
    texto: 'Infraestrutura voltada a músicos locais e produtores independentes. Isolamento acústico reforçado, monitores de áudio de precisão, interface de gravação profissional e bateria residente em unidades selecionadas.'
    fotos:
      - { imagem: ../../assets/fotos/foto-musica.jpg, alt: 'Estúdio de música do Teia com iluminação azul e tratamento acústico' }
textoBotaoMapa: 'Mapa dos Teias'
textoBotaoAgendamento: 'Faça seu agendamento'

mapa:
  titulo: 'Encontre o Teia mais próximo de você'
  texto: 'Espaços estruturados com Wi-Fi veloz, computadores, salas de reunião compartilhadas e suporte técnico nas regiões periféricas e centrais de São Paulo.'
  botao: 'Faça seu agendamento'
  # Mapa interativo (Google My Maps), carregado só quando a pessoa clica. O mesmo do Início.
  # Vazio = fica só o painel da unidade e a prévia do mapa.
  embed: 'https://www.google.com/maps/d/embed?mid=1VKpbJmE27aZ-ZaMqH6xwHOgXpnaUiWw&ehbc=2E312F'
  botaoInterativo: 'Ver mapa interativo'
  rotulos:
    unidade: 'Unidade'
    zona: 'ZONA'
    classificacao: 'Classificação'
    status: 'Atendimento Funcionando?'
    endereco: 'Endereço'
  # Com mais de uma unidade, aparece um seletor para o visitante escolher.
  unidades:
    - nome: 'TEIA Parque Novo Mundo'
      zona: 'Norte I'
      classificacao: 'TEIA - Espaço de Trabalho'
      status: 'Atendimento funcionando'
      endereco: 'Av. Ernesto Augusto Lopes, 100 - Parque Vila Maria, São Paulo - SP, 02169-030'

duvidas:
  titulo: 'Dúvidas frequentes'
  subtitulo: 'Encontre respostas rápidas para as principais dúvidas sobre o Teia.'
  # Perguntas com resposta vazia NÃO aparecem no site (pendência P-01 do Teia: respostas não fornecidas).
  itens:
    - { pergunta: 'O uso do Teia é totalmente gratuito?', resposta: '' }
    - { pergunta: 'Preciso ter um CNPJ para utilizar?', resposta: '' }
    - { pergunta: 'Como funciona a reserva de salas de reunião?', resposta: '' }
    - { pergunta: 'É possível fazer uma reserva para o dia todo?', resposta: '' }

normas:
  titulo: 'Normas de uso dos espaços'
  texto: 'Para garantir um ambiente colaborativo produtivo e respeitoso para todos, solicitamos a leitura das regras vigentes antes de realizar seu agendamento.'
  # arquivo: PDF em public/documentos/ (ex.: 'documentos/manual-de-conduta.pdf') ou https://…
  # Vazio = o botão "Baixar PDF" não aparece (pendência P-02 do Teia: PDFs não fornecidos).
  documentos:
    - { titulo: 'Manual de conduta', descricao: 'Diretrizes de convivência, consumo de alimentos, uso das mesas compartilhadas e cuidados básicos.', arquivo: '', botao: 'Baixar PDF' }
    - { titulo: 'Uso para gravações', descricao: 'Termos de responsabilidade para uso dos estúdios (podcast, fotografia e música) e política de conservação dos equipamentos públicos.', arquivo: '', botao: 'Baixar PDF' }
---
