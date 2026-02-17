import asyncio
import os
import sys
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Define the server parameters directly for the script to use
# This relies on the system having 'uv' installed and accessible.
SERVER_PARAMS = StdioServerParameters(
    command=os.path.expanduser("~/.local/bin/notebooklm-mcp"),
    args=[],
    env=None # Inherit env vars (PATH, etc)
)

class NotebookLMClient:
    def __init__(self):
        self.session = None
        self.exit_stack = None

    async def connect(self):
        """Establishes the MCP connection."""
        # accessing the context manager manually to persist the session
        self.client_ctx = stdio_client(SERVER_PARAMS)
        self.read, self.write = await self.client_ctx.__aenter__()
        self.session_ctx = ClientSession(self.read, self.write)
        self.session = await self.session_ctx.__aenter__()
        await self.session.initialize()

    async def close(self):
        """Closes the MCP connection."""
        if self.session:
            await self.session_ctx.__aexit__(None, None, None)
        if self.client_ctx:
            await self.client_ctx.__aexit__(None, None, None)

    async def list_resources(self):
        return await self.session.list_resources()

    async def list_tools(self):
        return await self.session.list_tools()

    async def query_notebook(self, notebook_name: str, query: str):
        """
        Finds a notebook by name and queries it.
        """
        # 1. List Notebooks
        print(f"Looking for notebook: '{notebook_name}'...")
        result = await self.session.call_tool("notebook_list", arguments={})
        
        # The output format of notebook_list depends on the server.
        # It typically returns a JSON string or a list of implementation-specific objects.
        # We'll assume typical MCP behavior where 'content' text is JSON.
        if not result.content:
            print("Error: notebook_list returned no content.")
            return None

        try:
            # MCP tool results are often text. JSON parsing might be needed.
            # If the result is already a dict (unlikely for text content), we handle that too.
            content_text = result.content[0].text
            notebooks = json.loads(content_text)
            print(f"DEBUG: notebooks list: {notebooks}")
            
            if isinstance(notebooks, dict) and notebooks.get("status") == "error":
                print(f"Error listing notebooks: {notebooks.get('error')}")
                return None
            
            if isinstance(notebooks, dict):
                # If it's a dict but not an explicit error, it might be wrapped.
                # But 'status'='error' is clear.
                # If valid, it should be a list. 
                print(f"Unexpected response format: {notebooks}")
                return None

        except json.JSONDecodeError:
            print(f"Error parsing notebook_list output: {result.content[0].text[:100]}...")
            return None

        # 2. Find Notebook ID
        target_id = None
        for nb in notebooks:
            # Adjust key based on actual schema (usually 'title' or 'name')
            if nb.get("title") == notebook_name or nb.get("name") == notebook_name:
                target_id = nb.get("id") or nb.get("notebookId")
                break
        
        if not target_id:
            print(f"Error: Notebook '{notebook_name}' not found. Available: {[n.get('title', 'Unknown') for n in notebooks]}")
            return None

        print(f"Found notebook ID: {target_id}. Sending query...")

        # 3. Query Notebook
        # Common args for notebook_query: 'notebookId', 'query'
        query_result = await self.session.call_tool("notebook_query", arguments={"notebookId": target_id, "query": query})
        return query_result
