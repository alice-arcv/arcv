# ARCV Frontend

This directory contains the React frontend for the ARCV Sneaker Archive Application.

## Overview

The frontend provides an intuitive interface for:
- Searching sneakers using text and image-based queries
- Filtering and browsing sneaker details
- Organizing saved sneakers into folders
- Viewing detailed product information with related products

## Structure

### Components

- **FigmaSearchInterface**: Main search interface with filters and results grid
- **ImageSearchPage**: Visual search using uploaded images or sketches
- **ProductDetail**: Detailed view of a specific sneaker with specifications
- **FoldersPage**: User's saved sneaker collections
- **SaveToFolderPopup**: Modal for saving sneakers to folders
- **Navbar**: Navigation component (optional, currently unused)

### Services

- **searchIntegration.js**: Coordinates searches across multiple data sources
- **firebaseDataService.js**: Handles Firebase data operations
- **sneakersApiService.js**: Integration with SneakersAPI.dev
- **zylaApiService.js**: Integration with Zyla API Hub
- **googleSearchService.js**: Integration with Google Custom Search
- **kaggleDataService.js**: Handles image data from Kaggle

### Styles

- **arcv-figma.css**: Styling based on Figma design specifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start