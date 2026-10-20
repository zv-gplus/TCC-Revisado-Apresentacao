"""Sondagem limitada apenas do Site autorizado; interrompe ao receber bloqueio de borda."""
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
BASE = 'https://ntj-builder-apresentacao-1019.civilmacaw9.chatgpt.site'
PANEL = '/gestao-ntj-7f42b9c1'
results=[]
def probe(path, headers=None, data=None):
    try:
        with urlopen(Request(BASE+path,headers=headers or {},data=data),timeout=15) as r:
            status=r.status;body=r.read(200000).decode(errors='replace')
    except HTTPError as error:
        status=error.code;body=error.read(200000).decode(errors='replace')
    except URLError:
        results.append({'path':path,'result':'falha de conexão; inconclusivo'})
        return None
    blocked=status==403 and '1010' in body
    row={'path':path,'status':status,'edgeBlocked':blocked}
    # Guarda somente marcadores; nunca conteúdo dos registros ou credenciais.
    if path.startswith(PANEL):
        row['panelDataVisible']='Registros do site' in body and '<table' in body
        row['restrictedMessage']='Somente a conta autorizada' in body
    results.append(row)
    return None if blocked else status
if probe('/') is not None:
    for target in [PANEL,PANEL+'?tipo=uso&admin=true','/.env','/.git/config','/backup.sql','/.openai/hosting.json','/server/logs.ts']:
        if probe(target) is None:break
    else:
        probe('/api/eventos',{'Origin':'https://outro.test','Content-Type':'application/json'},b'{"type":"uso","code":"abrir_site"}')
report={'environment':'HTTPS da hospedagem pública','maxRequests':10,'requestsSent':len(results),'results':results,'identityForgery':'não ensaiada: exige acesso à aplicação e tratamento confirmado da identidade na borda'}
Path('resultado-http-publico.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
