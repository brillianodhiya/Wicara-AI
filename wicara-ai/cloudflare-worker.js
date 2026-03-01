export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      let audioBuffer;
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const audioFile = formData.get('audio');
        if (!audioFile) {
          return new Response(JSON.stringify({ error: 'No audio file provided' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        audioBuffer = await audioFile.arrayBuffer();
      } else {
        audioBuffer = await request.arrayBuffer();
      }

      // KUNCI AKURASI: Kita paksa model ini mode Bahasa Indonesia
      // DAN kita berikan 'prompt' bahasa Indonesia agar AI tidak berhalusinasi
      const response = await env.AI.run('@cf/openai/whisper', {
        audio: [...new Uint8Array(audioBuffer)],
        language: 'id', // Force Indonesian
        prompt: "Halo, selamat malam semuanya. Kita akan melakukan tes pada sistem ini. Berikut adalah rekaman suara dalam bahasa Indonesia yang panjang.", 
      });

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  },
};
