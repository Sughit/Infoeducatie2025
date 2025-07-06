export default async function CodeTestRunner(code, testCases, endpoint = 'https://code-evaluator-bpyj.onrender.com/evaluate', maxRetries = 10, delay = 3000) {
  console.log('CODETESTRUNNER CALLED');
  console.log('Body trimis:', JSON.stringify({ code, testCases }, null, 2));
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1} to contact evaluator...`);
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
      console.warn(`Retry ${attempt + 1} failed: ${err.message}`);
      attempt++;
      if (attempt < maxRetries) await new Promise(r => setTimeout(r, delay));
      else return { success: false, error: 'Evaluator indisponibil după mai multe încercări.' };
    }
  }
}
