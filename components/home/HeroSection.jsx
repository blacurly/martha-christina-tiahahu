import { useRouter } from "next/navigation";
import "./HeroSection.css";
import { Button } from "@/components/ui/button";

export default function HeroSection({ onStartCheckin }) {
  const router = useRouter();

  function goToGeneralGuidance() {
    router.push("/generalguidance");
  }

  return (
    <section className="hero">
      <div>
        <div className="eyebrow">
          Kesehatan perempuan & lingkungan
        </div>

        <h1>
          Kenali lingkunganmu, proteksi awalmu.
        </h1>

        <p className="lead">
          Lihat kondisi lingkungan di lokasi pilihanmu, pahami artinya,
          dan temukan langkah perlindungan yang sesuai dengan rencanamu.
        </p>
        
        <div className="actions">
          <Button
            size="lg"
            onClick={goToGeneralGuidance}
            className="hero-button"
          >
            Lihat Kondisi Hari Ini ↓
          </Button>
        </div>

      </div>

      <div className="hero-art">
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="hero-circle">
          SYCLE
          <span>
            SEE YOUR ENVIRONMENT
            <br />
            KNOW YOURSELF
          </span>
        </div>

        <div className="float-card float-top">
          ☀️ Lingkungan hari ini
        </div>

        <div className="float-card float-bottom">
          ♡ Catatan tubuhmu
        </div>
      </div>
    </section>
  );
}