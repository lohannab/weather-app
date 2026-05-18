# 🌤️ Weather App

![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

Aplicação web de clima em tempo real desenvolvida com HTML5, CSS3 e JavaScript moderno (ES Modules), utilizando a API pública do **Open-Meteo** para consultar dados meteorológicos de cidades do mundo inteiro.

O usuário pode pesquisar uma cidade e visualizar informações climáticas de forma rápida, simples e com uma interface responsiva.

---

## 🌍 Demonstração

Acesse o projeto online e teste agora mesmo:  
👉 **[Weather App no Vercel](https://weather-app-lovat-beta-91.vercel.app/)**

---

## 🚀 Funcionalidades

- 🔍 **Busca Dinâmica:** Pesquise o clima em tempo real por nome da cidade.
- 📊 **Informações Práticas:** Exibição clara do nome da cidade, país e temperatura atual em graus Celsius (°C).
- ⏳ **Experiência do Usuário (UX):** Indicador de carregamento (*spinner*) visual enquanto os dados são processados.
- ⚠️ **Tratamento de Erros:** Mensagens amigáveis caso a cidade não seja encontrada ou ocorra uma falha de conexão.
- 🔁 **Sem Recarregamento:** Suporte a múltiplas consultas consecutivas sem recarregar a página (comportamento Single Page).

---

## 🛠️ Tecnologias e Recursos

- **Frontend:** HTML5 estrutural, CSS3 para estilização moderna e JavaScript (ES6+).
- **Modularização:** ES Modules (`import`/`export`) para manter o código limpo, reaproveitável e isolado.
- **APIs Consumidas:**
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (para converter o nome da cidade em coordenadas geográficas).
  - [Open-Meteo Weather API](https://open-meteo.com/en/docs) (para retornar a temperatura exata com base na latitude e longitude).

---

## 📁 Estrutura do Projeto

O projeto foi estruturado seguindo boas práticas de separação de responsabilidades (Clean Code):

```txt
weather-app/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── api/
    │   ├── geocodingService.js
    │   └── weatherService.js
    └── ui/
        └── renderWeather.js

```
⚙️ Como Executar o Projeto Localmente
```Pré-requisitos
Como este projeto utiliza ES Modules nativos do JavaScript, o navegador bloqueia requisições locais via protocolo file:// devido a políticas de CORS. É obrigatório rodar a aplicação através de um servidor local.

Passo a Passo
Clone o repositório:

Bash
git clone [https://github.com/lohannab/weather-app](https://github.com/lohannab/weather-app)
Acesse a pasta do projeto:

Bash
cd weather-app
Inicie um servidor local:

No VS Code, clique com o botão direito no arquivo index.html e selecione Open with Live Server.

Alternativa via Node.js: instale o pacote http-server globalmente e execute npx http-server no terminal.
```
💡 Aprendizados e Evolução Técnica
Este projeto foi fundamental para consolidar conceitos essenciais de desenvolvimento front-end moderno:

Consumo de APIs REST: Entendimento prático de requisições HTTP, parâmetros de busca (query params) e manipulação de payloads JSON.

Assincronismo no JavaScript: Aplicação robusta de async/await e tratamento de fluxos assíncronos de forma elegante.

Tratamento de Exceções: Uso estratégico de blocos try/catch para interceptar falhas de rede e erros de geolocalização, evitando que o app trave.

Arquitetura Modular: Divisão do código em serviços de API separados da camada de renderização visual (UI), facilitando futuras expansões ou manutenções.

**Desenvolvido com 💻 por Lohanna B.**
