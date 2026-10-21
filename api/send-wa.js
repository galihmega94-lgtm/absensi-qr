export default async function handler(req, res) {
  // Atur Header CORS agar bisa dipanggil dari domain mana saja
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { target, message } = req.body || {};
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Token Fonnte belum dipasang di Vercel' });
  }

  try {
    const formData = new URLSearchParams();
    formData.append('target', target || '');
    formData.append('message', message || '');

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
