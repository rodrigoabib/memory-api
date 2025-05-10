// api/index.js
const { json } = require('body-parser');
const express = require('express');
const KnowledgeGraphManager = require('../lib/knowledge-graph-manager');

// Create Express app
const app = express();
app.use(json());

const knowledgeGraphManager = new KnowledgeGraphManager();

// Define routes
app.get('/api/graph', async (req, res) => {
  try {
    const graph = await knowledgeGraphManager.readGraph();
    res.json(graph);
  } catch (error) {
    console.error('Error reading graph:', error);
    res.status(500).json({ error: 'Failed to read knowledge graph' });
  }
});

app.get('/api/graph/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const result = await knowledgeGraphManager.searchNodes(query);
    res.json(result);
  } catch (error) {
    console.error('Error searching nodes:', error);
    res.status(500).json({ error: 'Failed to search knowledge graph' });
  }
});

app.post('/api/graph/nodes', async (req, res) => {
  try {
    const { names } = req.body;
    if (!names || !Array.isArray(names)) {
      return res.status(400).json({ error: 'Names array is required' });
    }
    const result = await knowledgeGraphManager.openNodes(names);
    res.json(result);
  } catch (error) {
    console.error('Error opening nodes:', error);
    res.status(500).json({ error: 'Failed to open nodes' });
  }
});

app.post('/api/entities', async (req, res) => {
  try {
    const { entities } = req.body;
    if (!entities || !Array.isArray(entities)) {
      return res.status(400).json({ error: 'Entities array is required' });
    }
    const result = await knowledgeGraphManager.createEntities(entities);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating entities:', error);
    res.status(500).json({ error: 'Failed to create entities' });
  }
});

app.delete('/api/entities', async (req, res) => {
  try {
    const { entityNames } = req.body;
    if (!entityNames || !Array.isArray(entityNames)) {
      return res.status(400).json({ error: 'EntityNames array is required' });
    }
    await knowledgeGraphManager.deleteEntities(entityNames);
    res.status(200).json({ message: 'Entities deleted successfully' });
  } catch (error) {
    console.error('Error deleting entities:', error);
    res.status(500).json({ error: 'Failed to delete entities' });
  }
});

app.post('/api/relations', async (req, res) => {
  try {
    const { relations } = req.body;
    if (!relations || !Array.isArray(relations)) {
      return res.status(400).json({ error: 'Relations array is required' });
    }
    const result = await knowledgeGraphManager.createRelations(relations);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating relations:', error);
    res.status(500).json({ error: 'Failed to create relations' });
  }
});

app.delete('/api/relations', async (req, res) => {
  try {
    const { relations } = req.body;
    if (!relations || !Array.isArray(relations)) {
      return res.status(400).json({ error: 'Relations array is required' });
    }
    await knowledgeGraphManager.deleteRelations(relations);
    res.status(200).json({ message: 'Relations deleted successfully' });
  } catch (error) {
    console.error('Error deleting relations:', error);
    res.status(500).json({ error: 'Failed to delete relations' });
  }
});

app.post('/api/observations', async (req, res) => {
  try {
    const { observations } = req.body;
    if (!observations || !Array.isArray(observations)) {
      return res.status(400).json({ error: 'Observations array is required' });
    }
    const result = await knowledgeGraphManager.addObservations(observations);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding observations:', error);
    res.status(500).json({ error: 'Failed to add observations' });
  }
});

app.delete('/api/observations', async (req, res) => {
  try {
    const { deletions } = req.body;
    if (!deletions || !Array.isArray(deletions)) {
      return res.status(400).json({ error: 'Deletions array is required' });
    }
    await knowledgeGraphManager.deleteObservations(deletions);
    res.status(200).json({ message: 'Observations deleted successfully' });
  } catch (error) {
    console.error('Error deleting observations:', error);
    res.status(500).json({ error: 'Failed to delete observations' });
  }
});

// Export the Express app as a serverless function
module.exports = app;