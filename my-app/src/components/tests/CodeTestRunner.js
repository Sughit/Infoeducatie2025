export default async function CodeTestRunner(code, testCases, endpoint = 'http://localhost:3001/evaluate') {
    console.log('📥 CODETESTRUNNER CALLED');
  try {
    // 🔍 Debug: vezi ce trimiți
    console.log('🟡 Trimit la evaluator:', {
      codePreview: code?.slice(0, 200), // doar primele 200 caractere din cod
      testCases
    });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, testCases }),
    });

    const data = await res.json();

    // 🔍 Debug: vezi ce răspunde serverul
    console.log('🟢 Răspuns de la evaluator:', data);

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
    console.error('🔴 Eroare la evaluare:', err);
    return {
      success: false,
      error: err.message || 'Eroare necunoscută',
    };
  }
}
