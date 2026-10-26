# siteestamparia

## Configurar o banco Supabase

1. Crie um projeto no Supabase.
2. Abra `supabase.sql` no SQL Editor do projeto e execute o script.
3. Em `site001/js/supabase-config.js`, preencha `SUPABASE_URL` e `SUPABASE_ANON_KEY` com os valores de **Project Settings > API**. Use somente a chave pública `anon`/publishable no site. Nunca coloque `service_role` no JavaScript.
4. Publique os arquivos da pasta `site001` em um servidor HTTPS e atualize/reabra o site para o service worker baixar a versão nova.

O SQL mantém o acesso público usado pelo login atual, que é validado apenas no navegador. Assim, quem descobrir o endereço do projeto e a chave pública poderá ler, criar e excluir pedidos. Para um site publicado na internet, o próximo passo de segurança é integrar o login ao Supabase Auth e restringir as policies de `pedidos` a usuários autenticados.
