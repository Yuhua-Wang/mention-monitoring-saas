import './App.css';
import Appbar from "./components/Appbar";
import MentionsTable from "./components/MentionsTable";

import React, {useState, useEffect} from 'react';
import axios from 'axios';

import {
  Box, Button,
} from '@mui/material';
import MentionsPlot from "./components/MentionsPlot";
import Container from "@mui/material/Container";
import MentionStatsCard from "./components/MentionStatsCard";

function App() {
  const url = "http://localhost:8080"
  const [mentions, setMentions] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

  const handleDataPointClick = (startDate, endDate) => {
    setSelectedDateRange({ start: startDate, end: endDate });
    moveToElement('mentionsTable');
  };

  const fetchMentionsAndKeywords = async () => {
    try {
      // Fetch mentions and keyword_mentions
      const mentionsResponse = await axios.get(url + '/mentions');
      const keywordMentionsResponse = await axios.get(url + '/keyword_mentions');

      // Convert keyword_mentions response data to an array
      const keywordMentionsData = Object.entries(keywordMentionsResponse.data).map(([id, keywords]) => ({
        id: parseInt(id),
        keywords
      }));

      // Create a map of mention ids to keywords for quick lookup
      const mentionIdToKeywords = keywordMentionsData.reduce((acc, item) => {
        acc[item.id] = item.keywords;
        return acc;
      }, {});

      // Add keywords to each mention
      const enrichedMentions = mentionsResponse.data.map(mention => {
        return { ...mention, keywords: mentionIdToKeywords[mention.id] || [] };
      });

      // Update the state with the enriched mentions
      setMentions(enrichedMentions);
    } catch (error) {
      console.error('Failed to fetch mentions and keyword_mentions:', error);
    }
  };

  useEffect(() => {
    // Call the function to fetch data when the component mounts
    fetchMentionsAndKeywords();
  }, []);

  const moveToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Appbar moveToElement={moveToElement}/>
      <Box sx={{ margin: '0 200px' }} spacing={10}>
        <Container id="MentionsPlot">
          <Box sx={{ height: '65px' }} />
        </Container>
        <MentionsPlot
          mentions={mentions}
          onDataPointClick ={handleDataPointClick}
        />
        <Container id="mentionsTable">
          <Box sx={{ height: '60px' }} />
        </Container>
        <MentionsTable
          mentions={mentions}
          onKeywordUpdated={() => fetchMentionsAndKeywords()}
          selectedDateRange={selectedDateRange}
        />
      </Box>
    </div>
  );
}

export default App;
