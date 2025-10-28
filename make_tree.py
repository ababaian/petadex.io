#!/usr/bin/env python3
"""
Script to display directory tree structure for backend and frontend directories.
"""

import os
from pathlib import Path


def display_tree(directory, prefix="", is_last=True, max_depth=None, current_depth=0, file_handle=None):
    """
    Recursively display directory tree structure.
    
    Args:
        directory: Path to the directory
        prefix: Prefix string for tree formatting
        is_last: Whether this is the last item in current level
        max_depth: Maximum depth to traverse (None for unlimited)
        current_depth: Current depth level
        file_handle: File handle to write output to (None for stdout)
    """
    if max_depth is not None and current_depth > max_depth:
        return
    
    path = Path(directory)
    
    if not path.exists():
        msg = f"Error: Directory '{directory}' does not exist"
        if file_handle:
            file_handle.write(msg + "\n")
        else:
            print(msg)
        return
    
    if not path.is_dir():
        msg = f"Error: '{directory}' is not a directory"
        if file_handle:
            file_handle.write(msg + "\n")
        else:
            print(msg)
        return
    
    # Get all items in directory, sorted (directories first, then files)
    try:
        items = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
    except PermissionError:
        msg = f"{prefix}[Permission Denied]"
        if file_handle:
            file_handle.write(msg + "\n")
        else:
            print(msg)
        return
    
    # Filter out hidden files and node_modules
    items = [item for item in items if not item.name.startswith('.') and item.name != 'node_modules']
    
    for index, item in enumerate(items):
        is_last_item = index == len(items) - 1
        
        # Determine the appropriate tree characters
        if is_last_item:
            current_prefix = "└── "
            extension_prefix = "    "
        else:
            current_prefix = "├── "
            extension_prefix = "│   "
        
        line = f"{prefix}{current_prefix}{item.name}"
        if file_handle:
            file_handle.write(line + "\n")
        else:
            print(line)
        
        # Recursively process subdirectories
        if item.is_dir():
            display_tree(
                item,
                prefix + extension_prefix,
                is_last_item,
                max_depth,
                current_depth + 1,
                file_handle
            )


def main():
    """Main function to display trees for backend and frontend directories."""
    
    output_file = "tree_output.txt"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Backend directory
        f.write("Backend Project Directory Structure:\n")
        backend_path = "backend"
        if os.path.exists(backend_path):
            display_tree(backend_path, file_handle=f)
        else:
            f.write(f"Error: '{backend_path}' directory not found\n")
        
        f.write("\n")  # Empty line between trees
        
        # Frontend directory
        f.write("Frontend Project Directory Structure:\n")
        frontend_path = "frontend/src"
        if os.path.exists(frontend_path):
            display_tree(frontend_path, file_handle=f)
        else:
            f.write(f"Error: '{frontend_path}' directory not found\n")
    
    print(f"Tree structure saved to {output_file}")


if __name__ == "__main__":
    main()