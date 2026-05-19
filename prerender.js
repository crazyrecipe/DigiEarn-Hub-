import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function prerender() {
  console.log("Starting prerender...");

  // Import the built server
  const serverPath = path.resolve(process.cwd(), "dist/server/server.js");
  const serverModule = await import(pathToFileURL(serverPath).href);
  const server = serverModule.default || serverModule;

  if (!server || !server.fetch) {
    console.error("No fetch handler found on server module:", serverModule);
    process.exit(1);
  }

  // Simulate a request to the root path
  const req = new Request("http://localhost/");
  const res = await server.fetch(req, {}, {});

  if (res.status !== 200) {
    console.error("Failed to prerender root path, status:", res.status);
    console.error(await res.text());
    process.exit(1);
  }

  let html = await res.text();

  // Write the HTML to dist/index.html
  fs.writeFileSync(path.resolve(process.cwd(), "dist", "index.html"), html);
  console.log("Successfully wrote dist/index.html");

  // The postbuild script in package.json will copy dist/client/* to dist/
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
