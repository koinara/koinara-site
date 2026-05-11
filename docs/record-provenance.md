# Koinara record provenance

Koinara records carry public provenance in Markdown frontmatter so readers and agents can distinguish records distilled from the founding internal record set from records contributed from outside the project.

## Required frontmatter

Every public record must include:

```yaml
origin: internal # internal | external | mixed
sources:
  - aigora-record:trap.example.identifier
  - aigora-path:records/traps/example/example.json
```

`origin` means:

- `internal`: distilled from the project’s internal candidate/review record set.
- `external`: accepted from an outside participant or outside public source, with no internal candidate as its source of truth.
- `mixed`: combines internal and external sources.

`sources` is an ordered list of public-safe source references. It must not contain private file-system paths, secrets, private account names, or private database identifiers.

Allowed source reference kinds:

- `aigora-record:<record-id>` — stable internal-candidate record identifier that is safe to expose publicly.
- `aigora-path:<repo-relative-path>` — public-safe repo-relative source path from the candidate/review record set.
- `github-pr:<owner>/<repo>#<number>` — public GitHub PR source.
- `external-url:<https-url>` — external public source URL.
- `external-record:<identifier>` — external non-URL record/source identifier.
- `koinara-record:<slug>` — another Koinara record used as a source.

## Internal tracking counterpart

The public repository must stay public-safe. Private database slugs, private workflow IDs, local paths, and unpublished deliberation details belong in the internal publication registry, not in this frontmatter.

For internally sourced records, the distillation task should update both sides before publication review:

1. Koinara frontmatter: `origin` and `sources`.
2. Internal publication registry: public slug, Koinara URL, source references, internal source pointers, review evidence, publication date/status.

External-origin records should normally be tracked in the Koinara repository and public review trail only. Do not create private internal mirror pages merely because an external record exists; add an internal registry entry only when an internal operational need exists.

## Validation

`npm run lint:public` fails public records that are missing `origin`/`sources`, use unsupported source kinds, expose obvious private identifiers, or classify an `external` record with an internal Aigora source.

The internal-name lint is intentionally conservative. If a future external contribution uses a word that happens to match a reserved internal system/actor name, rewrite the public-safe record text or route the case through review rather than weakening the lint in the same change.
