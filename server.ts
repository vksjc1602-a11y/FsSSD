/**
 * AEGIS Full-Stack Express Server
 * Serves real REST API endpoints under /api/v1/* and mounts Vite middlewares in development.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { analyzeMessageOrInput } from './src/engine/riskEngine.ts';
import { THREAT_INTELLIGENCE_ENTITIES, INITIAL_NETWORK_NODES, INITIAL_NETWORK_EDGES, INITIAL_ALERTS, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS } from './src/engine/threatStore.ts';
import { INITIAL_DATASETS, executeDatasetNormalization } from './src/engine/datasetStore.ts';
import { INITIAL_MODELS } from './src/engine/modelStore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // AEGIS REST API ROUTES (/api/v1/...)
  // ==========================================

  // 1. Health check
  app.get('/api/v1/health', (_req, res) => {
    res.json({
      status: 'ONLINE',
      system: 'AEGIS Financial Threat Intelligence',
      version: 'v3.4.1',
      engine: 'ACTIVE_DEFENSE',
      timestamp: new Date().toISOString()
    });
  });

  // 2. Scan Message / SMS
  app.post('/api/v1/scan/message', (req, res) => {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "message" string parameter' });
      return;
    }
    const result = analyzeMessageOrInput(message, 'MESSAGE');
    res.json(result);
  });

  // 3. Scan URL
  app.post('/api/v1/scan/url', (req, res) => {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "url" string parameter' });
      return;
    }
    const result = analyzeMessageOrInput(url, 'URL');
    res.json(result);
  });

  // 4. Scan Transaction
  app.post('/api/v1/scan/transaction', (req, res) => {
    const { narrative, amount, recipient_id, channel } = req.body || {};
    const text = narrative || `Transfer of ${amount || 1000} to ${recipient_id || 'UNKNOWN'}`;
    const result = analyzeMessageOrInput(text, 'TRANSACTION');
    res.json(result);
  });

  // 5. Threat Intelligence Entities
  app.get('/api/v1/threats', (_req, res) => {
    res.json({
      total: THREAT_INTELLIGENCE_ENTITIES.length,
      entities: THREAT_INTELLIGENCE_ENTITIES
    });
  });

  // 6. Network Topology
  app.get('/api/v1/network', (_req, res) => {
    res.json({
      nodes: INITIAL_NETWORK_NODES,
      edges: INITIAL_NETWORK_EDGES
    });
  });

  // 7. Real-Time Alerts
  app.get('/api/v1/alerts', (_req, res) => {
    res.json({
      total: INITIAL_ALERTS.length,
      alerts: INITIAL_ALERTS
    });
  });

  // 8. Transactions Stream
  app.get('/api/v1/transactions', (_req, res) => {
    res.json({
      total: INITIAL_TRANSACTIONS.length,
      transactions: INITIAL_TRANSACTIONS
    });
  });

  // 9. Datasets & Pipeline
  app.get('/api/v1/datasets', (_req, res) => {
    res.json({
      total: INITIAL_DATASETS.length,
      datasets: INITIAL_DATASETS
    });
  });

  app.post('/api/v1/datasets/:id/normalize', (req, res) => {
    const { id } = req.params;
    const found = INITIAL_DATASETS.find((d) => d.id === id);
    if (!found) {
      res.status(404).json({ error: `Dataset ${id} not found` });
      return;
    }
    const report = executeDatasetNormalization(found);
    res.json({ success: true, report });
  });

  // 10. Models Registry
  app.get('/api/v1/models', (_req, res) => {
    res.json({
      total: INITIAL_MODELS.length,
      models: INITIAL_MODELS
    });
  });

  // 11. Security Audit Logs
  app.get('/api/v1/security/audit-logs', (_req, res) => {
    res.json({
      total: INITIAL_AUDIT_LOGS.length,
      logs: INITIAL_AUDIT_LOGS
    });
  });

  // 12. Feedback loop
  app.post('/api/v1/feedback', (req, res) => {
    const { scan_id, feedback_type, notes } = req.body || {};
    res.json({
      success: true,
      recorded_at: new Date().toISOString(),
      scan_id,
      feedback_type,
      notes
    });
  });

  // ==========================================
  // VITE INTEGRATION
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AEGIS] Threat Intelligence Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AEGIS] Failed to initialize server:', err);
  process.exit(1);
});
