---
# Página Início (https://oranilom.com.br/homolog/). Textos copiados do Figma (frame "Início", 1:2884).
# Links: deixe '' para "pendente" (o botão aparece, mas não navega). Caminhos do próprio site
# são escritos sem barra inicial, ex.: 'sobre/'.
titulo: 'ADE SAMPA – Agência São Paulo de Desenvolvimento'
descricao: 'Programas, soluções e serviços para todas as fases da jornada empreendedora, da ideia à expansão, na cidade de São Paulo.'

banner:
  titulo: "Fortalecemos negócios,\nampliamos oportunidades."
  texto: 'Oferecemos programas, soluções e serviços para todas as fases da jornada empreendedora, da ideia à expansão, na cidade de São Paulo.'
  botao: { texto: 'Conheça a ADE SAMPA', link: 'sobre/' }

eixos:
  titulo: 'Nossos eixos de atuação'
  texto: "Conheça nossas iniciativas de apoio ao\nempreendedorismo na cidade de São Paulo."

destaques:
  titulo: 'Destaques e oportunidades'

parcerias:
  etiqueta: 'Lorem Ipsum Dollor' # PROVISÓRIO: texto ainda não definido no Figma
  titulo: 'Parcerias governamentais'
  texto: 'A ADE SAMPA também atua como parceira governamental estratégica na implantação e gestão de políticas públicas municipais, estruturando diversos espaços físicos de impacto na cidade de São Paulo.'
  botao: { texto: 'Veja nossa atuação em parcerias', link: 'parcerias-governamentais/' }
  # Cada item é uma foto do carrossel, com o título escrito sobre ela.
  itens:
    - titulo: 'Smart Sampa: Central de inteligência da cidade'
      imagem: ../../assets/fotos/parceria-smart-sampa.jpg
      alt: 'Saguão da central Smart Sampa, com telões circulares de LED azuis suspensos sob a cúpula.'
    - titulo: 'Espaço Motoboy'
      imagem: ../../assets/fotos/parceria-espaco-motoboy.jpg
      alt: 'Espaço Motoboy: construção térrea com grafite colorido de um ciclista na fachada, bancos e lixeiras na calçada.'

numeros:
  titulo: 'Nosso impacto em números'
  texto: 'Resultados consolidados de apoio ao empreendedorismo, inovação e descentralização do desenvolvimento na cidade.'
  itens:
    - { valor: '13 anos', texto: "de apoio a quem\nmovimenta a\ncidade" }
    - { valor: '+500.000', texto: 'empreendimentos e munícipes atendidos' }
    - { valor: '+30', texto: 'coworkings e estúdios públicos em operação' }

teia:
  etiqueta: 'Equipamento público'
  titulo: 'Teia: coworkings e estúdios gratuitos em toda a cidade'
  texto: 'Rede de espaços de trabalho públicos com internet, computadores e salas de reunião, além de estúdios profissionais de podcast, música e fotografia em todas as regiões de São Paulo.'
  botaoSecundario: { texto: 'Saiba mais', link: 'https://oranilom.com.br/homolog/teia/' } # Teia novo (homolog). O Teia antigo segue em oranilom.com.br/teia/.
  botaoPrincipal: { texto: 'Agende seu horário', link: 'https://app.adesampa.com.br/welcome' }
  mapa: ../../assets/fotos/teia-mapa.png
  mapaAlt: 'Mapa de São Paulo com a unidade TEIA Parque Novo Mundo (zona Norte), na Av. Ernesto Augusto Lopes, 100 – Parque Vila Maria.'
  mapaLink: 'https://oranilom.com.br/homolog/teia/#mapa'
  # Mapa interativo: cole aqui o link de incorporação do Google My Maps (https://www.google.com/maps/d/embed?mid=…).
  # Vazio = fica só a imagem acima, com link.
  mapaEmbed: 'https://www.google.com/maps/d/embed?mid=1VKpbJmE27aZ-ZaMqH6xwHOgXpnaUiWw&ehbc=2E312F'
  mapaBotao: 'Ver mapa interativo'

produtos:
  etiqueta: 'Plataformas online'
  titulo: 'Nossos produtos digitais'
  texto: "Ferramentas gratuitas para capacitação, gestão de negócios\ne acesso a dados estratégicos para empreendedores."
  textoLink: 'Acesse a plataforma'
  itens:
    - id: sampa-ensina
      nome: 'Sampa Ensina'
      texto: 'Plataforma aberta de capacitação online com cursos gratuitos e trilhas de aprendizagem para empreendedores.'
      link: '' # TODO-LINK
    - id: gestao-sampa
      nome: 'Gestão Sampa'
      texto: 'Sistema de gestão empresarial para o gerenciamento completo do negócio com informações sincronizadas e automatizadas.'
      link: '' # TODO-LINK
    - id: data-sampa
      nome: 'Data Sampa'
      texto: 'Ferramenta de inteligência de dados com mapas interativos, dashboards, story maps e imagens de satélite recentes e históricas.'
      link: '' # TODO-LINK

praca:
  etiqueta: 'Espaço público'
  titulo: 'Praça Victor Civita'
  texto: 'Um espaço dedicado à sustentabilidade, educação ambiental e cultura na zona oeste da cidade. Gerido para fomentar economia verde e integração comunitária.'
  funcionamento: { titulo: 'Funcionamento', texto: "Todos os dias,\ndas 6h às 18h." }
  localizacao: { titulo: 'Localização', texto: "Rua Sumidouro, 580.\nPinheiros, São Paulo." }
  botao: { texto: 'Ver programação completa', link: '' } # TODO-LINK
  fotos:
    - imagem: ../../assets/fotos/praca-victor-civita.jpg
      alt: 'Vista aérea da Praça Victor Civita, com deques de madeira, canteiros verdes e árvores.'
---
