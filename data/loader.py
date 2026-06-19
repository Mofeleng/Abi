import pandas as pd
import os

def load_csv(filepath: str) -> dict:
    """Loads raw CSV rows as a list of dicts for abi_data.py to process."""
    df = pd.read_csv(filepath)
    return df.to_dict(orient="list")