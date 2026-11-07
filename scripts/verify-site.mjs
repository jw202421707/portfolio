import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "..");

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function walk(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(entryPath, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : [];
  });
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=(?:["']([^"']*)["']|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2]) : null;
}

const publicDirectory = path.resolve(repositoryRoot, option("--public-dir", "public"));
const statePath = path.join(repositoryRoot, ".github-pages.json");
const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
const basePath = new URL(state.baseURL).pathname.replace(/\/*$/, "/");
const indexPath = path.join(publicDirectory, "index.html");
const errors = [];

if (!fs.existsSync(indexPath)) {
  errors.push(`Missing generated home page: ${indexPath}`);
}

const htmlFiles = fs.existsSync(publicDirectory) ? walk(publicDirectory, ".html") : [];
const htmlDocuments = htmlFiles.map((file) => ({ file, html: fs.readFileSync(file, "utf8") }));
const resourceReferences = new Set();
let imageCount = 0;

for (const { file, html } of htmlDocuments) {
  const relativeFile = path.relative(publicDirectory, file);

  if (/localhost|127\.0\.0\.1|file:\/\/|[A-Za-z]:[\\/](?:Users|Documents)[\\/]/i.test(html)) {
    errors.push(`${relativeFile}: local-only address or path found`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    imageCount += 1;
    if (!/\balt(?:\s*=|\s|>)/i.test(match[0])) {
      errors.push(`${relativeFile}: image without alt attribute: ${match[0]}`);
    }
  }

  for (const match of html.matchAll(/(?:src|href)=(?:["']([^"']+)["']|([^\s>]+))/gi)) {
    const reference = match[1] ?? match[2];
    if (/^http:\/\//i.test(reference) || /^\/\//.test(reference)) {
      errors.push(`${relativeFile}: insecure resource URL: ${reference}`);
    }
    if (/^(?:https?:)?\/\//i.test(reference) || /^(?:data|mailto|tel):/i.test(reference) || reference.startsWith("#")) {
      continue;
    }
    if (/\.(?:css|js|png|jpe?g|gif|svg|webp|ico)(?:[?#].*)?$/i.test(reference)) {
      resourceReferences.add(reference);
    }
  }
}

for (const reference of resourceReferences) {
  const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  if (!pathname.startsWith(basePath)) {
    errors.push(`Resource is outside the Pages base path: ${reference}`);
    continue;
  }

  const relativeResource = pathname.slice(basePath.length);
  const resourcePath = path.resolve(publicDirectory, relativeResource);
  const expectedPrefix = `${publicDirectory}${path.sep}`;
  if (!resourcePath.startsWith(expectedPrefix) || !fs.existsSync(resourcePath) || !fs.statSync(resourcePath).isFile()) {
    errors.push(`Missing generated resource: ${reference}`);
  }
}

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const htmlTag = indexHtml.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const language = attribute(htmlTag, "lang");
  if (!language?.toLowerCase().startsWith("ko")) {
    errors.push(`Home page language is not Korean: ${language ?? "missing"}`);
  }

  const ids = new Set([...indexHtml.matchAll(/\bid=(?:["']([^"']+)["']|([^\s>]+))/gi)].map((match) => match[1] ?? match[2]));
  const navigationTargets = [...indexHtml.matchAll(/<a\b(?=[^>]*\bclass=(?:["'][^"']*nav-link[^"']*["']|[^\s>]*nav-link[^\s>]*))[^>]*\bhref=(?:["'][^"']*#([^"']+)["']|[^\s>]*#([^\s>]+))[^>]*>/gi)]
    .map((match) => match[1] ?? match[2]);

  for (const target of navigationTargets) {
    if (!ids.has(target)) errors.push(`Navigation target is missing: #${target}`);
  }
}

if (errors.length) {
  console.error(`Site verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Site verification passed.");
console.log(`- HTML files: ${htmlFiles.length}`);
console.log(`- Image elements: ${imageCount}`);
console.log(`- Local resources: ${resourceReferences.size}`);
console.log(`- Pages base path: ${basePath}`);
