# graphrag-pillar-two-demo
Interactive GraphRAG demo for the OECD Pillar Two Global Minimum Tax framework. Visualizes a knowledge graph (18 entities, 22 relationships) with configurable BFS traversal (1–3 hops), source document linking, and LLM prompt generation. Bilingual EN/DE UI. Built with React 18 and Tailwind CSS. No backend required.
# 🔗 GraphRAG Pillar Two Demo

**Interactive Knowledge Graph Retrieval for OECD Pillar Two Tax Framework**
*Interaktive Wissensgraph-Abfrage für das OECD-Pillar-Two-Steuerrahmenwerk*

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview / Überblick

This project demonstrates **GraphRAG** (Graph-based Retrieval-Augmented Generation) applied to international tax law — specifically the OECD Pillar Two Global Minimum Tax framework.

*Dieses Projekt demonstriert **GraphRAG** (graphbasierte, abrufgestützte Generierung) angewandt auf internationales Steuerrecht — insbesondere das OECD-Pillar-Two-Rahmenwerk zur globalen Mindestbesteuerung.*

Unlike traditional RAG, which relies on vector similarity search over text chunks, GraphRAG traverses a **knowledge graph** to discover cross-document reasoning chains — such as `QDMTT → Top-up Tax → ETR → 15% → China`.

*Im Gegensatz zu herkömmlichem RAG, das auf Vektorähnlichkeitssuche über Textfragmente setzt, traversiert GraphRAG einen **Wissensgraphen**, um dokumentübergreifende Schlussfolgerungsketten zu entdecken — wie z. B. „QDMTT → Top-up Tax → ETR → 15 % → China".*

---

## ✨ Features / Funktionen

- **Interactive Knowledge Graph** / *Interaktiver Wissensgraph* — 18 entities, 22 relationships covering Pillar Two concepts
- **BFS Traversal Retrieval** / *BFS-Traversalsuche* — Configurable 1–3 hop graph exploration
- **Source Document Linking** / *Quelldokument-Verknüpfung* — Each edge maps back to its source document
- **LLM Prompt Generation** / *LLM-Prompt-Generierung* — View the structured prompt built from graph context
- **Bilingual UI** / *Zweisprachige Oberfläche* — English and German (Deutsch)
- **Dark Theme** / *Dunkles Design* — Professional data-visualization aesthetic

---

## 🖼️ Screenshot / Bildschirmfoto

![Demo Screenshot](docs/screenshot.png)

---

## 🚀 Quick Start / Schnellstart

### Prerequisites / Voraussetzungen

- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# Clone the repository / Repository klonen
git clone https://github.com/YOUR_USERNAME/graphrag-pillar-two-demo.git
cd graphrag-pillar-two-demo

# Install dependencies / Abhängigkeiten installieren
npm install

# Start development server / Entwicklungsserver starten
npm run dev
