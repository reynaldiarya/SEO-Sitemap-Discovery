/**
 * Fungsi utilitas untuk mengekstrak keyword dari URL (slug).
 */
export function extractKeywords(pathUrl: string | null | undefined): string | null {
  if (!pathUrl || pathUrl === '/') return null; // Abaikan homepage

  try {
    pathUrl = decodeURIComponent(pathUrl);
  } catch {
    return null;
  }

  // 1. Hapus ekstensi file (.html, .php, dll)
  pathUrl = pathUrl.replace(/\.(html|php|htm|xml|aspx)$/i, '');

  // 2. Pisahkan berdasarkan slash '/'
  const segments = pathUrl.split('/').filter(Boolean);

  // 3. Ambil segmen TERAKHIR yang bukan angka murni (biasanya ini judul artikel/halaman)
  let targetSlug = '';

  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (!s) continue;
    // Jika segmen hanya berisi angka (contoh: /2023/ atau ID), jangan diambil, cari sebelumnya
    if (!/^\d+$/.test(s)) {
      targetSlug = s;
      break;
    }
  }

  // Jika tidak ditemukan slug yang valid, kembalikan null
  if (!targetSlug) return null;

  // 4. Bersihkan slug menjadi kalimat yang bisa dibaca
  // Ganti simbol (-_+) menjadi spasi
  let readablePhrase = targetSlug.replace(/[-_+?=&]+/g, ' ');
  readablePhrase = readablePhrase.trim().toLowerCase();

  // Filter kata-kata sistem yang umum dan bukan keyword konten
  const ignoreList = new Set(['index', 'default', 'home']);
  if (ignoreList.has(readablePhrase)) return null;

  return readablePhrase;
}
