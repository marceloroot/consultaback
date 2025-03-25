const Minio = require("minio");

const accessKey = "bAn25VmcOAJXvgPb9HKj";
const secretKey = "iG2E2y6C0y88uZ1h6RgHSkrdfK5qSPxj81fmAppb";

const minioClient = new Minio.Client({
  endPoint: "s3.alfenas.mg.gov.br", // Domínio configurado no Traefik
  useSSL: true, // Usando HTTPS
  accessKey: "bAn25VmcOAJXvgPb9HKj", // Chave de acesso
  secretKey: "iG2E2y6C0y88uZ1h6RgHSkrdfK5qSPxj81fmAppb", // Chave secreta
});

async function listatudo() {
  try {
    const buckets = await minioClient.listBuckets();
    console.log("Buckets disponíveis:", buckets);
  } catch (error) {
    console.error("Erro ao listar buckets:", error);
  }
}

module.exports = { minioClient, listatudo };
