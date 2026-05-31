import os

IGNORE = {
    "node_modules",
    ".git",
    "target",
    "dist",
    "build",
    "__pycache__"
}

IGNORE_FILES = {
    "package-lock.json"
}

OUTPUT = "project_export.txt"

with open(OUTPUT, "w", encoding="utf-8") as out:

    for root, dirs, files in os.walk("."):

        dirs[:] = [d for d in dirs if d not in IGNORE]

        for file in files:

            if file in IGNORE_FILES:
                continue

            path = os.path.join(root, file)

            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                out.write(f"\nFILE: {path}\n")
                out.write("=" * 60 + "\n")
                out.write(content)
                out.write("\n\n")

            except Exception as e:
                out.write(f"\nFILE: {path}\n")
                out.write(f"ERROR: {e}\n\n")

print("Project exported!")