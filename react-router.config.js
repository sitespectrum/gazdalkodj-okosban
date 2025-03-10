/**
 * @type {import("@react-router/dev/config").Config}
 */
export default {
  appDirectory: "src",
  ssr: false,
  buildDirectory: "dist",
  buildEnd: async () => {
    const fs = require("fs").promises;
    const path = require("path");

    const clientDir = path.join("dist", "client");
    const distDir = "dist";

    const files = await fs.readdir(clientDir);
    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.join(clientDir, file);
        const destPath = path.join(distDir, file);
        await fs.rename(srcPath, destPath);
      })
    );

    await fs.rmdir(clientDir);

    console.log("Copied client files to dist");
  },
};
