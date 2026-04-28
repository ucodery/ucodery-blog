#!/usr/bin/env node
// Updates `updated` (always) and `created` (when new or dropping `draft` tag).
// Operates on the git index directly so unstaged working-tree edits are preserved.

import { spawnSync } from "node:child_process";

const WATCH_DIRS = ["src/posts/", "src/cookbook/"];

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

function git(args, { input, allowFail = false } = {}) {
	const r = spawnSync("git", args, { encoding: "utf8", input });
	if (r.status !== 0 && !allowFail) {
		process.stderr.write(r.stderr || "");
		throw new Error(`git ${args.join(" ")} failed`);
	}
	return r;
}

function listStaged() {
	// -c core.quotepath=false so non-ASCII paths come through untouched
	const out = git([
		"-c",
		"core.quotepath=false",
		"diff",
		"--cached",
		"--name-status",
		"--diff-filter=ACMR",
	]).stdout;
	return out
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			const parts = line.split("\t");
			return { status: parts[0][0], path: parts[parts.length - 1] };
		});
}

function inWatchDir(p) {
	return p.endsWith(".md") && WATCH_DIRS.some((d) => p.startsWith(d));
}

function splitFrontmatter(content) {
	const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n)?/);
	if (!m) return null;
	return {
		frontmatter: m[1],
		sep: m[2] || "",
		after: content.slice(m[0].length),
	};
}

function frontmatterHasTag(frontmatter, tag) {
	const lines = frontmatter.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const inline = lines[i].match(/^tags:\s*\[(.*)\]\s*$/);
		if (inline) {
			return inline[1]
				.split(",")
				.map((s) => s.trim().replace(/^["']|["']$/g, ""))
				.includes(tag);
		}
		if (/^tags:\s*$/.test(lines[i])) {
			for (let j = i + 1; j < lines.length; j++) {
				const item = lines[j].match(/^\s+-\s+(.*?)\s*$/);
				if (item) {
					if (item[1].replace(/^["']|["']$/g, "") === tag) return true;
				} else if (/^\s*$/.test(lines[j])) {
					continue;
				} else break;
			}
			return false;
		}
	}
	return false;
}

function setKey(frontmatter, key, value) {
	const lines = frontmatter.split("\n");
	const re = new RegExp(`^${key}:\\s*.*$`);
	for (let i = 0; i < lines.length; i++) {
		if (re.test(lines[i])) {
			lines[i] = `${key}: ${value}`;
			return lines.join("\n");
		}
	}
	let at = lines.length;
	while (at > 0 && lines[at - 1].trim() === "") at--;
	lines.splice(at, 0, `${key}: ${value}`);
	return lines.join("\n");
}

function rewrite(content, { newPublish }) {
	const p = splitFrontmatter(content);
	if (!p) throw new Error("no frontmatter");
	let frontmatter = setKey(p.frontmatter, "updated", today);
	if (newPublish) frontmatter = setKey(frontmatter, "created", today);
	return `---\n${frontmatter}\n---${p.sep}${p.after}`;
}

function main() {
	const staged = listStaged().filter((s) => inWatchDir(s.path));
	if (!staged.length) return;

	for (const { status, path } of staged) {
		const stagedContent = git(["show", `:${path}`]).stdout;

		let newPublish = status === "A";
		if (!newPublish) {
			const head = git(["show", `HEAD:${path}`], { allowFail: true });
			if (head.status === 0) {
				const h = splitFrontmatter(head.stdout);
				const s = splitFrontmatter(stagedContent);
				if (
					h &&
					s &&
					frontmatterHasTag(h.frontmatter, "draft") &&
					!frontmatterHasTag(s.frontmatter, "draft")
				) {
					newPublish = true;
				}
			}
		}

		const newContent = rewrite(stagedContent, { newPublish });
		if (newContent === stagedContent) continue;

		// Snapshot whether the working tree matched the index BEFORE we change the index.
		const worktreeClean =
			git(["diff", "--quiet", "--", path], { allowFail: true }).status === 0;

		const newSha = git(["hash-object", "-w", "--stdin"], {
			input: newContent,
		}).stdout.trim();
		const mode = git(["ls-files", "--stage", "--", path])
			.stdout.trim()
			.split(/\s+/)[0];
		git(["update-index", "--cacheinfo", `${mode},${newSha},${path}`]);

		// If the user had no unstaged changes to this file, sync the WT so it isn't left stale.
		// Otherwise leave WT alone — they'll see the index version on next `git diff --cached`.
		if (worktreeClean) git(["checkout-index", "-f", "--", path]);

		process.stderr.write(`frontmatter dates updated: ${path}\n`);
	}
}

main();
