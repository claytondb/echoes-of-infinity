/**
 * TileTypes.js - Tile type definitions and properties
 */

export const TILES = {
  AIR: 0,
  DIRT: 1,
  STONE: 2,
  GRASS: 3,
  PLANT: 4,
  CRYSTAL: 5,
  PORTAL: 6,
  WOOD: 7,
  LEAF: 8,
};

export const TILE_COLORS = {
  [TILES.AIR]: [],
  [TILES.DIRT]: ['#5a4030', '#6b5040', '#4a3525'],
  [TILES.STONE]: ['#556', '#667', '#445'],
  [TILES.GRASS]: ['#3a7744', '#4a8855', '#2a6633'],
  [TILES.PLANT]: ['#44aa55', '#55cc66', '#338844'],
  [TILES.CRYSTAL]: ['#8855ee', '#aa77ff', '#6633cc'],
  [TILES.PORTAL]: ['#4488ff', '#66aaff', '#2266dd'],
  [TILES.WOOD]: ['#8B6914', '#9B7924', '#7B5904'],
  [TILES.LEAF]: ['#2d8a4e', '#38a85c', '#248040'],
};

export const TILE_PROPERTIES = {
  [TILES.AIR]: {
    solid: false,
    miningTime: 0,
    mineDrop: null,
  },
  [TILES.DIRT]: {
    solid: true,
    miningTime: 3,
    mineDrop: TILES.DIRT,
  },
  [TILES.STONE]: {
    solid: true,
    miningTime: 5,
    mineDrop: TILES.STONE,
  },
  [TILES.GRASS]: {
    solid: true,
    miningTime: 3,
    mineDrop: TILES.DIRT,
  },
  [TILES.PLANT]: {
    solid: false,
    miningTime: 2,
    mineDrop: TILES.PLANT,
  },
  [TILES.CRYSTAL]: {
    solid: true,
    miningTime: 8,
    mineDrop: TILES.CRYSTAL,
  },
  [TILES.PORTAL]: {
    solid: false,
    miningTime: 0,
    mineDrop: null,
  },
  [TILES.WOOD]: {
    solid: true,
    miningTime: 4,
    mineDrop: TILES.WOOD,
  },
  [TILES.LEAF]: {
    solid: true,
    miningTime: 1,
    mineDrop: TILES.PLANT,
  },
};
