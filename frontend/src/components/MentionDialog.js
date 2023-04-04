import React from 'react';
import {
  Dialog,
  DialogContent,
  Chip,
  Typography,
  Box,
  Icon,
} from '@mui/material';
import { SentimentNeutral, ThumbUp, ThumbDown} from '@mui/icons-material';

const MentionDialog = ({ mention, isDialogOpen, handleOnClose }) => {
  const { id, id_in_source, source, sentiment, summary, content, keywords } = mention;

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleOnClose}
    >
      <DialogContent>
        <Typography variant="h5" component="div">
          Comment ID: {id}
        </Typography>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          ID in Source: {id_in_source}
        </Typography>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          Source: {source}
        </Typography>
        <br/>
        <Typography variant="body2">
          <Typography variant="body2" fontWeight="bold" component="span" display="inline">
            Sentiment: &nbsp;
          </Typography>
          {sentiment === "POSITIVE" && (<Icon component={ThumbUp} style={{ color:'#0ccaf5'}}/>)}
          {sentiment === "NEGATIVE" && (<Icon component={ThumbDown} style={{ color:'red'}}/>)}
          {sentiment === "NEUTRAL" && (<Icon component={SentimentNeutral} style={{ color:'orange'}}/>)}
          &nbsp;{sentiment}
        </Typography>
        <br/>
        <Typography variant="body2" fontWeight="bold">
          Summary:
        </Typography>
        <Typography variant="body2">
          {summary}
        </Typography>
        <br/>
        <Typography variant="body2" fontWeight="bold">
          Content:
        </Typography>
        <Typography variant="body2">
          {content}
        </Typography>
        <br/>
        {keywords.length > 0 && (
          <div>
            <Typography variant="body2" fontWeight="bold">
              Keywords:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
              {keywords.map((keyword, index) => (
                <Chip key={index} label={keyword} />
              ))}
            </Box>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MentionDialog;