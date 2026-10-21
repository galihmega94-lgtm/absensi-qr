export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { target, message } = req.body;
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Token Fonnte belum dipasang di Vercel' });
  }

  try {
    // Format payload ke URLSearchParams (x-www-form-urlencoded) agar sesuai spesifikasi Fonnte API
    const formData = new URLSearchParams();
    formData.append('target', target);
    formData.append('message', message);

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token.trim(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Gagal menghubungi Fonnte', details: error.message });
  }
}
