import React, { useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

function MentionsTable({ mentions }) {
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedMentions = mentions.sort((a, b) => {
    const orderMultiplier = order === 'asc' ? 1 : -1;
    if (orderBy === 'sentiment') {
      return orderMultiplier * a.sentiment.localeCompare(b.sentiment);
    }
    return orderMultiplier * (new Date(a.createdAt) - new Date(b.createdAt));
  });

  const paginatedMentions = sortedMentions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="mentions table">
        <TableHead>
          <TableRow>
            <TableCell
              key="summary"
              sortDirection={orderBy === 'summary' ? order : false}
              onClick={() => handleSort('summary')}
            >
              Summary
            </TableCell>
            <TableCell
              key="sentiment"
              sortDirection={orderBy === 'sentiment' ? order : false}
              onClick={() => handleSort('sentiment')}
            >
              Sentiment
            </TableCell>
            <TableCell
              key="createdAt"
              sortDirection={orderBy === 'createdAt' ? order : false}
              onClick={() => handleSort('createdAt')}
            >
              Created At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedMentions.map((mention, index) => (
            <React.Fragment key={mention.id}>
              <TableRow key={mention.id}
                        onMouseEnter={() => handleRowHover(index)}
                        onMouseLeave={() => handleRowHover(null)}
              >
                <TableCell component="th" scope="row">
                  {mention.summary}

                  {/*{mention.summary}*/}
                  {/*{index === hoveredRow && (*/}
                  {/*  <div>{mention.content}</div>*/}
                  {/*)}*/}

                </TableCell>
                <TableCell>{mention.sentiment}</TableCell>
                <TableCell>{new Date(mention.createdAt).toLocaleString()}</TableCell>
              </TableRow>
              {index === hoveredRow && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography>
                      <strong>Id in source: </strong>
                      {mention.id_in_source}
                      <br />
                      <strong>Content: </strong>
                      {mention.content}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={sortedMentions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default MentionsTable;
