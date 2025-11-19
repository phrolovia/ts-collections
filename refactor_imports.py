import os
import re

# Configuration
PROJECT_ROOT = r"c:\Codes\ts-collections"
SRC_DIR = os.path.join(PROJECT_ROOT, "src")
TESTS_DIR = os.path.join(PROJECT_ROOT, "tests")
IMPORTS_FILE = os.path.join(SRC_DIR, "imports.ts")

def parse_imports_ts(imports_file_path):
    """Parses imports.ts and returns a map of symbol -> relative_path (from src root)."""
    exports_map = {}
    with open(imports_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match export statements
    # Matches: export { ... } from "..."; or export type { ... } from "...";
    # Handling multiline exports
    pattern = re.compile(r'export\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["\']([^"\']+)["\'];', re.MULTILINE | re.DOTALL)

    matches = pattern.findall(content)
    for symbols_str, path in matches:
        # symbols_str can be "Foo, Bar" or "Foo,\n Bar"
        symbols = [s.strip() for s in symbols_str.split(',') if s.strip()]
        for symbol in symbols:
            # Handle "Foo as Bar" if necessary (not seen in the file but good practice)
            # The file seems to only have simple exports
            if ' as ' in symbol:
                symbol = symbol.split(' as ')[1].strip()
            exports_map[symbol] = path

    return exports_map

def get_relative_path(from_file, to_file_rel_src):
    """Calculates the relative import path."""
    # from_file: absolute path of the file doing the import
    # to_file_rel_src: relative path of the imported file from src root (e.g. "./enumerator/IEnumerable")

    # Normalize paths
    to_file_abs = os.path.normpath(os.path.join(SRC_DIR, to_file_rel_src))
    # If it doesn't end with .ts, assume it's a file and we don't need extension for import
    # But for path calculation we treat it as a file.

    from_dir = os.path.dirname(from_file)
    rel_path = os.path.relpath(to_file_abs, from_dir)

    # Convert to posix style for imports
    rel_path = rel_path.replace(os.sep, '/')

    if not rel_path.startswith('.'):
        rel_path = './' + rel_path

    return rel_path

def process_file(file_path, exports_map):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    modified = False

    # Regex to match imports from imports.ts
    # Matches: import { ... } from ".../imports";
    import_pattern = re.compile(r'import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["\'].*imports["\'];')

    for line in lines:
        match = import_pattern.search(line)
        if match:
            symbols_str = match.group(1)
            symbols = [s.strip() for s in symbols_str.split(',') if s.strip()]

            # Group symbols by their new path
            new_imports = {} # path -> { 'types': [], 'values': [] }

            for symbol in symbols:
                if symbol not in exports_map:
                    print(f"Warning: Symbol '{symbol}' not found in exports map. File: {file_path}")
                    continue

                target_rel_path = exports_map[symbol]
                new_import_path = get_relative_path(file_path, target_rel_path)

                if new_import_path not in new_imports:
                    new_imports[new_import_path] = []
                new_imports[new_import_path].append(symbol)

            # Construct new import lines
            # We don't distinguish type imports here easily unless we parse imports.ts more strictly or check usage.
            # However, the original import might have been 'import type'.
            # If the original was 'import type', all new ones should be 'import type'.
            is_type_import = 'import type' in line

            for path, syms in new_imports.items():
                syms_str = ', '.join(sorted(syms))
                import_kw = "import type" if is_type_import else "import"
                new_line = f'{import_kw} {{ {syms_str} }} from "{path}";\n'
                new_lines.append(new_line)

            modified = True
        else:
            new_lines.append(line)

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Updated {file_path}")

def main():
    exports_map = parse_imports_ts(IMPORTS_FILE)
    print(f"Found {len(exports_map)} exported symbols.")

    # Process src files
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith('.ts') and file != 'imports.ts':
                process_file(os.path.join(root, file), exports_map)

    # Process test files
    for root, dirs, files in os.walk(TESTS_DIR):
        for file in files:
            if file.endswith('.ts'):
                process_file(os.path.join(root, file), exports_map)

if __name__ == "__main__":
    main()
