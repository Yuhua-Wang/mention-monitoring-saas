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
  TablePagination
} from '@mui/material';
import { styled } from '@mui/system';

const truncateSummary = (summary, maxWords) => {
  const words = summary.split(' ');
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : summary;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.action.selected,
  // },
}));

const MentionsTable = ({ mentions }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const sortedMentions = mentions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <StyledTableRow key={mention.id}>
              <TableCell>{truncateSummary(mention.summary, 10)}</TableCell>
              <TableCell>{mention.sentiment}</TableCell>
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