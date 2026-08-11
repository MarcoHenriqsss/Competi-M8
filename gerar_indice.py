import os
import json
from urllib.parse import quote

PASTA_MANUAIS = "public/Manuais M8"
ARQUIVO_SAIDA = "public/indice.json"

indice = []

for categoria in sorted(os.listdir(PASTA_MANUAIS)):
    pasta_categoria = os.path.join(PASTA_MANUAIS, categoria)

    if not os.path.isdir(pasta_categoria):
        continue

    artigos = []

    for arquivo in sorted(os.listdir(pasta_categoria)):
        extensao = os.path.splitext(arquivo)[1].lower()

        if extensao not in [".html", ".pdf"]:
            continue

        titulo = os.path.splitext(arquivo)[0]

        tipo = "pdf" if extensao == ".pdf" else "html"

        artigos.append({
            "titulo": titulo,
            "arquivo": f"Manuais M8/{categoria}/{arquivo}",
            "tipo": tipo
        })

    if artigos:
        indice.append({
            "categoria": categoria,
            "artigos": artigos
        })

with open(ARQUIVO_SAIDA, "w", encoding="utf-8") as f:
    json.dump(
        indice,
        f,
        ensure_ascii=False,
        indent=4
    )

print("✅ Índice criado com sucesso!")
print(f"Categorias: {len(indice)}")
print(f"Arquivo gerado: {ARQUIVO_SAIDA}")