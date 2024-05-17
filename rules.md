arquitetura: 
  Organize o código em camadas;:
    - separe js de ts;
    - separe o sistema de design das lógicas de negócio;
    - simplifique o código usando fachadas;
  ```export default``` apenas para o que for extritamente necessário (i.e. exigências do next)
  

ui: 
  - separar elementos por arquivo
  - criar elementos básico sem estivos, mas com a lógica
    -> objetivo: encapsular/concentrar a camada de estilização em um ponto só

hooks:
  - definição dentro do escopo do projeto: 
    # Os hooks são usados como máquinas que, ao acoplar com outras máquinas, geram um fluxo de dados.
    # O provedor do sistema (e.g. EditorProvider) é acompanhado por um hook (e.g. useEditor) que fornece o estado mais geral do sistema. 
    # Os hooks subsequentes são máquinas especialistas que manipulas uma parcela específica dos dados do hook geral (e.g. useEditor):
    # e.g. usePreprocess <- não tem seu próprio useReducer
    # e.g. useCanvas <- tem seu próprio useReducer
    # e.g. useInstructions <- tem seu próprio useReducer
  - regras: 
    1 - dê preferência para o uso de useReducer em detrimentos do useState
      1.1 - o useReducer recebe como valor inicial uma parcela de dados de outro hook mais geral; 
    2 - o hook que contém useReducer não deve espalhar para o sistema diretamente seu dispatch; 
      2.1 - nesse caso, crie funções no hook que executam os dispatch internamente e forneça essas funções como interface;
        NOTA: O sistema fica extremamente poluido quando exitem diferentes dispatch, 
              O código se torna cada vez mais poluido/ilegível e difícil de manter.
              Assim, funções com fachadas/interface são uma boa prática para manter o código mais limpo e simples
      

