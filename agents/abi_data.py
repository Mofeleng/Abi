import os
import pandas as pd

def run(user_prompt: str, csv_data: dict = None) -> dict:
    print("[Abi Data] Reading user request and processing real dataset metrics...")
    
    # Locate the true file path
    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "supermarket_sales_new.csv")
    
    if not os.path.exists(csv_path):
        print(f"[Abi Data] CRITICAL: {csv_path} not found. Falling back to loaded data dictionary.")
        if csv_data:
            return {"user_prompt": user_prompt, "raw_data_summary": csv_data}
        return {"user_prompt": user_prompt, "error": "No dataset found."}

    # Load and explicitly aggregate metrics using pandas
    try:
        df = pd.read_csv(csv_path)
        
        # Calculate totals dynamically so the LLM gets real numbers
        df['Total'] = df['Unit price'] * df['Quantity']
        total_revenue = float(df['Total'].sum())
        
        # Aggregate City Performance
        city_summary = df.groupby('City')['Total'].sum().to_dict()
        
        # Aggregate Product Line Performance
        product_summary = df.groupby('Product line')['Total'].sum().to_dict()
        
        # Pack the real metrics tightly into the payload data contract
        data_package = {
            "user_prompt": user_prompt,
            "metadata": {
                "dataset_name": "supermarket_sales_new.csv",
                "total_records": len(df),
                "currency_context": "South African Rands (R)"
            },
            "financials": {
                "total_revenue": total_revenue,
                "city_breakdown": city_summary,
                "product_line_breakdown": product_summary
            }
        }
        
        print(f"[Abi Data] Done. Extracted metrics for {len(df)} transactions spanning real cities and categories.")
        return data_package

    except Exception as e:
        print(f"[Abi Data] Critical Error reading spreadsheet: {e}")
        return {"user_prompt": user_prompt, "error": str(e)}