import { useEffect, useMemo, useState } from "react";

function App() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [busca, setBusca] = useState("");
  const [manualAtual, setManualAtual] = useState(null);

  useEffect(() => {
    fetch("/indice.json")
      .then((res) => res.json())
      .then((dados) => {
        setCategorias(dados);

        if (dados.length > 0) {
          setCategoriaAtiva(dados[0].categoria);
        }
      })
      .catch((erro) => {
        console.error("Erro ao carregar indice.json:", erro);
      });
  }, []);

  const categoriaSelecionada = categorias.find(
    (item) => item.categoria === categoriaAtiva
  );

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    // Sem pesquisa: mostra apenas a categoria selecionada
    if (!termo) {
      if (!categoriaSelecionada) return [];

      return categoriaSelecionada.artigos.map((artigo) => ({
        ...artigo,
        categoria: categoriaSelecionada.categoria,
      }));
    }

    // Com pesquisa: busca em TODAS as categorias
    return categorias.flatMap((categoria) =>
      categoria.artigos
        .filter((artigo) =>
          artigo.titulo.toLowerCase().includes(termo)
        )
        .map((artigo) => ({
          ...artigo,
          categoria: categoria.categoria,
        }))
    );
  }, [categorias, categoriaSelecionada, busca]);

  function montarCaminho(caminho) {
    return (
      "/" +
      caminho
        .split("/")
        .map((parte) => encodeURIComponent(parte))
        .join("/")
    );
  }

  function abrirManual(artigo) {
  const url = montarCaminho(artigo.arquivo);

  const isMobile = window.innerWidth <= 800;

  if (artigo.tipo === "pdf" && isMobile) {
    window.open(url, "_blank");
    return;
  }

  setManualAtual({
    titulo: artigo.titulo,
    url,
    tipo: artigo.tipo || "html",
  });
}

  function voltar() {
    setManualAtual(null);
  }

  function baixarPDF() {
    const iframe = document.getElementById("manual-frame");

    if (!iframe) return;

    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (erro) {
      console.error("Erro ao imprimir:", erro);

      window.open(manualAtual.url, "_blank");
    }
  }

  return (
    <div className="app">
      <header className="topo">
        <div className="marca">
          <img
            src="/assets/competi.jpg"
            alt="Competi"
            className="logo"
          />

          <div>
            <h1>Competi Sistemas</h1>
            <p>Documentação do M8 ERP</p>
          </div>
        </div>

        {!manualAtual && (
          <input
            type="text"
            placeholder="Pesquisar manual..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pesquisa"
          />
        )}
      </header>

      {manualAtual ? (
        <main className="visualizador">
          <div className="barra-manual">
            <button
              className="botao-voltar"
              onClick={voltar}
            >
              ← Voltar
            </button>

            <div className="titulo-manual-aberto">
              <span>Manual</span>
              <strong>{manualAtual.titulo}</strong>
            </div>

            <button
              className="botao-pdf"
              onClick={baixarPDF}
            >
              ↓ Baixar PDF
            </button>
          </div>

          <div className="iframe-container">
            <iframe
              id="manual-frame"
              src={manualAtual.url}
              title={manualAtual.titulo}
              className="manual-frame"
            />
          </div>
        </main>
      ) : (
        <div className="layout">
          <aside className="sidebar">
            <h2>Categorias</h2>

            <div className="lista-categorias">
              {categorias.map((item) => (
                <button
                  key={item.categoria}
                  className={
                    categoriaAtiva === item.categoria
                      ? "categoria ativa"
                      : "categoria"
                  }
                  onClick={() => {
                    setCategoriaAtiva(item.categoria);
                    setBusca("");

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <span>{item.categoria}</span>

                  <small>
                    {item.artigos.length}
                  </small>
                </button>
              ))}
            </div>
          </aside>

          <main className="conteudo">
            <div className="cabecalho-conteudo">
              <div>
                <span className="tag">
                  M8 ERP
                </span>

                <h2>
                  {busca.trim()
                    ? `Resultados para "${busca}"`
                    : categoriaAtiva || "Manuais"}
                </h2>

                <p>
                  {artigosFiltrados.length}{" "}
                  {artigosFiltrados.length === 1 ? "manual" : "manuais"}
                </p>
              </div>
            </div>

            <div className="lista-manuais">
              {artigosFiltrados.length > 0 ? (
                artigosFiltrados.map((artigo) => (
                  <button
                    key={artigo.arquivo}
                    className="card-manual"
                    onClick={() =>
                      abrirManual(artigo)
                    }
                  >
                    <div>
                      <span className="icone">
                        {artigo.tipo === "pdf" ? "📕" : "📄"}
                      </span>
                    </div>

                    <div className="info-manual">
                      <h3>
                        {artigo.titulo}
                      </h3>

                      <p>
                        {artigo.tipo === "pdf"
                          ? "PDF • Clique para visualizar"
                          : "Clique para visualizar"}
                      </p>
                    </div>

                    <span className="seta">
                      →
                    </span>
                  </button>
                ))
              ) : (
                <div className="vazio">
                  Nenhum manual encontrado.
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;