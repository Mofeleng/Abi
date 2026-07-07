import os
import pandas as pd

os.makedirs("data", exist_ok=True)

# Perfect presentation trends for South African corporate reporting
data_factory = {
    "Month": ["January", "January", "January", "February", "February", "February", "March", "March", "March"],
    "Region": ["Gauteng", "Western Cape", "Core KZN", "Gauteng", "Western Cape", "Core KZN", "Gauteng", "Western Cape", "Core KZN"],
    "Product line": ["Software License", "Consulting Hours", "Support Plan", "Software License", "Consulting Hours", "Support Plan", "Software License", "Consulting Hours", "Support Plan"],
    "Unit price": [5000, 1200, 800, 5500, 1300, 850, 6000, 1500, 900],
    "Quantity": [12, 30, 15, 16, 35, 18, 22, 45, 25]
}

df = pd.DataFrame(data_factory)
df["Total"] = df["Unit price"] * df["Quantity"]

target_path = os.path.join("data", "supermarket_sales_new.csv")
df.to_csv(target_path, index=False)

print(f"🚀 Success! South African presentation dataset built at: {target_path}")