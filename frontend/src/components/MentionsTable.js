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
} from '@mui/material';
import { styled } from '@mui/system';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedMention, setSelectedMention] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortedMentions = mentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (mention) => {
    setSelectedMention(mention);
    setIsDialogOpen(true);
  };

  return (
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
          {sortedMentions.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((mention) => (
            <StyledTableRow key={mention.id} onClick={() => handleRowClick(mention)}>
              <TableCell>{truncateSummary(mention.summary, 10)}</TableCell>
              <TableCell>
                {mention.sentiment === "POSITIVE" && <Icon component={ThumbUpIcon} style={{ color:'#0ccaf5'}} />}
                {mention.sentiment === "NEGATIVE" && <Icon component={ThumbDownIcon} style={{ color:'red'}} />}
                {mention.sentiment === "NEUTRAL" && <Icon component={SentimentNeutralIcon} style={{ color:'orange'}} />}
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
        count={mentions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </TableContainer>
  );
};

export default MentionsTable;