import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone


def fetch_webpage(source_web, timeout=25):
    # Header untuk mengidentifikasi klien yang melakukan request.
    headers = {
        "User-Agent": "ClimateChangeRAGPrototype/0.1 (educational use)"
    }

    # Mengambil halaman web. Timeout mencegah request menunggu tanpa batas.
    response = requests.get(
        source_web["url"],
        headers=headers,
        timeout=timeout
    )

    # Hentikan proses jika server mengembalikan status HTTP error.
    response.raise_for_status()

    # Mengubah HTML mentah menjadi struktur yang bisa ditelusuri.
    soup = BeautifulSoup(response.text, "html.parser")

    # Hapus elemen yang biasanya tidak dibutuhkan sebagai isi artikel.
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg"]):
        tag.decompose()

    # Prioritaskan konten utama; gunakan fallback jika tag tidak tersedia.
    main = soup.find("main") or soup.find("article") or soup.body or soup

    # Ambil teks, pecah menjadi baris, buang baris kosong, dan gabungkan lagi.
    extracted_text = "\\n".join(
        line.strip()
        for line in main.get_text("\\n").splitlines()
        if line.strip()
    )

    # Kembalikan metadata sumber + teks yang berhasil diekstrak + waktu pengambilan.
    return {
        **source_web,
        "text": extracted_text,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
    }


def fetch_all_webpages(source_web):
   
    # Mengambil teks dari setiap URL pada Database url_source.
    # Returns:
    #     raw_documents: list berisi dictionary untuk setiap halaman yang berhasil diambil.
   
    raw_documents = []
    # Menggunakan to_dict(orient="records") agar setiap baris menjadi dictionary.
    #cari di supabase
    for s in source_web.to_dict(orient="records"):
        try:
            doc = fetch_webpage(s)
            print(
                f"OK: {doc.get('publisher')} — "
                f"{doc.get('source_title', 'No Title')} — "
                f"{len(doc['text'])} karakter"
            )
            raw_documents.append(doc)
        except Exception as exc:
            print(
                f"SKIP: {s.get('url', 'No URL')} — "
                f"{type(exc).__name__}: {exc}"
            )

    print("Jumlah halaman berhasil diambil:", len(raw_documents))
    return raw_documents

