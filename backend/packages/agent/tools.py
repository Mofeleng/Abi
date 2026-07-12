import pandas as pd
from langchain_core.tools import tool

@tool
def query_spreadsheet(python_code: str, file_path: str = "data/supermarketsales.csv") -> str:
    """
    Executes Python Pandas code against a supermarket sales spreadsheet to analyze data.
    The dataframe is always pre-loaded and accessible as the variable 'df'.
    Always use `print()` to output the final answer or result of your analysis.
    """
    try:
        # Load the file inside the tool execution space
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
            
        # Create a safe, isolated namespace containing the dataframe and pandas
        local_vars = {"df": df, "pd": pd}
        
        # Redirect standard output so we can capture what the LLM prints
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()
        
        # Run the LLM's code
        exec(python_code, {}, local_vars)
        
        # Restore standard output and grab the results
        sys.stdout = old_stdout
        result = redirected_output.getvalue()
        
        if not result.strip():
            return "Code executed successfully, but nothing was printed. Remember to print() your results!"
            
        return result.strip()
        
    except Exception as e:
        return f"Error executing code: {str(e)}"