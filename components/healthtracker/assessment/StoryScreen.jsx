"use client";

const MAX_LENGTH = 2000;

export default function StoryScreen({ story = "", setStory }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#332A35]">
          Ada cerita lain yang ingin kamu sampaikan?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6571]">
          Kamu bisa menceritakan pengalaman, perubahan yang
          kamu rasakan, atau hal lain yang menurutmu penting.
          Tidak perlu menuliskan sesuatu jika kamu tidak ingin.
        </p>
      </div>

      <div>
        <label
          htmlFor="assessment-story"
          className="mb-2 block text-sm font-semibold text-[#332A35]"
        >
          Ceritamu{" "}
          <span className="font-normal text-[#8A7E8C]">
            (opsional)
          </span>
        </label>

        <textarea
          id="assessment-story"
          value={story}
          onChange={(event) => setStory(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={7}
          placeholder="Tuliskan ceritamu di sini..."
          className="w-full resize-y rounded-[18px] border border-[#E8DDE5] bg-white px-4 py-3 text-sm leading-6 text-[#332A35] outline-none transition placeholder:text-[#AA9EAA] focus:border-[#B84E73] focus:ring-2 focus:ring-[#B84E73]/10"
        />

        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="text-xs leading-5 text-[#8A7E8C]">
            Ceritakan hanya hal yang nyaman untuk kamu bagikan.
          </p>

          <span className="shrink-0 text-xs text-[#8A7E8C]">
            {story.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-4">
        <p className="text-sm font-semibold text-[#365541]">
          Privasimu tetap penting
        </p>

        <p className="mt-1 text-sm leading-6 text-[#526A59]">
          Cerita ini tidak otomatis dikirim ke AI atau disimpan
          ke riwayat. Kamu akan mendapat pilihan sebelum
          melanjutkan ke proses berikutnya.
        </p>
      </div>
    </div>
  );
}