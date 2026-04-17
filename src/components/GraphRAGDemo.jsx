import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, Info, Database, GitBranch, FileText, X } from 'lucide-react';

const nodes = [
  { id: 'pillar2', label: 'Pillar Two', type: 'Framework', x: 400, y: 250 },
  { id: 'globe', label: 'GloBE Rules', type: 'Regulation', x: 280, y: 150 },
  { id: 'oecd', label: 'OECD', type: 'Organization', x: 520, y: 100 },
  { id: 'iir', label: 'IIR', type: 'Rule', x: 150, y: 80 },
  { id: 'utpr', label: 'UTPR', type: 'Rule', x: 180, y: 200 },
  { id: 'eu', label: 'EU', type: 'Jurisdiction', x: 550, y: 250 },
  { id: 'directive', label: 'Min Tax Directive', type: 'Legislation', x: 650, y: 180 },
  { id: 'china', label: 'China', type: 'Jurisdiction', x: 250, y: 380 },
  { id: 'sta', label: 'STA', type: 'Authority', x: 120, y: 430 },
  { id: 'golden', label: 'Golden Tax IV', type: 'System', x: 100, y: 340 },
  { id: 'etr', label: 'ETR', type: 'Concept', x: 400, y: 400 },
  { id: 'topup', label: 'Top-up Tax', type: 'Mechanism', x: 500, y: 380 },
  { id: 'qdmtt', label: 'QDMTT', type: 'Mechanism', x: 600, y: 350 },
  { id: 'rate15', label: '15% Rate', type: 'Rate', x: 350, y: 130 },
  { id: 'finbert', label: 'FinBERT', type: 'AI_Model', x: 650, y: 450 },
  { id: 'graphrag', label: 'GraphRAG', type: 'Method', x: 550, y: 480 },
  { id: 'mnes', label: 'MNEs', type: 'Entity_Type', x: 450, y: 50 },
  { id: 'eur750', label: 'EUR 750M', type: 'Threshold', x: 320, y: 50 },
];

const edges = [
  { from: 'pillar2', to: 'globe', doc: 'doc1' },
  { from: 'pillar2', to: 'oecd', doc: 'doc1' },
  { from: 'pillar2', to: 'rate15', doc: 'doc1' },
  { from: 'globe', to: 'iir', doc: 'doc1' },
  { from: 'globe', to: 'utpr', doc: 'doc1' },
  { from: 'globe', to: 'etr', doc: 'doc4' },
  { from: 'globe', to: 'topup', doc: 'doc4' },
  { from: 'eu', to: 'directive', doc: 'doc2' },
  { from: 'directive', to: 'iir', doc: 'doc2' },
  { from: 'directive', to: 'globe', doc: 'doc2' },
  { from: 'china', to: 'sta', doc: 'doc3' },
  { from: 'china', to: 'golden', doc: 'doc3' },
  { from: 'china', to: 'rate15', doc: 'doc3' },
  { from: 'etr', to: 'topup', doc: 'doc4' },
  { from: 'etr', to: 'rate15', doc: 'doc4' },
  { from: 'topup', to: 'qdmtt', doc: 'doc4' },
  { from: 'qdmtt', to: 'iir', doc: 'doc4' },
  { from: 'finbert', to: 'graphrag', doc: 'doc5' },
  { from: 'oecd', to: 'mnes', doc: 'doc1' },
  { from: 'mnes', to: 'eur750', doc: 'doc1' },
  { from: 'pillar2', to: 'eu', doc: 'doc2' },
  { from: 'pillar2', to: 'china', doc: 'doc3' },
];

const typeColors = {
  Framework: '#4ECDC4',
  Regulation: '#45B7D1',
  Organization: '#FF6B6B',
  Rule: '#96CEB4',
  Jurisdiction: '#FFEAA7',
  Legislation: '#DDA0DD',
  Authority: '#98D8C8',
  System: '#F7DC6F',
  Concept: '#BB8FCE',
  Mechanism: '#85C1E9',
  Rate: '#F8C471',
  Threshold: '#82E0AA',
  AI_Model: '#F1948A',
  Method: '#E8DAEF',
  Entity_Type: '#AED6F1',
};

const documents = {
  doc1: { source: 'OECD Model Rules', text: 'Pillar Two establishes 15% global minimum tax for MNEs with revenue > EUR 750M. GloBE rules include IIR and UTPR.' },
  doc2: { source: 'EU Directive 2022/2523', text: 'EU adopted Minimum Tax Directive in Dec 2022, requiring transposition of GloBE rules.' },
  doc3: { source: 'China Tax Policy', text: 'China signals alignment with 15% rate. Golden Tax IV uses AI monitoring.' },
  doc4: { source: 'GloBE Commentary', text: 'ETR calculated per jurisdiction. Below 15% triggers top-up tax. QDMTT allows domestic collection before IIR.' },
  doc5: { source: 'NLP Methodology', text: 'FinBERT + knowledge graph = GraphRAG for semantic retrieval of tax regulatory structure.' },
};

function bfsRetrieve(startId, hops) {
  const visited = new Set();
  let frontier = new Set([startId]);
  const resultNodes = new Map();
  const resultEdges = [];

  for (let hop = 0; hop <= hops; hop++) {
    const nextFrontier = new Set();
    for (const nid of frontier) {
      if (visited.has(nid)) continue;
      visited.add(nid);
      resultNodes.set(nid, hop);
      for (const edge of edges) {
        let neighbor = null;
        if (edge.from === nid) neighbor = edge.to;
        else if (edge.to === nid) neighbor = edge.from;
        if (neighbor && !visited.has(neighbor)) {
          nextFrontier.add(neighbor);
          if (hop < hops) {
            resultEdges.push({ ...edge, hop });
          }
        }
      }
    }
    frontier = nextFrontier;
  }
  return { nodes: resultNodes, edges: resultEdges };
}

export default function GraphRAGDemo() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hops, setHops] = useState(1);
  const [retrieval, setRetrieval] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [searchText, setSearchText] = useState('');
  const svgRef = useRef(null);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node.id);
    const result = bfsRetrieve(node.id, hops);
    setRetrieval(result);
    setShowPrompt(false);
  }, [hops]);

  useEffect(() => {
    if (selectedNode) {
      const result = bfsRetrieve(selectedNode, hops);
      setRetrieval(result);
    }
  }, [hops, selectedNode]);

  const filteredNode = searchText
    ? nodes.find(n => n.label.toLowerCase().includes(searchText.toLowerCase()))
    : null;

  useEffect(() => {
    if (filteredNode && filteredNode.id !== selectedNode) {
      handleNodeClick(filteredNode);
    }
  }, [filteredNode, selectedNode, handleNodeClick]);

  const isHighlighted = (nodeId) => retrieval && retrieval.nodes.has(nodeId);
  const isEdgeHighlighted = (edge) => {
    if (!retrieval) return false;
    return retrieval.edges.some(e =>
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    );
  };

  const getNodeHop = (nodeId) => retrieval ? retrieval.nodes.get(nodeId) : null;

  const relevantDocs = retrieval
    ? [...new Set(retrieval.edges.map(e => e.doc))]
    : [];

  const buildPromptText = () => {
    if (!retrieval || !selectedNode) return '';
    const node = nodes.find(n => n.id === selectedNode);
    let text = `QUESTION: Explain "${node.label}" in the Pillar Two framework.\n`;
    text += `FRAGE: Erklären Sie "${node.label}" im Rahmen von Pillar Two.\n\n`;
    text += `KNOWLEDGE GRAPH CONTEXT / WISSENSGRAPH-KONTEXT:\n`;
    text += `Entities / Entitäten:\n`;
    for (const [nid, hop] of retrieval.nodes) {
      const n = nodes.find(x => x.id === nid);
      text += `  [Hop ${hop} / Sprung ${hop}] ${n.label} (${n.type})\n`;
    }
    text += `\nRelationships / Beziehungen:\n`;
    for (const e of retrieval.edges) {
      const from = nodes.find(x => x.id === e.from);
      const to = nodes.find(x => x.id === e.to);
      text += `  ${from.label} ↔ ${to.label}\n`;
    }
    text += `\nSOURCE DOCUMENTS / QUELLDOKUMENTE:\n`;
    for (const did of relevantDocs) {
      const doc = documents[did];
      text += `[${doc.source}]: ${doc.text}\n`;
    }
    return text;
  };

  const offsetX = 20;
  const offsetY = 10;

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400 mb-0">GraphRAG Interactive Demo</h1>
        <p className="text-cyan-600 text-sm mb-1 italic">GraphRAG Interaktive Demo</p>
        <p className="text-gray-400 text-sm">Pillar Two Tax Knowledge Graph — Click any node to trigger graph traversal retrieval</p>
        <p className="text-gray-500 text-xs mb-4 italic">Pillar-Two-Steuer-Wissensgraph — Klicken Sie auf einen beliebigen Knoten, um die Graphtraversalsuche auszulösen</p>

        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search entity... / Entität suchen..."
              className="bg-transparent text-sm outline-none w-48 text-gray-200 placeholder-gray-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <GitBranch size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Hops / Sprünge:</span>
            {[1, 2, 3].map(h => (
              <button
                key={h}
                onClick={() => setHops(h)}
                className={`px-2 py-0.5 rounded text-sm font-mono ${
                  hops === h ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="p-1.5 bg-gray-800 rounded hover:bg-gray-700">
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 bg-gray-800 rounded hover:bg-gray-700">
              <ZoomIn size={16} />
            </button>
          </div>

          {selectedNode && (
            <button
              onClick={() => { setSelectedNode(null); setRetrieval(null); setShowPrompt(false); }}
              className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-1"
            >
              <X size={14} /> Clear / Löschen
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${780 / zoom} ${530 / zoom}`}
              className="w-full"
              style={{ minHeight: '400px' }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {edges.map((edge, i) => {
                const from = nodes.find(n => n.id === edge.from);
                const to = nodes.find(n => n.id === edge.to);
                const highlighted = isEdgeHighlighted(edge);
                return (
                  <line
                    key={i}
                    x1={from.x + offsetX}
                    y1={from.y + offsetY}
                    x2={to.x + offsetX}
                    y2={to.y + offsetY}
                    stroke={highlighted ? '#22d3ee' : '#374151'}
                    strokeWidth={highlighted ? 2.5 : 1}
                    opacity={retrieval ? (highlighted ? 0.9 : 0.15) : 0.4}
                  />
                );
              })}

              {nodes.map((node) => {
                const highlighted = isHighlighted(node.id);
                const hop = getNodeHop(node.id);
                const isSelected = selectedNode === node.id;
                const color = typeColors[node.type] || '#888';
                const dimmed = retrieval && !highlighted;
                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer"
                    opacity={dimmed ? 0.15 : 1}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  >
                    <circle
                      cx={node.x + offsetX}
                      cy={node.y + offsetY}
                      r={isSelected ? 28 : highlighted ? 24 : 20}
                      fill={color}
                      stroke={isSelected ? '#fff' : highlighted ? '#22d3ee' : 'transparent'}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={0.85}
                    />
                    {hop !== null && hop !== undefined && (
                      <circle
                        cx={node.x + offsetX + 16}
                        cy={node.y + offsetY - 16}
                        r={8}
                        fill={hop === 0 ? '#ef4444' : hop === 1 ? '#f59e0b' : '#22c55e'}
                      />
                    )}
                    {hop !== null && hop !== undefined && (
                      <text
                        x={node.x + offsetX + 16}
                        y={node.y + offsetY - 12}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#fff"
                        fontWeight="bold"
                      >
                        {hop}
                      </text>
                    )}
                    <text
                      x={node.x + offsetX}
                      y={node.y + offsetY + 36}
                      textAnchor="middle"
                      fontSize="10"
                      fill={highlighted ? '#e5e7eb' : '#9ca3af'}
                      fontWeight={highlighted ? 'bold' : 'normal'}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="px-4 py-2 border-t border-gray-800 flex flex-wrap gap-3">
              {Object.entries(typeColors).slice(0, 8).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-400">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {selectedNode && retrieval ? (
              <>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Database size={16} className="text-cyan-400" />
                    <h3 className="font-semibold text-cyan-400 text-sm">Retrieval Results / Abrufergebnisse</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    Starting from <span className="text-white font-bold">{nodes.find(n => n.id === selectedNode)?.label}</span>, {hops}-hop retrieval
                  </p>
                  <p className="text-xs text-gray-500 italic mb-2">
                    Ausgehend von <span className="text-white font-bold">{nodes.find(n => n.id === selectedNode)?.label}</span>, {hops}-Sprung-Abruf
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[...retrieval.nodes.entries()].sort((a, b) => a[1] - b[1]).map(([nid, hop]) => {
                      const n = nodes.find(x => x.id === nid);
                      return (
                        <div key={nid} className="flex items-center gap-2 text-xs">
                          <span className={`px-1.5 py-0.5 rounded font-mono ${
                            hop === 0 ? 'bg-red-900 text-red-300' :
                            hop === 1 ? 'bg-amber-900 text-amber-300' :
                            'bg-green-900 text-green-300'
                          }`}>
                            H{hop}
                          </span>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[n.type] }} />
                          <span className="text-gray-300">{n.label}</span>
                          <span className="text-gray-600 text-xs">{n.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-purple-400" />
                    <h3 className="font-semibold text-purple-400 text-sm">Related Documents / Zugehörige Dokumente</h3>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {relevantDocs.length > 0 ? relevantDocs.map(did => {
                      const doc = documents[did];
                      return (
                        <div key={did} className="bg-gray-800 rounded p-2">
                          <p className="text-xs font-semibold text-yellow-400">{doc.source}</p>
                          <p className="text-xs text-gray-400 mt-1">{doc.text}</p>
                        </div>
                      );
                    }) : (
                      <p className="text-xs text-gray-500">No related documents / Keine zugehörigen Dokumente</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full py-2 px-4 bg-cyan-800 hover:bg-cyan-700 rounded-lg text-sm font-medium text-cyan-100 transition-colors"
                >
                  {showPrompt ? 'Hide / Ausblenden' : 'View / Anzeigen'} Generated LLM Prompt / Generierter LLM-Prompt
                </button>

                {showPrompt && (
                  <div className="bg-gray-900 rounded-xl border border-cyan-800 p-4">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                      {buildPromptText()}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center text-center">
                <Info size={32} className="text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">Click any node in the graph</p>
                <p className="text-gray-500 text-xs italic">Klicken Sie auf einen beliebigen Knoten im Graphen</p>
                <p className="text-gray-500 text-xs mt-2">Trigger GraphRAG retrieval to view related entities and source documents</p>
                <p className="text-gray-600 text-xs italic">GraphRAG-Abruf auslösen, um verknüpfte Entitäten und Quelldokumente anzuzeigen</p>
              </div>
            )}

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="font-semibold text-gray-300 text-sm mb-2">GraphRAG vs. Standard RAG / GraphRAG vs. Standard-RAG</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-800 rounded p-2">
                  <p className="text-red-400 font-semibold">Standard RAG / Standard-RAG</p>
                  <p className="text-gray-400">Uses vector similarity to search text chunks; may miss structural connections across documents.</p>
                  <p className="text-gray-500 italic mt-1">Verwendet Vektorähnlichkeit zur Suche von Textfragmenten; kann strukturelle Zusammenhänge über Dokumente hinweg übersehen.</p>
                </div>
                <div className="bg-gray-800 rounded p-2">
                  <p className="text-cyan-400 font-semibold">GraphRAG</p>
                  <p className="text-gray-400">Traverses relationship edges in the knowledge graph, discovering cross-document reasoning chains like "QDMTT → top-up tax → ETR → 15% → China".</p>
                  <p className="text-gray-500 italic mt-1">Traversiert Beziehungskanten im Wissensgraphen und entdeckt dokumentübergreifende Schlussfolgerungsketten wie „QDMTT → Top-up Tax → ETR → 15 % → China".</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
