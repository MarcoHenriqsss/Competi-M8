import os
import re

PASTA_MANUAIS = os.path.join("public", "Manuais M8")

contador = 0

for raiz, pastas, arquivos in os.walk(PASTA_MANUAIS):

    for nome_arquivo in arquivos:

        if not nome_arquivo.lower().endswith(".html"):
            continue

        caminho = os.path.join(raiz, nome_arquivo)

        with open(caminho, "r", encoding="utf-8") as arquivo:
            html = arquivo.read()

        # ==================================================
        # CORRIGE O CSS
        # ==================================================

        # Remove qualquer referência antiga ao estilo.css
        html = re.sub(
            r'<link[^>]*href=["\'][^"\']*estilo\.css["\'][^>]*>',
            '',
            html,
            flags=re.IGNORECASE
        )

        # Adiciona caminho absoluto correto para o Vite
        html = html.replace(
            "</head>",
            '    <link rel="stylesheet" href="/templates/estilo.css">\n</head>'
        )

        # ==================================================
        # CORRIGE A LOGO DA COMPETI
        # ==================================================

        html = html.replace(
            "../../assets/competi.jpg",
            "/assets/competi.jpg"
        )

        html = html.replace(
            "../assets/competi.jpg",
            "/assets/competi.jpg"
        )

        html = html.replace(
            "assets/competi.jpg",
            "/assets/competi.jpg"
        )

        # Evita //assets
        html = html.replace(
            "//assets/competi.jpg",
            "/assets/competi.jpg"
        )

        # ==================================================
        # SALVA
        # ==================================================

        with open(caminho, "w", encoding="utf-8") as arquivo:
            arquivo.write(html)

        contador += 1
        print(f"✔ {nome_arquivo}")

print()
print("=" * 50)
print(f"{contador} manuais corrigidos!")
print("=" * 50)