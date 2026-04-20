import {
  collection,
  addDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Saves a complete movie (filme) and its scenes (cenas) to Firestore
 * in a single batched transaction.
 *
 * @param {object} filmeData - The movie fields (titulo, pais, ano, etc.)
 * @param {Array}  cenas     - Array of scene objects to be batch-written as sub-collection
 * @param {string} ownerId   - UID of the authenticated administrator performing the write
 * @returns {string} The new Firestore document ID for the created movie
 */
export async function salvarFilmeCompleto(filmeData, cenas, ownerId) {
  const allPalavrasChave = cenas.reduce((acc, cena) => {
    cena.palavrasChave.forEach((palavra) => {
      if (!acc.includes(palavra)) acc.push(palavra);
    });
    return acc;
  }, []);

  const filmeParaSalvar = {
    ...filmeData,
    ano: Number(filmeData.ano),
    duracao: Number(filmeData.duracao),
    ownerId,
    dataCadastro: serverTimestamp(),
    palavrasChave: allPalavrasChave,
  };

  const docRef = await addDoc(collection(db, "filmes"), filmeParaSalvar);
  const filmeId = docRef.id;

  if (cenas.length > 0) {
    const batch = writeBatch(db);
    cenas.forEach((cena) => {
      const cenaRef = doc(collection(db, "filmes", filmeId, "cenas"));
      // eslint-disable-next-line no-unused-vars
      const { idTemp, ...dadosCena } = cena;
      batch.set(cenaRef, dadosCena);
    });
    await batch.commit();
  }

  return filmeId;
}

/**
 * Saves a lesson plan (aula) to Firestore.
 *
 * @param {object} aulaData        - The lesson fields
 * @param {Array}  cenasSelecionadas - Array of selected scenes with filmeId & cenaId
 * @param {string} ownerId          - UID of the authenticated administrator performing the write
 * @returns {string} The new Firestore document ID for the created lesson
 */
export async function salvarAula(aulaData, cenasSelecionadas, ownerId) {
  const cenasParaSalvar = cenasSelecionadas.map((c) => ({
    filmeId: c.filmeId,
    cenaId: c.cenaId,
  }));

  const filmesIdsUnicos = [
    ...new Set(cenasSelecionadas.map((c) => c.filmeId)),
  ];

  const aulaParaSalvar = {
    ...aulaData,
    ownerId,
    createdAt: serverTimestamp(),
    cenas: cenasParaSalvar,
    filmesIds: filmesIdsUnicos,
    qtdCenas: cenasSelecionadas.length,
    filmeId: filmesIdsUnicos[0] || null,
    filmeTitulo:
      filmesIdsUnicos.length > 1
        ? "Vários Filmes"
        : cenasSelecionadas[0]?.filmeTitulo || "",
  };

  const docRef = await addDoc(collection(db, "aulas"), aulaParaSalvar);
  return docRef.id;
}
