import React, {useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  Icon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';
import { SentimentNeutral, ThumbUp, ThumbDown} from '@mui/icons-material';
import dayjs from 'dayjs';

import MentionDialog from './MentionDialog'

const truncateSummary = (summary, maxWords) => {
  const words = summary.split(' ');
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : summary;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const MentionsTable = ({ mentions }) => {
  const sortedMentions = mentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const maxDate = sortedMentions.length<=0?null: dayjs(sortedMentions[0].createdAt).startOf('day');
  const minDate = sortedMentions.length<=0?null: dayjs(sortedMentions[sortedMentions.length-1].createdAt).startOf('day');

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mention Detail Dialogs
  const [selectedMention, setSelectedMention] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleRowClick = (mention) => {
    setSelectedMention(mention);
    setIsDialogOpen(true);
  };

  // Table filters
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const applyFilters = (mention) => {
    let sentimentMatches = true;
    let dateMatches = true;

    if (sentimentFilter) {
      sentimentMatches = mention.sentiment === sentimentFilter;
    }

    const createdAt = new Date(mention.createdAt);
    createdAt.setHours(0,0,0,0);

    if (dateFilter.start) {
      dateMatches &= createdAt >= dateFilter.start;
    }

    if (dateFilter.end) {
      dateMatches &= createdAt <= dateFilter.end;
    }

    return sentimentMatches && dateMatches;
  };
  const handleClearDates = () => {
    setDateFilter({ start: null, end: null });
  };
  const filteredMentions = sortedMentions.filter(applyFilters);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <FormControl variant="outlined" sx={{ width: '150px', marginRight: '16px', marginTopL: '50px' }}>
          <InputLabel htmlFor="sentiment-filter">Sentiment</InputLabel>
          <Select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            label="Sentiment"
            inputProps={{
              name: 'sentiment',
              id: 'sentiment-filter',
            }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="POSITIVE">Positive</MenuItem>
            <MenuItem value="NEGATIVE">Negative</MenuItem>
            <MenuItem value="NEUTRAL">Neutral</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={dateFilter.start}
            onChange={(newValue) => {
              setDateFilter({ ...dateFilter, start: newValue });
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
            minDate={minDate}
            maxDate={maxDate}
          />
          <DatePicker
            label="End Date"
            value={dateFilter.end}
            onChange={(newValue) => {
              setDateFilter({ ...dateFilter, end: newValue });
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
            minDate={minDate}
            maxDate={maxDate}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearDates}
            sx={{ marginLeft: '16px', marginTop: '8px' }}
          >
            Clear
          </Button>
        </LocalizationProvider>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Summary</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Keywords</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMentions.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((mention) => (
              <StyledTableRow key={mention.id} onClick={() => handleRowClick(mention)}>
                <TableCell>{truncateSummary(mention.summary, 10)}</TableCell>
                <TableCell>
                  {mention.sentiment === "POSITIVE" && <Icon component={ThumbUp} style={{ color:'#0ccaf5'}} />}
                  {mention.sentiment === "NEGATIVE" && <Icon component={ThumbDown} style={{ color:'red'}} />}
                  {mention.sentiment === "NEUTRAL" && <Icon component={SentimentNeutral} style={{ color:'orange'}} />}
                </TableCell>
                <TableCell>{mention.createdAt}</TableCell>
                <TableCell>
                  {mention.keywords.slice(0, 2).map((keyword, index) => (
                    <Chip key={index} label={keyword} style={{ margin: '0 4px 4px 0' }} />
                  ))}
                  {mention.keywords.length > 2 && (
                    <Chip label="..." style={{ margin: '0 4px 4px 0' }} />
                  )}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          {selectedMention &&
            <MentionDialog
              mention={selectedMention}
              isDialogOpen={isDialogOpen}
              handleOnClose={() => setIsDialogOpen(false)}
            />
          }
        </Table>
        <TablePagination
          component="div"
          count={filteredMentions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
    </Box>
  );
};

export default MentionsTable;