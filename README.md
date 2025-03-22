# PubMed Papers Finder - Frontend

A modern React-based web application for searching and analyzing PubMed papers with authors affiliated with pharmaceutical or biotech companies.

## Features

- Clean, intuitive user interface for searching PubMed
- Display of search results with highlighting of non-academic authors
- Details view showing paper information, publication dates, and author affiliations
- Download results as CSV files
- Responsive design for desktop and mobile devices

## Tech Stack

- **React** - Frontend library
- **JavaScript** - Programming language
- **Parcel** - Web application bundler
- **CSS** - Styling (no frameworks, custom CSS)

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/aditya93941/PubMed_Papers_Finder_Frontend.git
   cd PubMed_Papers_Finder_Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

The application will be available at http://localhost:1234.

## Building for Production

To create a production build:

```
npm run build
```

The optimized build will be available in the `dist` directory.

## Project Structure

```
frontend/
├── src/              # Source files
│   ├── components/   # React components
│   ├── styles/       # CSS styles
│   └── App.js        # Main application component
├── public/           # Static assets
└── package.json      # Project configuration
```

## Usage Guide

1. **Search**: Enter a search term related to your research interest
2. **View Results**: See a list of papers with authors from pharma/biotech companies
3. **Details**: Click on a paper to view detailed information
4. **Download**: Download the results as a CSV file for further analysis

## API Integration

This frontend application connects to the [PubMed Papers Finder Backend API](https://github.com/aditya93941/PubMed_Papers_Finder_Backend) which handles:
- PubMed data retrieval
- Company affiliation detection
- Data storage
- CSV generation

By default, the application connects to an API at `http://localhost:3001`. To change the API endpoint, modify the `apiUrl` variable in the appropriate component files.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License. 