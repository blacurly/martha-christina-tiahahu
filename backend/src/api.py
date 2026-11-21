import logging
import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.rag.hybrid_retriever import HybridRetriever
from src.rag.generation import generate_answer
from src.rag.gemini_client import translate_to_english
from src.rag.refleksi_refactor import refleksi_tracker


app = FastAPI(title="Climate Change RAG API")
retriever = HybridRetriever()

logger = logging.getLogger(__name__)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4000",
        "http://127.0.0.1:3000",
        "https://sycle-eta.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class ChatRequest(BaseModel):
    message: str


class Iklim(BaseModel):
    label: str
    value: float | str
    unit: str | None = None


class Catatan(BaseModel):
    kondisi: str = Field(min_length=1, max_length=100)

    gejala: list[str] = Field(default_factory=list, max_length=30)

    iklim: list[Iklim] = Field(default_factory=list, max_length=10)

    cerita: str = Field(default="", max_length=2000)

    generatedSummary: dict | None = None

    answers: dict = Field(default_factory=dict)

    scores: dict = Field(default_factory=dict)


class RefleksiRequest(BaseModel):
    catatan: Catatan

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    errors = []

    for error in exc.errors():
        if (
            error["type"] == "string_too_long"
            and "cerita" in error["loc"]
        ):error["msg"] = "Cerita terlalu panjang, lebih dari 200 karakter"

        elif (
            error["type"] == "too_long"
            and "gejala" in error["loc"]
        ):error["msg"] = "Gejala Terlalu banyak, lebih dari 30 item"

        elif (
            error["type"] == "missing"
            and error["loc"] 
        ):error["msg"] = "Request body wajib diisi"

        elif (
            error["type"] == "model_attributes_type"
            and error["loc"] 
        ):error["msg"] = "Format JSON tidak Valid"

        errors.append({
            "type": error["type"],
            "loc": error["loc"],
            "msg": error["msg"],
            "input": error.get("input")
        })

    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )


# =========================================================
# TOPIC MAPPING
# =========================================================

TOPIK_IKLIM = {
    "panas": "paparan panas",
    "suhu": "paparan panas suhu tinggi",
    "kelembapan": "kelembapan panas",
    "udara": "polusi udara kualitas udara",
    "uv": "radiasi UV",
}


TOPIK_KONDISI = {
    "menstruasi": [
        "menstrual_health",
        "menstrual_heat",
        "menstrual_thermoregulation",
    ],
    "hamil": [
        "pregnancy_heat",
        "pregnancy_air_pollution",
    ],
    "kehamilan": [
        "pregnancy_heat",
        "pregnancy_air_pollution",
    ],
    "menyusui": [
        "breastfeeding_general",
        "breastfeeding_heat",
        "breastfeeding_climate",
    ],
    "lewati": [],
}


TOPIK_LINGKUNGAN = {
    "panas": [
        "heat_health",
        "heat_index_method",
        "heat_exertion_women",
    ],
    "suhu": [
        "heat_health",
        "heat_index_method",
        "heat_exertion_women",
    ],
    "kelembapan": [
        "heat_health",
        "heat_exertion_women",
    ],
    "udara": [
        "pm25_health",
        "ispu_categories",
    ],
    "uv": [
        "uv_health",
    ],
}


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {"status": "ok"}


# =========================================================
# GENERAL RAG CHAT
# =========================================================

@app.post("/chat")
def chat(payload: ChatRequest):
    question = payload.message.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Pertanyaan tidak boleh kosong",
        )

    try:
        english = translate_to_english(question, os.getenv("GEMINI_API_KEY"))
        contexts = retriever.hybrid_retrieve(
            question,
            top_k=4,
            extra_queries=[english] if english else None,
        )

        answer = generate_answer(question, contexts)

        return {
            "answer": answer,
            "sources": sorted({
                item["source"] for item in contexts
            }),
        }

    except Exception as exc:
        logger.exception("Gagal memproses /chat")

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# =========================================================
# QUERY BUILDER
# =========================================================

# Kode jawaban Health Tracker -> kata kunci Inggris, karena evidence
# sebagian besar berbahasa Inggris. Kode mentah (HT-01, sangat_nyaman)
# tidak ada di teks evidence sehingga hanya menjadi noise pencarian.
KATA_KUNCI_KONDISI = {
    "kehamilan": "pregnancy pregnant women heat",
    "hamil": "pregnancy pregnant women heat",
    "menstruasi": "menstruation menstrual period heat",
    "menyusui": "breastfeeding lactation hot weather",
}

KATA_KUNCI_JAWABAN = {
    "sakit_kepala": "headache",
    "pusing": "dizziness",
    "mual": "nausea",
    "lelah": "fatigue weakness tired",
    "merasa_kepanasan": "overheating hot sweating heat",
    "kram_otot": "muscle cramps",
    "mata_perih": "eye irritation",
    "batuk_tenggorokan_gatal": "cough throat irritation",
    "sulit_tempat_sejuk": "cool place shade cooling",
    "sulit_tempat_nyaman": "comfortable place cooling",
    "sulit_air_minum": "drinking water hydration dehydration",
    "akses_air_terbatas": "drinking water hydration dehydration",
    "sulit_istirahat": "rest sleep breaks",
    "aktivitas_berat": "strenuous physical activity exertion",
    "lingkungan_panas": "hot environment heat",
    "bayi_menyusu_lebih_sering": "baby feeding more often",
    "luar_ruangan": "outdoors outside",
    "perjalanan": "travel commuting outside",
    "lebih_2_jam": "prolonged outdoor exposure",
    "1_2_jam": "outdoor exposure",
}


# Jawaban yang nilainya umum ("ya", "banyak", "sulit") baru bermakna bila
# dilihat bersama pertanyaannya. Tanpa ini, jawaban menstruasi dan menyusui
# tidak memengaruhi pencarian sehingga sumber (dan saran) selalu sama.
KATA_KUNCI_PER_PERTANYAAN = {
    ("HM-03", "banyak"): "heavy menstrual bleeding",
    ("HM-03", "sedikit"): "light menstrual bleeding",
    ("HM-04", "ya"): "menstrual pain cramps dysmenorrhea",
    ("HM-06", "sulit"): "menstrual hygiene toilet sanitation access",
    ("HM-06", "cukup"): "menstrual hygiene access",
    ("HS-02", "ya"): "breastfeeding discomfort",
}


def kata_kunci_per_pertanyaan(answers: dict) -> list[str]:
    hasil = []
    for kode, value in (answers or {}).items():
        values = value if isinstance(value, list) else [value]
        for v in values:
            kata = KATA_KUNCI_PER_PERTANYAAN.get((str(kode), str(v)))
            if kata:
                hasil.append(kata)
    # Nyeri haid yang cukup mengganggu (skala 2 ke atas).
    try:
        if int((answers or {}).get("HM-05", -1)) >= 2:
            hasil.append("severe period pain relief")
    except (TypeError, ValueError):
        pass
    return hasil


def query_kesehatan_catatan(c: Catatan) -> str:
    """Menyusun query untuk pencarian evidence kesehatan."""

    bagian = [
        KATA_KUNCI_KONDISI.get(c.kondisi.strip().lower(), c.kondisi),
    ]

    nilai = list(c.gejala)
    for value in c.answers.values():
        if isinstance(value, list):
            nilai.extend(str(item) for item in value)
        elif value is not None:
            nilai.append(str(value))

    for kode in nilai:
        kata = KATA_KUNCI_JAWABAN.get(kode)
        if kata and kata not in bagian:
            bagian.append(kata)

    for kata in kata_kunci_per_pertanyaan(c.answers):
        if kata not in bagian:
            bagian.append(kata)

    # Cerita pribadi tetap ikut sebagai konteks pengguna.
    if c.cerita.strip():
        bagian.append(c.cerita.strip())

    return " ".join(bagian)


def query_lingkungan_catatan(c: Catatan) -> str:
    """Menyusun query khusus pencarian evidence lingkungan."""

    bagian = []

    for item in c.iklim:
        label = item.label.lower()

        bagian.append(item.label)

        if item.value is not None:
            bagian.append(str(item.value))

        if item.unit:
            bagian.append(item.unit)

        for kunci, topik in TOPIK_IKLIM.items():
            if kunci in label:
                bagian.append(topik)

    return " ".join(bagian)


# =========================================================
# TOPIC SELECTOR
# =========================================================

def get_topik_kesehatan(kondisi):
    kondisi_normal = str(
        kondisi or ""
    ).strip().lower()

    return TOPIK_KONDISI.get(
        kondisi_normal,
        [],
    )


def get_topik_lingkungan(iklim):
    topik = []

    kata_kunci_topik = {
        "panas": ["panas", "heat"],
        "suhu": ["suhu", "temperature", "temperatur"],
        "kelembapan": ["kelembapan", "humidity"],
        "udara": [
            "udara",
            "aqi",
            "ispu",
            "pm2.5",
            "pm25",
            "partikulat",
        ],
        "uv": ["uv", "ultraviolet"],
    }

    for item in iklim:
        label = str(item.label or "").lower()

        for kategori, kata_kunci_list in kata_kunci_topik.items():
            if any(
                kata in label
                for kata in kata_kunci_list
            ):
                topik.extend(
                    TOPIK_LINGKUNGAN[kategori]
                )

    return list(dict.fromkeys(topik))


# =========================================================
# RELATED ARTICLES
# =========================================================

def artikel_terkait(contexts: list[dict]) -> list[dict]:
    """Mengumpulkan artikel tanpa duplikasi URL."""

    hasil = []
    terlihat = set()

    for item in contexts:
        meta = item.get("metadata") or {}

        url = meta.get("source_url")
        kunci = url or item.get("source")

        if not kunci or kunci in terlihat:
            continue

        terlihat.add(kunci)

        hasil.append({
            "title": meta.get("title") or item.get("source"),
            "url": url,
            "publisher": meta.get("publisher"),
        })

    return hasil


# =========================================================
# HEALTH TRACKER AI REFLECTION
# =========================================================

@app.post("/refleksi")
def buat_refleksi(payload: RefleksiRequest):
    catatan = payload.catatan

    if not catatan.kondisi.strip():
        raise HTTPException(
            status_code=400,
            detail="kondisi tidak boleh kosong",
        )

    try:
        # -------------------------------------------------
        # 1. RETRIEVAL KESEHATAN
        # -------------------------------------------------

        query_kesehatan = query_kesehatan_catatan(catatan)

        topik_kesehatan = get_topik_kesehatan(
            catatan.kondisi
        )

        contexts_kesehatan = []

        # Jangan melakukan pencarian tanpa filter topik.
        if query_kesehatan and topik_kesehatan:
            contexts_kesehatan = retriever.hybrid_retrieve(
                query_kesehatan,
                top_k=3,
                where="Tracker dan Personalisasi",
                topics=topik_kesehatan,
            )

        # -------------------------------------------------
        # 2. RETRIEVAL LINGKUNGAN
        # -------------------------------------------------

        query_lingkungan = query_lingkungan_catatan(catatan)

        topik_lingkungan = get_topik_lingkungan(
            catatan.iklim
        )

        contexts_lingkungan = []

        if query_lingkungan and topik_lingkungan:
            contexts_lingkungan = retriever.hybrid_retrieve(
                query_lingkungan,
                top_k=2,
                where="Tracker dan Personalisasi",
                topics=topik_lingkungan,
            )

        # -------------------------------------------------
        # 3. LOG RETRIEVAL
        # -------------------------------------------------

        logger.info(
            "Retrieval refleksi: kondisi=%s, "
            "topik_kesehatan=%s, topik_lingkungan=%s, "
            "kesehatan=%s, lingkungan=%s",
            catatan.kondisi,
            topik_kesehatan,
            topik_lingkungan,
            len(contexts_kesehatan),
            len(contexts_lingkungan),
        )

        for grup, daftar in [
            ("KESEHATAN", contexts_kesehatan),
            ("LINGKUNGAN", contexts_lingkungan),
        ]:
            for item in daftar:
                meta = item.get("metadata") or {}

                logger.info(
                    "EVIDENCE %s | title=%s | topik=%s | "
                    "source_code=%s | rrf=%s | distance=%s",
                    grup,
                    meta.get("title"),
                    meta.get("topik"),
                    item.get("source_code"),
                    item.get("rrf_score"),
                    item.get("distance"),
                )

        # -------------------------------------------------
        # 4. GABUNGKAN EVIDENCE TANPA DUPLIKASI CHUNK
        # -------------------------------------------------

        contexts = []
        seen_ids = set()

        for item in contexts_kesehatan + contexts_lingkungan:
            if item["id"] not in seen_ids:
                contexts.append(item)
                seen_ids.add(item["id"])

        # -------------------------------------------------
        # 5. GENERATE REFLEKSI
        # -------------------------------------------------

        refleksi = refleksi_tracker(
            catatan.model_dump(),
            contexts,
        )

        # -------------------------------------------------
        # 6. RELATED ARTICLES
        # -------------------------------------------------

        return {
            **refleksi,
            "relatedArticles": artikel_terkait(contexts),
        }

    except Exception as exc:
        logger.exception("Gagal memproses /refleksi")

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )