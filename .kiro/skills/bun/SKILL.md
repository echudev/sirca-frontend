---
name: Bun
description: Use when building, testing, or deploying JavaScript/TypeScript applications. Reach for Bun when you need to run scripts, manage packages, bundle code, or test applications with a single unified toolkit.
metadata:
    mintlify-proj: bun
    version: "1.0"
---

# Bun Skill Reference

## Product Summary

Bun is an all-in-one JavaScript/TypeScript toolkit that replaces Node.js, npm, and bundlers with a single binary. It includes a fast runtime (powered by JavaScriptCore), package manager, test runner, and bundler—all optimized for speed and modern JavaScript. Key files: `bunfig.toml` (configuration), `package.json` (scripts and dependencies), `bun.lock` (lockfile). Primary CLI commands: `bun run`, `bun install`, `bun test`, `bun build`. See https://bun.com/docs for comprehensive documentation.

## When to Use

Use Bun when:
- Running TypeScript/JSX files directly without compilation overhead (`bun run file.ts`)
- Installing dependencies faster than npm/yarn/pnpm (`bun install`)
- Running tests with Jest-compatible syntax (`bun test`)
- Bundling JavaScript/TypeScript for browsers or servers (`bun build`)
- Executing package.json scripts with minimal startup time
- Building full-stack applications with server and client code
- Setting up monorepos with workspaces
- Developing with hot-reload/watch mode
- Deploying to serverless platforms (Vercel, Railway, AWS Lambda, etc.)

## Quick Reference

### Core Commands

| Task | Command | Notes |
|------|---------|-------|
| Run TypeScript file | `bun run file.ts` or `bun file.ts` | Transpiles on-the-fly; supports JSX |
| Run package script | `bun run dev` | 28x faster than `npm run` |
| Install dependencies | `bun install` | 25x faster than npm; creates `bun.lock` |
| Add package | `bun add react` | Adds to `package.json` and installs |
| Add dev dependency | `bun add -d typescript` | Installs as devDependency |
| Run tests | `bun test` | Finds `*.test.ts`, `*.spec.ts` files |
| Watch tests | `bun test --watch` | Re-runs on file changes |
| Build bundle | `bun build ./index.ts --outdir ./dist` | Bundles for browser/server |
| Watch build | `bun build ./index.ts --outdir ./dist --watch` | Rebuilds on changes |
| Execute package | `bunx cowsay "hello"` | Like `npx` but faster |

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `bunfig.toml` | Bun-specific config (runtime, test, install, build) | Project root or `~/.bunfig.toml` |
| `package.json` | Scripts, dependencies, workspaces | Project root |
| `bun.lock` | Lockfile (text format by default) | Project root |
| `tsconfig.json` | TypeScript config (Bun respects this) | Project root |

### Key bunfig.toml Sections

```toml
# Runtime behavior
[define]
"process.env.API_URL" = "'https://api.example.com'"

# Test runner
[test]
root = "./__tests__"
coverage = true
coverageThreshold = 0.9

# Package manager
[install]
optional = true
dev = true
linker = "hoisted"  # or "isolated"

# Run scripts
[run]
shell = "system"  # or "bun"
bun = true        # alias node to bun
```

## Decision Guidance

### When to Use Hoisted vs. Isolated Installs

| Scenario | Use | Reason |
|----------|-----|--------|
| New monorepo/workspace | `isolated` | Prevents phantom dependencies |
| New single-package project | `hoisted` | Traditional npm behavior |
| Existing pre-v1.3.2 project | `hoisted` | Backward compatibility |
| Strict dependency isolation needed | `isolated` | Each package gets own `node_modules` |

Use `bun install --linker isolated` or set in `bunfig.toml`.

### When to Use bun build vs. bun run

| Task | Use | Why |
|------|-----|-----|
| Execute a script | `bun run` | Fast startup, no output files |
| Prepare for browser | `bun build --target browser` | Optimizes for browser APIs |
| Prepare for server | `bun build --target bun` or `--target node` | Optimizes for server APIs |
| Create executable | `bun build --compile` | Single binary with Bun embedded |
| Development server | `bun run` with `Bun.serve()` | Direct HTTP server in code |

### When to Use --watch vs. --concurrent

| Flag | Use Case |
|------|----------|
| `bun --watch run dev` | Restart entire process on file change |
| `bun test --concurrent` | Run async tests in parallel (faster) |
| `bun test --watch` | Re-run tests on file change |
| `bun build --watch` | Rebuild bundle on file change |

## Workflow

### 1. Initialize a New Project
```bash
bun init my-app
# Choose template: Blank, React, or Library
cd my-app
```

### 2. Install Dependencies
```bash
bun install
# Or add specific packages
bun add react
bun add -d @types/react
```

### 3. Create and Run Code
```bash
# Create index.ts with your code
bun run index.ts

# Or add to package.json scripts
# Then run: bun run dev
```

### 4. Write Tests
```bash
# Create math.test.ts
# Import from "bun:test"
# Run: bun test
```

### 5. Bundle for Production
```bash
bun build ./index.ts --outdir ./dist --minify
```

### 6. Deploy
```bash
# Commit bun.lock to version control
# In CI: bun ci (equivalent to bun install --frozen-lockfile)
# Deploy dist/ or compiled executable
```

## Common Gotchas

- **Watch mode flag placement**: Use `bun --watch run dev`, not `bun run dev --watch`. Flags after the script name are passed to the script itself.
- **Node.js compatibility**: Bun aims for Node.js compatibility but not everything is implemented. Check [nodejs-compat](/runtime/nodejs-compat) for status.
- **Lifecycle scripts security**: Bun doesn't execute `postinstall` scripts by default. Add trusted packages to `trustedDependencies` in `package.json`.
- **Lockfile format**: Bun v1.2+ uses text `bun.lock` by default (not binary `bun.lockb`). Commit this to version control.
- **TypeScript types**: If you see `Bun` global errors, install `@types/bun` and configure `tsconfig.json` with `"lib": ["ESNext"]`.
- **Auto-install disabled in production**: Set `[install] auto = "disable"` in `bunfig.toml` for CI/CD to prevent unexpected installs.
- **Peer dependencies**: Bun installs peer dependencies by default (unlike npm). Disable with `[install] peer = false` if needed.
- **Environment variables**: Bun loads `.env`, `.env.local`, `.env.[NODE_ENV]` automatically. Disable with `[env] file = false`.
- **Monorepo filtering**: Use `--filter` with glob patterns: `bun install --filter 'packages/*'` or `bun run --filter 'ba*' test`.
- **Bytecode generation**: Only works with `target: "bun"`. Requires matching Bun version for execution.

## Verification Checklist

Before submitting work with Bun:

- [ ] Run `bun install` to verify dependencies resolve without errors
- [ ] Run `bun test` to verify all tests pass
- [ ] Run `bun build` to verify bundle completes without errors
- [ ] Check `bun.lock` is committed to version control (for reproducible installs)
- [ ] Verify `bunfig.toml` has correct `[install]` and `[test]` sections if customized
- [ ] Test with `bun run <script>` to verify package.json scripts work
- [ ] Check for TypeScript errors: `bun run tsc --noEmit` (if tsc installed)
- [ ] Verify watch mode works: `bun --watch run dev` (for development)
- [ ] Test in CI environment: `bun ci` (frozen lockfile install)
- [ ] Confirm no hardcoded Node.js-specific APIs if targeting browser

## Resources

- **Comprehensive navigation**: https://bun.com/docs/llms.txt
- **Runtime documentation**: https://bun.com/docs/runtime
- **Package manager**: https://bun.com/docs/pm/cli/install
- **Test runner**: https://bun.com/docs/test
- **Bundler**: https://bun.com/docs/bundler

---

> For additional documentation and navigation, see: https://bun.com/docs/llms.txt