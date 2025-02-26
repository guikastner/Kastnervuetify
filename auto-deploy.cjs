const { exec } = require("child_process");
const chokidar = require("chokidar");
const path = require("path");

// Configurações do bucket
const s3_bucket_name = "kastnerbucket";
const s3_path = "vuetify"; // Subpasta no bucket (opcional)
const aws_region = "us-east-1"; // Ajuste se estiver em outra região

const bucketPath = s3_path ? `${s3_bucket_name}/${s3_path}` : s3_bucket_name;
let isBuilding = false;

// Função para executar comandos no terminal
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Função principal para build e deploy
const buildAndDeploy = async () => {
  if (isBuilding) return;
  isBuilding = true;

  try {
    console.log("🏗️ Building project...");
    await runCommand("npm run build");
    console.log("✅ Build completed.");

    console.log("☁️ Uploading to S3...");

    // Comando AWS S3 Sync
    const s3Command = `aws s3 sync ./dist s3://${bucketPath} --delete --exact-timestamps`;
    const output = await runCommand(s3Command);

    console.log(`🚀 Deployed to s3://${bucketPath}`);
    console.log(output);

    // Gera URL pública para o index.html
    const publicUrl = `https://${s3_bucket_name}.s3.${aws_region}.amazonaws.com/${
      s3_path ? s3_path + "/" : ""
    }index.html`;

    console.log(`✅ Upload completed successfully!`);
    console.log(`🌐 Access your project at: ${publicUrl}`);
  } catch (err) {
    console.error(`❌ Error during deployment: ${err}`);
  } finally {
    isBuilding = false;
  }
};

// Watcher para mudanças nos arquivos
const watcher = chokidar.watch("./src", {
  ignored: /(^|[\/\\])\../,
  persistent: true,
});

console.log("👀 Watching for file changes...");

watcher.on("change", (filePath) => {
  console.log(`📂 File changed: ${filePath}`);
  buildAndDeploy();
});
