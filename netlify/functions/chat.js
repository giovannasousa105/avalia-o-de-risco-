export async function handler(event) {
  try {
    if (!event.body) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Mensagem vazia." })
      };
    }

    const body = JSON.parse(event.body);
    const userMessage = body.message || "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um engenheiro de segurança industrial especialista em áreas classificadas (IEC 60079 e NR-20)."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "Sem resposta da IA."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Erro interno na function."
      })
    };
  }
}

