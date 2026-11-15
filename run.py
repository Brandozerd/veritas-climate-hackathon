"""Run the whole project from the command line:  python run.py

This runs every code cell of notebooks/main.ipynb in order, prints the results,
and then starts the app. It is the same code as the notebook, just without Jupyter.
"""
import json
import os
import pathlib

# Charts are saved as files instead of opening pop-up windows
os.environ.setdefault("MPLBACKEND", "Agg")

here = pathlib.Path(__file__).resolve().parent
os.chdir(here)

print("Recess Ready: running the notebook (about 1-2 minutes; the app starts at the end)...", flush=True)
notebook = json.loads((here / "notebooks" / "main.ipynb").read_text(encoding="utf-8"))
code = "\n\n".join("".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "code")
exec(compile(code, "notebooks/main.ipynb", "exec"), {"__name__": "__main__"})
