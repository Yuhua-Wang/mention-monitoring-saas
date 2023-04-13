import React, {useEffect, useState} from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  TablePagination, Icon, Select, MenuItem, FormControl, InputLabel, TextField,
  Box, Button, Dialog, DialogTitle, DialogActions, Snackbar, Alert
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';
import { SentimentNeutral, ThumbUp, ThumbDown, Close} from '@mui/icons-material';
import dayjs from 'dayjs';

import MentionDialog from './MentionDialog'

import axios from 'axios';
const url = "http://localhost:8080"

const truncateSummary = (summary, maxWords) => {
  const words = summary.split(' ');
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : summary;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const MentionsTable = ({ mentions, onKeywordUpdated, selectedDateRange }) => {
  const sortedMentions = mentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const maxDate = sortedMentions.length<=0?null: dayjs(sortedMentions[0].createdAt).startOf('day');
  const minDate = sortedMentions.length<=0?null: dayjs(sortedMentions[sortedMentions.length-1].createdAt).startOf('day');

  const [keywords, setKeywords] = useState([]);
  // get keywords
  const fetchKeywords = async () => {
    try {
      const response = await axios.get(url + '/keywords');
      setKeywords(response.data);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
    }
  };
  useEffect(() => {
    fetchKeywords();
  }, []);

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
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  useEffect(() => {
    if (selectedDateRange.start && selectedDateRange.end) {
      setDateFilter(selectedDateRange);
    }
  }, [selectedDateRange]);

  useEffect(() => {
    setPage(0);
  }, [sentimentFilter, dateFilter, selectedKeywords]);

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prevSelectedKeywords) => {
      if (prevSelectedKeywords.includes(keyword)) {
        return prevSelectedKeywords.filter((k) => k !== keyword);
      } else {
        return [...prevSelectedKeywords, keyword];
      }
    });
  };

  const applyFilters = (mention) => {
    let sentimentMatches = true;
    let dateMatches = true;
    let keywordsMatches = true;

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

    if (selectedKeywords.length > 0) {
      keywordsMatches &= selectedKeywords.every((keyword) =>
        mention.keywords.includes(keyword)
      );
    }

    return sentimentMatches && dateMatches && keywordsMatches;;
  };
  const handleClearDates = () => {
    setDateFilter({ start: null, end: null });
  };
  const filteredMentions = sortedMentions.filter(applyFilters);

  // delete keyword
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState(null);
  const openDeleteDialog = (keyword) => {
    setKeywordToDelete(keyword);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setKeywordToDelete(null);
    setDeleteDialogOpen(false);
  };

  const deleteKeyword = async () => {
    try {
      setSelectedKeywords([]);
      const k = keywordToDelete;
      closeDeleteDialog();
      setNewKeyword('');
      setMessageType('success');
      setMessage(
        'Deleting keyword "' + k +'".\n The process may take a while'
      );
      await axios.delete(url + '/keywords?keyword=' + k);
      fetchKeywords();
      onKeywordUpdated();
    } catch (error) {
      console.error('Failed to delete keyword:', error);
    }
  };

  // add keyword
  const [newKeyword, setNewKeyword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const createNewKeyword = () => {
    setNewKeyword('');
    setMessageType('success');
    setMessage(
      'Adding keyword "' +
      newKeyword +
      '".\n The process may take a few minutes as NLP models analyze existing mentions'
    );

    const submitNewKeyword = async () => {
      try {
        await axios.post(url + '/keywords?keyword=' + newKeyword);
        onKeywordUpdated();
        fetchKeywords();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setMessageType('warning');
          setMessage('Keyword "' + newKeyword + '" already exists.');
        } else {
          console.error('Failed to create new keyword:', error);
        }
      }
    };
    submitNewKeyword();
  };

  return (
    <Box>
      <Snackbar
        open={!!message}
        autoHideDuration={10000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={messageType} onClose={() => setMessage('')} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Box display="flex" alignItems="center">
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            label="Add Keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            variant="outlined"
            sx={{ height: '40px', marginTop: '-15px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createNewKeyword}
            sx={{ marginLeft: '16px', height: '40px' }}
          >
            Add
          </Button>
        </Box>
        <FormControl variant="outlined" sx={{ width: '150px', marginRight: '16px', marginLeft: '16px', height: '40px' }}>
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
            renderInput={(params) => <TextField {...params} size="small"/>}
            minDate={minDate}
            maxDate={maxDate}
            sx={{ marginTop: '15px' }}
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
            sx={{ marginTop: '15px' }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearDates}
            sx={{ marginLeft: '16px', marginTop: '8px', height: '40px' }}
          >
            Clear
          </Button>
        </LocalizationProvider>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        maxHeight="48px"
        marginTop={1}
        sx={{
          overflowX: 'auto',
          scrollbarWidth: 'none', // for Firefox
          '&::-webkit-scrollbar': { // for Chrome and Safari
            display: 'none',
          },
        }}
      >
        {keywords.map((keyword) => (
          <Chip
            key={keyword}
            label={keyword}
            onClick={() => toggleKeyword(keyword)}
            color={selectedKeywords.includes(keyword) ? 'primary' : 'default'}
            style={{ margin: '0 4px 4px 0' }}
            onDelete={() => openDeleteDialog(keyword)}
            deleteIcon={<Close fontSize='small'/>}
          />
        ))}
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
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </TableContainer>
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete keyword "{keywordToDelete}" ?</DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteKeyword} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentionsTable;