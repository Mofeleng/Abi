import os
import pandas as pd

def run(user_prompt: str, csv_data: dict = None) -> dict:
    print("[Abi Data] Reading user request and processing real dataset metrics...")
    
    df = None
    
    # Check if data was pre-loaded and passed dynamically by main.py first
    if csv_data is not None:
        try:
            df = pd.DataFrame(csv_data)
            print("[Abi Data] Successfully parsed pre-loaded csv_data payload into DataFrame.")
        except Exception as parse_err:
            print(f"[Abi Data] Warning: Failed parsing csv_data directly: {parse_err}. Falling back to file load.")
            df = None

    # If no pre-loaded dictionary was passed (or parsing failed), fall back to reading the file path
    if df is None:
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "supermarket_sales_new.csv")
        
        if not os.path.exists(csv_path):
            print(f"[Abi Data] CRITICAL: Dataset file not found at {csv_path} and no valid memory fallback exists.")
            return {"user_prompt": user_prompt, "error": "No dataset found."}
            
        try:
            df = pd.read_csv(csv_path)
            print(f"[Abi Data] Loaded dataset successfully from file path: {csv_path}")
        except Exception as file_err:
            print(f"[Abi Data] Critical Error reading spreadsheet file: {file_err}")
            return {"user_prompt": user_prompt, "error": str(file_err)}

    # Run aggregates dynamically
    try:
        # Calculate totals dynamically so the LLM gets real numbers
        if 'Total' not in df.columns and 'Unit price' in df.columns and 'Quantity' in df.columns:
            df['Total'] = df['Unit price'] * df['Quantity']
        elif 'Total' not in df.columns:
            # Fallback if the dataset already contains a variation of Total (e.g., lowercase)
            total_col = [col for col in df.columns if col.lower() == 'total']
            if total_col:
                df['Total'] = df[total_col[0]]
            else:
                # Emergency fallback if no calculation basis exists
                df['Total'] = 0.0

        total_revenue = float(df['Total'].sum())
        
        # Aggregate City Performance safely if the column exists
        if 'City' in df.columns:
            city_summary = df.groupby('City')['Total'].sum().to_dict()
        else:
            # Look for any matching dynamic column names like 'city' or 'branch'
            fallback_city_col = [col for col in df.columns if col.lower() in ('city', 'branch', 'region')]
            if fallback_city_col:
                city_summary = df.groupby(fallback_city_col[0])['Total'].sum().to_dict()
            else:
                city_summary = {}
        
        # Aggregate Product Line Performance safely if the column exists
        if 'Product line' in df.columns:
            product_summary = df.groupby('Product line')['Total'].sum().to_dict()
        else:
            fallback_prod_col = [col for col in df.columns if col.lower() in ('product line', 'product_line', 'category', 'item')]
            if fallback_prod_col:
                product_summary = df.groupby(fallback_prod_col[0])['Total'].sum().to_dict()
            else:
                product_summary = {}
        
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
        print(f"[Abi Data] Critical Error calculating aggregates: {e}")
        return {"user_prompt": user_prompt, "error": str(e)}