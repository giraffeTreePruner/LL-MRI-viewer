/**
 * Generate copy-able export/upload commands for a given (i,j) config.
 *
 * These templates match the RYS repo's hf_export scripts.
 * The user should adjust --hf-repo and branch names as needed.
 */
export function generateExportCommands(modelName, i, j) {
  const safeName = modelName.replace(/\//g, '-').toLowerCase();
  const outputDir = `./exports/rys-${safeName}-${i}-${j}`;
  const repoId = `${modelName}-RYS-${i}-${j}`;

  const exportCmd = [
    `uv run python -m hf_export.export_model \\`,
    `  --source ${modelName} \\`,
    `  --output-dir ${outputDir} \\`,
    `  --blocks "${i},${j}"`,
  ].join('\n');

  const uploadCmd = [
    `uv run python -m hf_export.upload_to_hf \\`,
    `  --folder ${outputDir} \\`,
    `  --repo-id ${repoId} \\`,
    `  --repo-type model`,
  ].join('\n');

  const ollamaCmd = [
    `# After export, create Modelfile:`,
    `echo 'FROM ${outputDir}' > Modelfile`,
    `ollama create rys-${safeName}-${i}-${j} -f Modelfile`,
    `ollama run rys-${safeName}-${i}-${j}`,
  ].join('\n');

  return { exportCmd, uploadCmd, ollamaCmd };
}
