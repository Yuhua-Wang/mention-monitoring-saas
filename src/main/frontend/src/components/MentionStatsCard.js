import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem, Icon,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  ArrowUpward, ArrowDownward, HorizontalRule,
  ThumbUp, ThumbDown, SentimentNeutral, Percent
} from '@mui/icons-material';

const getStartOf = (timeFrame, mentions) => {
  if (!mentions || mentions.length === 0) {
    return dayjs();
  }

  let latestMentionDate = mentions.reduce((latestDate, mention) => {
    const mentionDate = dayjs(mention.createdAt);
    return mentionDate.isAfter(latestDate) ? mentionDate : latestDate;
  }, dayjs(0));

  switch (timeFrame) {
    case 'day':
      return latestMentionDate.startOf('day');
    case 'week':
      return latestMentionDate.startOf('week');
    case 'month':
      return latestMentionDate.startOf('month');
    default:
      throw new Error(`Invalid time frame: ${timeFrame}`);
  }
};


const countSentiments = (mentions, startDate, endDate, weightedScore) => {
  return mentions.reduce(
    (acc, mention) => {
      const createdAt = dayjs(mention.createdAt);
      if (createdAt.isBetween(startDate, endDate, null, '[]')) {
        const value = weightedScore ? mention.content.split(" ").length : 1;
        acc[mention.sentiment.toLowerCase()]+=value;
      }

      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );
};


const MentionStatsCard = ({ mentions, selectedTimeFrame, useWeightedScore }) => {
  const [timeFrame, setTimeFrame] = useState('month');
  const [mentionStats, setMentionStats] = useState({
    positive: {current: 0, previous: 0},
    negative: {current: 0, previous: 0},
    neutral: {current: 0, previous: 0},
    ratio: {current: 0, previous: 0}
  });
  const [weightedScore, setWeightedScore] = useState(false);

  useEffect(() => {
    setWeightedScore(useWeightedScore);
  }, [useWeightedScore])

  useEffect(() => {
    setTimeFrame(selectedTimeFrame)
  }, [selectedTimeFrame])

  useEffect(() => {
    const calculateMentionStats = () => {
      const currentStart = getStartOf(timeFrame, mentions);
      const currentEnd = dayjs();

      const previousStart = currentStart.clone().subtract(1, timeFrame === 'day' ? 'day' : timeFrame === 'week' ? 'week' : 'month');
      const previousEnd = currentStart.subtract(1, 'day');

      const currentCounts = countSentiments(mentions, currentStart, currentEnd, weightedScore);
      const previousCounts = countSentiments(mentions, previousStart, previousEnd, weightedScore);

      setMentionStats({
        positive: {current: currentCounts.positive, previous: previousCounts.positive},
        negative: {current: currentCounts.negative, previous: previousCounts.negative},
        neutral: {current: currentCounts.neutral, previous: previousCounts.neutral},
        ratio: {
          current: (currentCounts.positive/(currentCounts.positive+currentCounts.negative+currentCounts.neutral)),
          previous: (previousCounts.positive/(previousCounts.positive+previousCounts.negative+previousCounts.neutral))
        }
      });
    };

    calculateMentionStats();
  }, [mentions, timeFrame, weightedScore]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" textAlign="left">
          {timeFrame === 'day' && 'Daily '}
          {timeFrame === 'week' && 'Weekly '}
          {timeFrame === 'month' && 'Monthly '}
          Statistics
        </Typography>
        <Typography sx={{mt: 2}} textAlign="left">
          <Icon component={ThumbUp} style={{ color:'#0ccaf5', verticalAlign: 'middle', marginRight: '5px'}}/>
          Positive Mentions: <u>{mentionStats.positive.current}</u>
        </Typography>
        <Typography textAlign="left">
          <Icon component={ThumbDown} style={{ color:'red', verticalAlign: 'middle', marginRight: '5px'}}/>
          Negative Mentions: <u>{mentionStats.negative.current}</u>
        </Typography>
        <Typography textAlign="left">
          <Icon component={SentimentNeutral} style={{ color:'orange', verticalAlign: 'middle', marginRight: '5px'}}/>
          Neutral Mentions: <u>{mentionStats.neutral.current}</u>
        </Typography>
        <Typography textAlign="left">
          <Icon component={Percent} style={{ color:'green', verticalAlign: 'middle', marginRight: '5px'}}/>
          Positive Ratio: <u>{(mentionStats.ratio.current*100).toFixed(1)}%</u> (
          { mentionStats.ratio.current > mentionStats.ratio.previous &&
          <Icon component={ArrowUpward} style={{ color:'green', verticalAlign: 'middle'}}/>}
          { mentionStats.ratio.current < mentionStats.ratio.previous &&
            <Icon component={ArrowDownward} style={{ color:'red', verticalAlign: 'middle'}}/>}
          { mentionStats.ratio.current === mentionStats.ratio.previous &&
            <Icon component={HorizontalRule} style={{ color:'orange', verticalAlign: 'middle'}}/>}
          <u>{((mentionStats.ratio.current - mentionStats.ratio.previous)*100).toFixed(1)}%</u>)
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MentionStatsCard;