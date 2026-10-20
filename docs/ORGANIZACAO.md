# Organização do código

A pasta frontend reúne a interface independente. A pasta src reúne o código do servidor. O objetivo é encontrar cada responsabilidade sem misturar cadastro de produtos, eventos de tela e autenticação.

## Mudanças desta revisão

- Catálogo, ofertas, referências e especificações físicas separados em frontend/dados.
- Estilos em frontend/css e texturas em frontend/img.
- Arquivo principal dividido em utilitarios.js, comparador.js, montador.js e iniciar.js. Não foram adicionados framework, bibliotecas ou novas dependências.
- Inicialização permanece no final do HTML para respeitar a ordem dos dados e funções.
- Rotas, logs, banco e integrações agrupados em src. O suporte a src/app foi conferido no compilador instalado.
- Todos os testes agora ficam em tests; base.cjs fornece o DOM simulado compartilhado.
- Indentação e quebras de linha padronizadas nos arquivos da aplicação e dos testes. Comentários explicam as responsabilidades sem repetir cada operação.
- A sincronização limpa a pasta public, que é gerada exclusivamente pelo script, para não publicar arquivos com os caminhos antigos.
- As configurações de hospedagem da raiz e os arquivos de build foram preservados: removê-los impediria o painel e a publicação.

## Verificação

A suíte completa, TypeScript, compilação e testes de segurança locais passaram. Os 21 arquivos públicos foram conferidos, os links locais do HTML foram resolvidos e os caminhos antigos não aparecem no artefato. O build reconheceu as rotas /, /api/eventos, o painel e os caminhos desconhecidos.

Não houve nova auditoria de versões: as dependências e os dois alertas de desenvolvimento documentados na revisão anterior permanecem iguais. Não foi possível realizar conferência visual em navegador nesta rodada.

## Aplicar na cópia do VS Code

A atualização pode ser entregue como patch Git. Ele altera e move os arquivos sem substituir a pasta .git. Antes de aplicar, confirme que suas alterações estão salvas em um commit. Use primeiro git apply --check e só depois git apply --index com o arquivo fornecido. Se a checagem indicar conflito, não force: compare a versão local antes de continuar.

Após aplicar, revise as alterações no VS Code, faça um commit e envie ao GitHub. O ZIP completo contém a mesma estrutura e serve como cópia de consulta; copiar seus arquivos por cima da versão antiga não remove arquivos que mudaram de pasta.
