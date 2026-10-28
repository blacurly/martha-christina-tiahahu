export const educationArticles = [
  {
    slug: "panas-dan-tubuh",
    category: "Lingkungan",
    title: "Panas dan tubuh: mengapa cuaca panas perlu diperhatikan",
    summary:
      "Kenali suhu, kelembapan, dan kondisi lingkungan sebagai konteks saat beraktivitas.",
    status: "draft",
    sections: [
      {
        heading: "Memahami kondisi panas",
        paragraphs: [
          "Suhu udara dan kelembapan relatif dapat membantu menggambarkan kondisi panas di lingkungan.",
          "Informasi lingkungan merupakan konteks tambahan, bukan diagnosis atau penilaian kesehatan pribadi."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "kualitas-udara-dan-pm25",
    category: "Kualitas Udara",
    title: "Kualitas udara dan PM2.5",
    summary:
      "Mengenal partikel halus dan informasi kualitas udara untuk memahami lingkungan sekitar.",
    status: "draft",
    sections: [
      {
        heading: "Apa itu PM2.5?",
        paragraphs: [
          "PM2.5 adalah partikel halus di udara dengan diameter aerodinamis 2,5 mikrometer atau lebih kecil.",
          "Konsentrasi PM2.5 dan indeks kualitas udara adalah indikator yang berbeda. Keduanya tidak dapat dipertukarkan begitu saja."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "indeks-uv-dan-perlindungan-matahari",
    category: "Lingkungan",
    title: "Indeks UV dan perlindungan dari sinar matahari",
    summary:
      "Pahami arti indeks UV dan perannya sebagai informasi lingkungan.",
    status: "draft",
    sections: [
      {
        heading: "Mengenal indeks UV",
        paragraphs: [
          "Indeks UV menggambarkan tingkat radiasi ultraviolet dari matahari pada suatu kondisi dan waktu.",
          "Nilai indeks UV bukan ukuran langsung jumlah paparan yang diterima seseorang."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "menstruasi-suhu-tubuh-dan-cuaca-panas",
    category: "Kesehatan Perempuan",
    title: "Menstruasi, suhu tubuh, dan cuaca panas",
    summary:
      "Kenali informasi tentang perubahan pengaturan suhu tubuh sepanjang siklus menstruasi.",
    status: "draft",
    sections: [
      {
        heading: "Siklus menstruasi dan suhu tubuh",
        paragraphs: [
          "Pengaturan suhu tubuh dapat berubah sepanjang siklus menstruasi.",
          "Temuan penelitian tentang respons saat beraktivitas di lingkungan panas belum selalu konsisten. Catatan menstruasi dan kondisi lingkungan tidak cukup untuk menyimpulkan hubungan sebab-akibat pada keluhan seseorang."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "kehamilan-dan-cuaca-panas",
    category: "Kesehatan Perempuan",
    title: "Kehamilan dan cuaca panas",
    summary:
      "Pelajari hal-hal yang dapat dipertimbangkan saat menjalani aktivitas dalam kondisi panas selama kehamilan.",
    status: "draft",
    sections: [
      {
        heading: "Memperhatikan kondisi lingkungan",
        paragraphs: [
          "Selama kehamilan, memperhatikan suhu lingkungan, durasi aktivitas, akses air minum, dan kesempatan beristirahat dapat membantu perencanaan kegiatan.",
          "Informasi lingkungan merupakan konteks tambahan dan tidak menjelaskan secara pasti penyebab gejala tertentu."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "menyusui-saat-cuaca-panas",
    category: "Kesehatan Perempuan",
    title: "Menyusui saat cuaca panas",
    summary:
      "Kenali beberapa hal yang perlu diperhatikan ketika menyusui dalam kondisi cuaca panas.",
    status: "draft",
    sections: [
      {
        heading: "Kenyamanan saat menyusui",
        paragraphs: [
          "Kondisi lingkungan yang panas dapat menjadi pertimbangan dalam mengatur kenyamanan dan aktivitas sehari-hari.",
          "Kebutuhan setiap orang dapat berbeda. Informasi umum ini tidak menggantikan saran tenaga kesehatan sesuai kondisi individu."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  },
  {
    slug: "perubahan-iklim-dan-kesehatan-perempuan",
    category: "Kesehatan Perempuan",
    title: "Perubahan iklim dan kesehatan perempuan",
    summary:
      "Pahami hubungan lingkungan dan kesehatan perempuan tanpa menganggap kondisi lingkungan sebagai diagnosis pribadi.",
    status: "draft",
    sections: [
      {
        heading: "Lingkungan sebagai konteks kesehatan",
        paragraphs: [
          "Perubahan kondisi lingkungan dapat menjadi bagian dari konteks yang perlu diperhatikan dalam kehidupan sehari-hari.",
          "Dampak dan pengalaman setiap orang tidak sama. Hubungan antara suatu paparan dan keluhan tertentu tidak boleh disimpulkan hanya dari data lingkungan."
        ]
      }
    ],
    limitations:
      "Artikel ini merupakan draf demonstrasi yang perlu ditinjau sebelum dipublikasikan."
  }
];

export function getEducationArticleBySlug(slug) {
  return educationArticles.find((article) => article.slug === slug) ?? null;
}
