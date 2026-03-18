/**
 * BranchData.js - Multiverse branch definitions
 */

export const BRANCHES = [
  {
    id: 'origin',
    name: 'Origin Branch',
    biome: 'Balanced',
    seed: 12345,
    skyTop: '#0a0a2e',
    skyBottom: '#2a3060',
    accent: '#6080cc',
    mountainColor1: 'rgba(30,30,60,0.5)',
    mountainColor2: 'rgba(20,20,45,0.6)',
    starColor: 'rgba(200,200,255,0.6)',
    glowColor: 'rgba(60,80,150,0.15)',
  },
  {
    id: 'wild1',
    name: 'Crimson Dusk',
    biome: 'Volcanic',
    seed: 67890,
    skyTop: '#1a0520',
    skyBottom: '#4a2040',
    accent: '#cc5577',
    mountainColor1: 'rgba(60,20,40,0.5)',
    mountainColor2: 'rgba(45,15,30,0.6)',
    starColor: 'rgba(255,150,200,0.5)',
    glowColor: 'rgba(150,50,80,0.2)',
  },
  {
    id: 'wild2',
    name: 'Emerald Deep',
    biome: 'Aquatic',
    seed: 11111,
    skyTop: '#001a1a',
    skyBottom: '#003838',
    accent: '#44bb88',
    mountainColor1: 'rgba(20,50,40,0.5)',
    mountainColor2: 'rgba(15,35,30,0.6)',
    starColor: 'rgba(100,255,200,0.5)',
    glowColor: 'rgba(50,150,100,0.15)',
  },
  {
    id: 'wild3',
    name: 'Obsidian Void',
    biome: 'Void',
    seed: 99999,
    skyTop: '#2a1a0a',
    skyBottom: '#4a3020',
    accent: '#cc9944',
    mountainColor1: 'rgba(50,30,15,0.5)',
    mountainColor2: 'rgba(35,22,10,0.6)',
    starColor: 'rgba(255,200,100,0.5)',
    glowColor: 'rgba(120,80,30,0.15)',
  },
];

/**
 * Get a branch by ID
 * @param {string} id - Branch ID
 * @returns {object|null} Branch data or null if not found
 */
export function getBranch(id) {
  return BRANCHES.find((branch) => branch.id === id) || null;
}
