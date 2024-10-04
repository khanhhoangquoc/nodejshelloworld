export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
	BINDING_NAME: KVNamespace;
  }
  
  export default {
	async fetch(request, env, ctx): Promise<Response> {
	  const { pathname } = new URL(request.url);
  
	  if (pathname === "/api/test_pages") {
		// If you did not use `DB` as your binding name, change it here
		const { results } = await env.DB.prepare(
		  "SELECT * FROM Customers WHERE CompanyName = ?",
		)
		  .bind("Around the Horn")
		  .all();
		return Response.json(results);
	  }

	  if (pathname === "/api/test_kv") {
		try {
			// await env.BINDING_NAME.put("KEY", "VALUE");
			const value = await env.BINDING_NAME.get("KEY");
			if (value === null) {
			  return new Response("Value not found", { status: 404 });
			}
			return new Response("Value of KV KEY: " + value);
		  } catch (err) {
			// In a production application, you could instead choose to retry your KV
			// read or fall back to a default code path.
			console.error(`KV returned error: ${err}`);
			return new Response(err, { status: 500 });
		  }
	  }
  
	  return new Response(
		"Call /api/test_pages to see test about pages or /api/test_kv to see test about kv",
	  );
	},
  } satisfies ExportedHandler<Env>;