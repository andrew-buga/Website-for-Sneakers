import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".next",
  ".vercel",
  ".turbo",
  "dist",
  "out",
  "coverage",
])

const allowedExt = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".md", ".yml", ".yaml", ".toml", ".prisma",
  ".css", ".scss", ".sass", ".html", ".sql", ".txt", ".env",
  ".sh", ".ps1", ".lock",
])

const allowedNoExt = new Set([
  "Dockerfile",
  ".gitignore",
  ".npmrc",
  ".nvmrc",
  ".editorconfig",
  "AGENTS.md",
])

const markerRegex = /^(<<<<<<<|=======|>>>>>>>)(.*)$/gm

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...(await walk(fullPath)))
      }
      continue
    }

    const ext = path.extname(entry.name)
    if (allowedExt.has(ext) || allowedNoExt.has(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function getLineNumber(content, index) {
  let line = 1
  for (let i = 0; i < index; i++) {
    if (content.charCodeAt(i) === 10) line++
  }
  return line
}

async function main() {
  const files = await walk(root)
  const hits = []

  for (const file of files) {
    const content = await readFile(file, "utf8")
    markerRegex.lastIndex = 0

    for (const match of content.matchAll(markerRegex)) {
      const line = getLineNumber(content, match.index ?? 0)
      const rel = path.relative(root, file).replace(/\\/g, "/")
      hits.push(`${rel}:${line}: ${match[0]}`)
    }
  }

  if (hits.length > 0) {
    console.error("Merge conflict markers found:\n")
    for (const hit of hits) console.error(hit)
    process.exit(1)
  }

  console.log("No merge conflict markers found")
}

main().catch((error) => {
  console.error("Failed to scan repository for merge markers")
  console.error(error)
  process.exit(1)
})
