const { spawn } = require('child_process');

function runCommand(command, args, cwd) {
  // Folosim opțiunea shell pentru compatibilitate cross-platform (Windows, macOS, Linux)
  const proc = spawn(command, args, { cwd, stdio: 'inherit', shell: true });
  proc.on('close', (code) =>
    console.log(`Comanda "${command} ${args.join(' ')}" s-a oprit cu codul ${code}`)
  );
  return proc;
}

// Pornește aplicația React din folderul 'client'
const clientProcess = runCommand('npm', ['start'], './client');

// Pornește serverul (sau API-ul) din folderul 'api'
const serverProcess = runCommand('npm', ['start'], './api');

// Dacă dorești să gestionezi oprirea ambelor procese când ieși din script,
// poți adăuga un handler la evenimentul "SIGINT":
process.on('SIGINT', () => {
  clientProcess.kill();
  serverProcess.kill();
  process.exit();
});
