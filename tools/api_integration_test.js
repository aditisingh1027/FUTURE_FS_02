(async () => {
  const base = 'http://localhost:5000';
  const email = `apitest${Date.now()}@example.com`;
  const password = 'Password123';

  const log = (title, obj) => console.log('\n== ' + title + ' ==\n', typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));

  // Helper to extract cookie string from response headers
  const extractCookie = (headers) => {
    const raw = headers.get('set-cookie');
    if (!raw) return null;
    // raw may contain multiple cookies separated by comma; take whole string until first ';' for token
    const parts = raw.split(';');
    return parts[0];
  };

  try {
    // Register
    const regRes = await fetch(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'API Test', email, password }),
    });
    const regJson = await regRes.json().catch(() => ({}));
    const cookie = extractCookie(regRes.headers) || null;
    log('Register Response', { status: regRes.status, body: regJson, cookie });

    // If registration returned cookie, use it. Else try login
    let authCookie = cookie;
    if (!authCookie) {
      const loginRes = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginJson = await loginRes.json().catch(() => ({}));
      authCookie = extractCookie(loginRes.headers);
      log('Login Response', { status: loginRes.status, body: loginJson, cookie: authCookie });
    }

    if (!authCookie) {
      console.error('No auth cookie received; aborting tests.');
      process.exit(1);
    }

    // Get current user
    const meRes = await fetch(base + '/api/auth/me', { headers: { Cookie: authCookie } });
    const meJson = await meRes.json().catch(() => ({}));
    log('GET /api/auth/me', { status: meRes.status, body: meJson });

    // Create a lead
    const leadData = { name: 'Integration Lead', email: 'lead@example.com', phone: '+1234567890', source: 'website', status: 'new', notes: [{ content: 'Initial note' }], followUpDate: new Date(Date.now() + 24*3600*1000).toISOString() };
    const createRes = await fetch(base + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify(leadData) });
    const createJson = await createRes.json().catch(() => ({}));
    log('POST /api/leads', { status: createRes.status, body: createJson });
    const leadId = createJson.lead && createJson.lead._id;

    if (!leadId) {
      console.error('Lead not created; aborting.');
      process.exit(1);
    }

    // Update lead
    const updateRes = await fetch(base + `/api/leads/${leadId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify({ phone: '+1987654321' }) });
    const updateJson = await updateRes.json().catch(() => ({}));
    log('PUT /api/leads/:id', { status: updateRes.status, body: updateJson });

    // Add note
    const noteRes = await fetch(base + `/api/leads/${leadId}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify({ content: 'Followed up via email' }) });
    const noteJson = await noteRes.json().catch(() => ({}));
    log('POST /api/leads/:id/notes', { status: noteRes.status, body: noteJson });

    // Change status
    const statusRes = await fetch(base + `/api/leads/${leadId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify({ status: 'contacted' }) });
    const statusJson = await statusRes.json().catch(() => ({}));
    log('PUT /api/leads/:id (status)', { status: statusRes.status, body: statusJson });

    // Schedule follow-up: create another lead with overdue date
    const pastDate = new Date(Date.now() - 2*24*3600*1000).toISOString();
    const futureDate = new Date(Date.now() + 3*24*3600*1000).toISOString();
    const overdueRes = await fetch(base + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify({ name: 'Overdue Lead', followUpDate: pastDate }) });
    const overdueJson = await overdueRes.json().catch(() => ({}));
    const upcomingRes = await fetch(base + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: authCookie }, body: JSON.stringify({ name: 'Upcoming Lead', followUpDate: futureDate }) });
    const upcomingJson = await upcomingRes.json().catch(() => ({}));
    log('Created follow-up leads', { overdue: overdueJson, upcoming: upcomingJson });

    // Dashboard stats
    const statsRes = await fetch(base + '/api/dashboard/stats', { headers: { Cookie: authCookie } });
    const statsJson = await statsRes.json().catch(() => ({}));
    log('GET /api/dashboard/stats', { status: statsRes.status, body: statsJson });

    const chartsRes = await fetch(base + '/api/dashboard/charts', { headers: { Cookie: authCookie } });
    const chartsJson = await chartsRes.json().catch(() => ({}));
    log('GET /api/dashboard/charts', { status: chartsRes.status, body: chartsJson });

    const followupsRes = await fetch(base + '/api/dashboard/followups', { headers: { Cookie: authCookie } });
    const followupsJson = await followupsRes.json().catch(() => ({}));
    log('GET /api/dashboard/followups', { status: followupsRes.status, body: followupsJson });

    // Delete the first lead
    const delRes = await fetch(base + `/api/leads/${leadId}`, { method: 'DELETE', headers: { Cookie: authCookie } });
    const delJson = await delRes.json().catch(() => ({}));
    log('DELETE /api/leads/:id', { status: delRes.status, body: delJson });

    console.log('\nIntegration tests complete.');
  } catch (err) {
    console.error('Error during integration test:', err);
    process.exit(1);
  }
})();