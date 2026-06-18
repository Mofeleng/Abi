import pandas as pd
import os

def load_csv(filepath: str) -> dict:
    df = pd.read_csv(filepath)
    
    summary = {}
    summary["source"] = os.path.basename(filepath)
    summary["total_transactions"] = len(df)

    if "Product line" in df.columns and "Quantity" in df.columns:
        summary["top_products"] = df.groupby("Product line")["Quantity"].sum().sort_values(ascending=False).head(5).to_dict()

    if "City" in df.columns and "Quantity" in df.columns:
        summary["sales_by_city"] = df.groupby("City")["Quantity"].sum().to_dict()

    if "Branch" in df.columns and "Quantity" in df.columns:
        summary["sales_by_branch"] = df.groupby("Branch")["Quantity"].sum().to_dict()

    if "Unit price" in df.columns and "Quantity" in df.columns:
        df["Revenue"] = df["Unit price"] * df["Quantity"]
        summary["total_revenue"] = round(df["Revenue"].sum(), 2)
        summary["average_order_value"] = round(df["Revenue"].mean(), 2)
        if "Product line" in df.columns:
            summary["revenue_by_product"] = df.groupby("Product line")["Revenue"].sum().round(2).to_dict()

    if "Customer type" in df.columns:
        summary["customer_types"] = df["Customer type"].value_counts().to_dict()

    if "Gender" in df.columns:
        summary["gender_split"] = df["Gender"].value_counts().to_dict()