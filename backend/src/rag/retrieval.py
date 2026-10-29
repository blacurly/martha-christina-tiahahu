
import re
from functools import lru_cache

from rank_bm25 import BM25Okapi

from .indexing import get_collection
from .embedding import embed_query


# ==========================================
# TOKENISASI TEKS
# ==========================================

def tokenize(text: str) -> list[str]:
    """
    Tokenisasi sederhana untuk teks Bahasa Indonesia.
    Mengubah teks menjadi huruf kecil dan memisahkan kata.
    """
    return re.findall(r"\b\w+\b", (text or "").lower())


# ==========================================
# INDEKS BM25
# ==========================================

@lru_cache(maxsize=1)
def _get_bm25_index(collection_count: int):
    """
    Membuat indeks BM25 dari seluruh dokumen ChromaDB.
    Indeks disimpan dalam cache agar tidak dibuat ulang
    pada setiap pertanyaan.

    Perubahan collection_count memicu pembuatan indeks ulang.
    """
    collection = get_collection()

    if collection_count == 0:
        return None

    stored = collection.get(
        include=["documents", "metadatas"]
    )

    ids = stored.get("ids", [])
    documents = stored.get("documents", []) or []
    metadatas = stored.get("metadatas", []) or []

    records = []

    for i, doc_id in enumerate(ids):
        text = documents[i] if i < len(documents) else None

        if not text:
            continue

        metadata = (
            metadatas[i]
            if i < len(metadatas) and metadatas[i]
            else {}
        )

        records.append({
            "id": doc_id,
            "text": text,
            "metadata": metadata,
        })

    if not records:
        return None

    tokenized_documents = [
        tokenize(record["text"])
        for record in records
    ]

    bm25 = BM25Okapi(tokenized_documents)

    return records, bm25


# ==========================================
# HYBRID RETRIEVAL: BM25 + VECTOR + RRF
# ==========================================

def retrieve_context(
    question: str,
    top_k: int = 4,
    rrf_k: int = 60,
):
    """
    Mengambil konteks dengan Hybrid Retrieval:
    1. BM25
    2. Vector Search ChromaDB
    3. Reciprocal Rank Fusion (RRF)

    Return berupa list dictionary yang berisi teks,
    sumber, metadata, dan skor retrieval.
    """
    if not question or not question.strip() or top_k <= 0:
        return []

    collection = get_collection()
    collection_count = collection.count()

    if collection_count == 0:
        return []

    # Ambil indeks BM25 yang tersimpan dalam cache
    bm25_index = _get_bm25_index(collection_count)

    if bm25_index is None:
        return []

    records, bm25 = bm25_index

    # Jumlah kandidat dari masing-masing retriever.
    # Lebih banyak kandidat memberi RRF ruang untuk
    # menemukan dokumen yang cocok di kedua jalur.
    candidate_k = min(max(top_k * 3, top_k), collection_count)

    # ------------------------------------------
    # JALUR 1: BM25
    # ------------------------------------------

    query_tokens = tokenize(question)
    bm25_scores = bm25.get_scores(query_tokens)

    bm25_indices = sorted(
        range(len(bm25_scores)),
        key=lambda i: bm25_scores[i],
        reverse=True,
    )[:min(candidate_k, len(bm25_scores))]

    bm25_results = []

    for rank, idx in enumerate(bm25_indices, start=1):
        score = float(bm25_scores[idx])

        # Abaikan hasil yang tidak memiliki kecocokan kata
        if score <= 0:
            continue

        record = records[idx]

        bm25_results.append({
            **record,
            "rank_bm25": rank,
            "score_bm25": score,
        })

    # ------------------------------------------
    # JALUR 2: VECTOR SEARCH CHROMADB
    # ------------------------------------------

    vector_results = []

    query_embedding = embed_query(question)

    vector_output = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(candidate_k, collection_count),
        include=[
            "documents",
            "metadatas",
            "distances",
        ],
    )

    ids = (vector_output.get("ids") or [[]])[0]
    docs = (vector_output.get("documents") or [[]])[0]
    metas = (vector_output.get("metadatas") or [[]])[0]
    distances = (vector_output.get("distances") or [[]])[0]

    for rank, (doc_id, text, metadata, distance) in enumerate(
        zip(ids, docs, metas, distances),
        start=1,
    ):
        if not text:
            continue

        vector_results.append({
            "id": doc_id,
            "text": text,
            "metadata": metadata or {},
            "rank_vector": rank,
            "distance_vector": float(distance),
        })

    # ------------------------------------------
    # JALUR 3: RECIPROCAL RANK FUSION (RRF)
    # ------------------------------------------

    rrf_scores = {}
    result_lookup = {}

    for result in bm25_results:
        doc_id = result["id"]

        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (
            1.0 / (rrf_k + result["rank_bm25"])
        )

        result_lookup.setdefault(doc_id, {}).update(result)

    for result in vector_results:
        doc_id = result["id"]

        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (
            1.0 / (rrf_k + result["rank_vector"])
        )

        # Gabungkan informasi dari kedua jalur tanpa
        # menghilangkan skor BM25 yang sudah tersedia.
        result_lookup.setdefault(doc_id, {}).update(result)

    ranked_ids = sorted(
        rrf_scores,
        key=lambda doc_id: rrf_scores[doc_id],
        reverse=True,
    )

    # ------------------------------------------
    # HASIL AKHIR
    # ------------------------------------------

    final_context = []

    for doc_id in ranked_ids[:top_k]:
        result = result_lookup[doc_id].copy()
        metadata = result.get("metadata") or {}

        result["rrf_score"] = rrf_scores[doc_id]

        # Kompatibilitas dengan kode lama
        result["source"] = metadata.get(
            "source_url",
            metadata.get("source", "dokumen"),
        )

        final_context.append(result)

    return final_context
