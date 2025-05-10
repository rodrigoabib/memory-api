// lib/knowledge-graph-manager.js
import { createClient } from "@vercel/kv";

// lib/knowledge-graph-manager.js
import { createClient } from "@vercel/kv";

// Agora criamos o client sempre mandando a URL e o token que estão no process.env:
const kv = createClient({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

class KnowledgeGraphManager {
  /**
   * Chave única para armazenar o grafo no KV Storage
   */
  static GRAPH_KEY = 'knowledge_graph';

  /**
   * Load the knowledge graph from KV Storage
   * @returns {Promise<KnowledgeGraph>}
   */
  async loadGraph() {
    try {
      const graph = await kv.get(KnowledgeGraphManager.GRAPH_KEY);
      return graph || { entities: [], relations: [] };
    } catch (error) {
      console.error('Error loading graph from KV:', error);
      return { entities: [], relations: [] };
    }
  }

  /**
   * Save the knowledge graph to KV Storage
   * @param {KnowledgeGraph} graph 
   * @returns {Promise<void>}
   */
  async saveGraph(graph) {
    try {
      await kv.set(KnowledgeGraphManager.GRAPH_KEY, graph);
    } catch (error) {
      console.error('Error saving graph to KV:', error);
      throw error;
    }
  }

  // Outros métodos permanecem iguais, apenas removendo a manipulação de arquivos
  // e usando o loadGraph e saveGraph adaptados para KV Storage
  
  /**
   * Create multiple new entities in the knowledge graph
   * @param {Entity[]} entities 
   * @returns {Promise<Entity[]>}
   */
  async createEntities(entities) {
    const graph = await this.loadGraph();
    const newEntities = entities.filter(e => !graph.entities.some(existingEntity => existingEntity.name === e.name));
    graph.entities.push(...newEntities);
    await this.saveGraph(graph);
    return newEntities;
  }

  /**
   * Create multiple new relations between entities
   * @param {Relation[]} relations 
   * @returns {Promise<Relation[]>}
   */
  async createRelations(relations) {
    const graph = await this.loadGraph();
    const newRelations = relations.filter(r => !graph.relations.some(existingRelation => 
      existingRelation.from === r.from && 
      existingRelation.to === r.to && 
      existingRelation.relationType === r.relationType
    ));
    graph.relations.push(...newRelations);
    await this.saveGraph(graph);
    return newRelations;
  }

  /**
   * Add new observations to existing entities
   * @param {Array<{entityName: string, contents: string[]}>} observations 
   * @returns {Promise<Array<{entityName: string, addedObservations: string[]}>>}
   */
  async addObservations(observations) {
    const graph = await this.loadGraph();
    const results = observations.map(o => {
      const entity = graph.entities.find(e => e.name === o.entityName);
      if (!entity) {
        throw new Error(`Entity with name ${o.entityName} not found`);
      }
      const newObservations = o.contents.filter(content => !entity.observations.includes(content));
      entity.observations.push(...newObservations);
      return { entityName: o.entityName, addedObservations: newObservations };
    });
    await this.saveGraph(graph);
    return results;
  }

  /**
   * Delete multiple entities and their associated relations
   * @param {string[]} entityNames 
   * @returns {Promise<void>}
   */
  async deleteEntities(entityNames) {
    const graph = await this.loadGraph();
    graph.entities = graph.entities.filter(e => !entityNames.includes(e.name));
    graph.relations = graph.relations.filter(r => !entityNames.includes(r.from) && !entityNames.includes(r.to));
    await this.saveGraph(graph);
  }

  /**
   * Delete specific observations from entities
   * @param {Array<{entityName: string, observations: string[]}>} deletions 
   * @returns {Promise<void>}
   */
  async deleteObservations(deletions) {
    const graph = await this.loadGraph();
    deletions.forEach(d => {
      const entity = graph.entities.find(e => e.name === d.entityName);
      if (entity) {
        entity.observations = entity.observations.filter(o => !d.observations.includes(o));
      }
    });
    await this.saveGraph(graph);
  }

  /**
   * Delete multiple relations from the knowledge graph
   * @param {Relation[]} relations 
   * @returns {Promise<void>}
   */
  async deleteRelations(relations) {
    const graph = await this.loadGraph();
    graph.relations = graph.relations.filter(r => !relations.some(delRelation => 
      r.from === delRelation.from && 
      r.to === delRelation.to && 
      r.relationType === delRelation.relationType
    ));
    await this.saveGraph(graph);
  }

  /**
   * Read the entire knowledge graph
   * @returns {Promise<KnowledgeGraph>}
   */
  async readGraph() {
    return this.loadGraph();
  }

  /**
   * Search for nodes in the knowledge graph based on a query
   * @param {string} query 
   * @returns {Promise<KnowledgeGraph>}
   */
  async searchNodes(query) {
    const graph = await this.loadGraph();
    
    // Filter entities
    const filteredEntities = graph.entities.filter(e => 
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.entityType.toLowerCase().includes(query.toLowerCase()) ||
      e.observations.some(o => o.toLowerCase().includes(query.toLowerCase()))
    );
  
    // Create a Set of filtered entity names for quick lookup
    const filteredEntityNames = new Set(filteredEntities.map(e => e.name));
  
    // Filter relations to only include those between filtered entities
    const filteredRelations = graph.relations.filter(r => 
      filteredEntityNames.has(r.from) && filteredEntityNames.has(r.to)
    );
  
    return {
      entities: filteredEntities,
      relations: filteredRelations,
    };
  }

  /**
   * Open specific nodes in the knowledge graph by their names
   * @param {string[]} names 
   * @returns {Promise<KnowledgeGraph>}
   */
  async openNodes(names) {
    const graph = await this.loadGraph();
    
    // Filter entities
    const filteredEntities = graph.entities.filter(e => names.includes(e.name));
  
    // Create a Set of filtered entity names for quick lookup
    const filteredEntityNames = new Set(filteredEntities.map(e => e.name));
  
    // Filter relations to only include those between filtered entities
    const filteredRelations = graph.relations.filter(r => 
      filteredEntityNames.has(r.from) && filteredEntityNames.has(r.to)
    );
  
    return {
      entities: filteredEntities,
      relations: filteredRelations,
    };
  }
}

module.exports = KnowledgeGraphManager;
