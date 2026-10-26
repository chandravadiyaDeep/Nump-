# Dataset Format Support Matrix

## Rule
A format is supported only after its loader, validation, error handling, limits and automated fixtures are implemented and tested. An extension alone is not proof of support.

| Format | Current status | Notes |
|---|---|---|
| CSV | Initial loader implemented | Encoding and delimiter edge cases need tests. |
| JSON | Initial loader implemented | Nested structures can normalize differently. |
| Parquet | Initial loader implemented | Requires compatible PyArrow. |
| Arrow IPC (.arrow) | Initial loader implemented | File and stream paths are attempted. |
| Feather (.feather) | Initial loader implemented | Tabular interchange format. |
| Specialized/optimized Parquet variants | Not separately validated | Define exact variant and compatibility. |
| ImageFolder | Not implemented | Needs safe folder/archive ingestion and image metadata. |
| AudioFolder/SoundFolder | Not implemented | Needs audio decoding, metadata and resource limits. |
| WebDataset | Not implemented | Needs shard streaming and safe archive handling. |
| Raw text corpus mode | Not implemented | Define record boundaries, encoding and text-specific profiling. |

## Acceptance checks for every new format
- Document accepted extensions and upload form.
- Validate content instead of trusting the extension.
- Reject malformed/unsafe input with useful errors.
- Enforce compressed and expanded limits for archives.
- Prevent path traversal and unsafe extraction.
- Define sample/row limits and memory behaviour.
- Add deterministic fixtures and automated tests.
- Document schema/metadata preservation and limitations.
- Update UI copy to match actual support.

## Future architecture
Consider format adapters that return a documented internal dataset interface. Tabular data can use DataFrame adapters; image, audio and text need modality-specific metadata and profiling. Do not pretend all modalities have identical cleaning semantics.
