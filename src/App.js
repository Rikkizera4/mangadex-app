import React, { useState } from "react";
import "./App.css";

function App() {
  const [termo, setTermo] = useState("");
  const [mangas, setMangas] = useState([]);

  const buscarMangas = async () => {
    if (!termo) return;

    const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(termo)}&limit=10&includes[]=cover_art`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (dados.data) {
      const mangasComCapa = dados.data.map((manga) => {
        const { id, attributes, relationships } = manga;

        const titulo = attributes.title.en || "Sem título";
        const descricao = attributes.description.en || "Sem descrição";

        const capa = relationships.find((rel) => rel.type === "cover_art");
        const filename = capa ? capa.attributes.fileName : null;

        const urlCapa = filename
          ? `https://uploads.mangadex.org/covers/${id}/${filename}`
          : null;

        return {
          id,
          titulo,
          descricao,
          urlCapa,
        };
      });

      setMangas(mangasComCapa);
    } else {
      setMangas([]);
    }
  };

  return (
    <div className="App">
      <h1>Busca MangaDex</h1>
      <input
        type="text"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Digite o nome do mangá"
      />
      <button onClick={buscarMangas}>Buscar</button>

      <div className="resultados">
        {mangas.map((manga) => (
          <div key={manga.id} className="manga">
            <h2>{manga.titulo}</h2>
            {manga.urlCapa && (
              <img src={manga.urlCapa} alt={manga.titulo} width="150" />
            )}
            <p>{manga.descricao.slice(0, 200)}...</p>
            <a
              href={`https://mangadex.org/title/${manga.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no MangaDex
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
