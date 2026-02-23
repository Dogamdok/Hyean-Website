# Versioning and Rollback

This project uses local snapshot versioning so you can roll back at any time.

## Create a snapshot

```bash
bash scripts/version_snapshot.sh "phase0-start"
```

## Restore a snapshot

```bash
bash scripts/version_restore.sh 20260221_130000_phase0-start.tar.gz
```

You can also pass the short name without `.tar.gz`:

```bash
bash scripts/version_restore.sh 20260221_130000_phase0-start
```

## Snapshot scope

- `apps/hyean-web`
- `docs`
- `content/migration`
- `scripts`
- `README.md`

