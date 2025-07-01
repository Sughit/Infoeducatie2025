export default async function CodeTestRunner(code, testCases, endpoint = 'http://localhost:3001/evaluate') {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, testCases }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Eroare la evaluare');
    }

    return {
      success: true,
      score: data.score,
      results: data.results,
      passed: data.passed,
      total: data.total,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Eroare necunoscută',
    };
  }
}
