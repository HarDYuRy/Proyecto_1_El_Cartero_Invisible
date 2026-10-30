"""Importa l'app sense llegir ni sobreescriure el cartas.json real."""
import os
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# main.py carrega i guarda cartes durant la importacio, abans de les fixtures.
directori_original = Path.cwd()
with TemporaryDirectory(prefix="cartes-import-") as directori_temporal:
    try:
        os.chdir(directori_temporal)
        import main
    finally:
        os.chdir(directori_original)
