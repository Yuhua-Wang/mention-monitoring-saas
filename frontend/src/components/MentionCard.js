import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const MentionCard = ({ mention }) => {
  const { id, id_in_source, source, sentiment, summary, content, keywords } = mention;

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          ID: {id} - ID in Source: {id_in_source}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Source: {source}
        </Typography>
        <Typography variant="body2">
          Sentiment: {sentiment}
        </Typography>
        <Typography variant="body2">
          Summary: {summary}
        </Typography>
        <Typography variant="body2">
          Content: {content}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
          {keywords.map((keyword, index) => (
            <Chip key={index} label={keyword} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MentionCard;