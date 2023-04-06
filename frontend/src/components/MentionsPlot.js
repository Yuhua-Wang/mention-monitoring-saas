import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import {Box, FormControlLabel, Radio, RadioGroup, Switch} from "@mui/material";
import MentionStatsCard from "./MentionStatsCard";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const groupByTime = (mentions, timeUnit, limit, weightedValues) => {
  const format = {
    day: "YYYY-MM-DD",
    week: "YYYY-MM-DD",
    month: "YYYY-MM",
  };

  const initialValue = {
    POSITIVE: 0,
    NEGATIVE: 0,
    NEUTRAL: 0,
  };

  const groupedMentions = mentions.reduce((acc, mention) => {
    let date;
    if (timeUnit === "week") {
      date = dayjs(mention.createdAt).startOf("week").format(format[timeUnit]);
    } else {
      date = dayjs(mention.createdAt).format(format[timeUnit]);
    }

    if (!acc[date]) {
      acc[date] = { ...initialValue, date };
    }

    const value = weightedValues ? mention.content.split(" ").length : 1;
    acc[date][mention.sentiment] += value;
    return acc;
  }, {});

  const chartData = Object.values(groupedMentions)
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .slice(-limit);

  return chartData;
};

const MentionsPlot = ({ mentions, onDataPointClick}) => {
  const [timeUnit, setTimeUnit] = useState("month");
  const [showPositiveMean, setShowPositiveMean] = useState(false);
  const [showNegativeMean, setShowNegativeMean] = useState(false);
  const [weightedScore, setWeightedScore] = useState(false);

  const limit = {
    day: 1800,
    week: 256,
    month: 64,
  };

  const chartData = useMemo(
    () => groupByTime(mentions, timeUnit, limit[timeUnit], weightedScore),
    [mentions, timeUnit, weightedScore]
  );

  const defaultStartIndex = useMemo(() => {
    return {
      day: Math.max(0, groupByTime(mentions, 'day', limit.day).length - 30),
      week: Math.max(0, groupByTime(mentions, 'week', limit.week).length - 30),
      month: Math.max(0, groupByTime(mentions, 'month', limit.month).length - 30),
    };
  }, [mentions]);

  const [positiveMean, setPositiveMean] = useState(0);
  const [negativeMean, setNegativeMean] = useState(0);

  const calculateMeanCounts = useCallback((data, range) => {
    const rangeData = data.slice(range.startIndex, range.endIndex + 1);
    const total = rangeData.reduce(
      (acc, item) => {
        acc.POSITIVE += item.POSITIVE;
        acc.NEGATIVE += item.NEGATIVE;
        return acc;
      },
      { POSITIVE: 0, NEGATIVE: 0 }
    );

    const meanCounts = {
      POSITIVE: total.POSITIVE / rangeData.length,
      NEGATIVE: total.NEGATIVE / rangeData.length,
    };

    return meanCounts;
  }, []);

  const handleBrushChange = useCallback(
    (range) => {
      if (showPositiveMean || showNegativeMean) {
        const meanCounts = calculateMeanCounts(chartData, range);
        if (showPositiveMean) {
          setPositiveMean(meanCounts.POSITIVE);
        }
        if (showNegativeMean) {
          setNegativeMean(meanCounts.NEGATIVE);
        }
      }
    },
    [chartData, showPositiveMean, showNegativeMean, calculateMeanCounts]
  );

  useEffect(() => {
    const initialRange = {
      startIndex: defaultStartIndex[timeUnit],
      endIndex: chartData.length - 1,
    };
    const initialMeanCounts = calculateMeanCounts(chartData, initialRange);
    setPositiveMean(initialMeanCounts.POSITIVE);
    setNegativeMean(initialMeanCounts.NEGATIVE);
  }, [chartData, defaultStartIndex, timeUnit, calculateMeanCounts]);

  const handleDataPointClick = (data) => {
    if (onDataPointClick && data && data.activePayload) {
      onDataPointClick(data);
      const startDate = dayjs(data.activePayload[0].payload.date);
      let endDate = startDate;
      if (timeUnit === 'week') {
        endDate = startDate.add(6, 'day');
      }
      if (timeUnit === 'month') {
        endDate = startDate.add(1, 'month');
        endDate = endDate.subtract(1, 'day');
      }
      onDataPointClick(startDate, endDate);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      if (!weightedScore) {
        return (
          <div
            className="custom-tooltip"
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <p className="label" style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Mention Count: {label} ({timeUnit})
            </p>
            <p>Positive Mentions: {payload[0].value}</p>
            {showPositiveMean && (
              <p>Mean Positive Mentions: {positiveMean.toFixed(2)}</p>
            )}
            <p>Negative Mentions: {payload[1].value}</p>
            {showNegativeMean && (
              <p>Mean Negative Mentions: {negativeMean.toFixed(2)}</p>
            )}
            <p>Neutral Mentions: {payload[2].value}</p>
            <p>Positive Ratio:
              {
                ((payload[0].value/(payload[0].value+payload[1].value+payload[2].value))*100).toFixed(1)
              }%
            </p>
          </div>
        );
      } else {
        return (
          <div
            className="custom-tooltip"
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <p className="label" style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Weighted Score: {label} ({timeUnit})
            </p>
            <p>Positive Score: {payload[0].value}</p>
            {showPositiveMean && (
              <p>Mean Positive Score: {positiveMean.toFixed(2)}</p>
            )}
            <p>Negative Score: {payload[1].value}</p>
            {showNegativeMean && (
              <p>Mean Negative Score: {negativeMean.toFixed(2)}</p>
            )}
            <p>Neutral Score: {payload[2].value}</p>
            <p>Positive Ratio:
              {
                ((payload[0].value/(payload[0].value+payload[1].value+payload[2].value))*100).toFixed(1)
              }%
            </p>
          </div>
        );
      }
    }
    return null;
  };


  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <Box flex="1 1 33%">
          <MentionStatsCard
            mentions={mentions}
            selectedTimeFrame={timeUnit}
            useWeightedScore={weightedScore}
          />
          <RadioGroup
            row
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <FormControlLabel
              value="day"
              control={<Radio />}
              label="Daily"
            />
            <FormControlLabel
              value="week"
              control={<Radio />}
              label="Weekly"
            />
            <FormControlLabel
              value="month"
              control={<Radio />}
              label="Monthly"
            />
          </RadioGroup>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <FormControlLabel
              control={
                <Switch
                  checked={showPositiveMean}
                  onChange={(e) => setShowPositiveMean(e.target.checked)}
                />
              }
              label="Show positive mean"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showNegativeMean}
                  onChange={(e) => setShowNegativeMean(e.target.checked)}
                />
              }
              label="Show negative mean"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={weightedScore}
                  onChange={(e) => setWeightedScore(e.target.checked)}
                />
              }
              label="Use weighted scores"
            />
          </Box>
        </Box>
        <Box flex="1 1 67%">
          <ResponsiveContainer width="100%" height={430}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onClick={handleDataPointClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="POSITIVE"
                name="Positive Mentions"
                stroke="#0ccaf5"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="NEGATIVE"
                name="Negative Mentions"
                stroke="red"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="NEUTRAL"
                name="Neutral Mentions"
                stroke="orange"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              {showPositiveMean && (
                <Line
                  type="step"
                  dataKey={() => positiveMean}
                  name="Mean Positive Mentions"
                  stroke="#0ccaf5"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              )}
              {showNegativeMean && (
                <Line
                  type="step"
                  dataKey={() => negativeMean}
                  name="Mean Negative Mentions"
                  stroke="red"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              )}
              <Brush
                dataKey="date"
                height={30}
                stroke="#268aed"
                startIndex={defaultStartIndex[timeUnit]}
                onChange={handleBrushChange}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default MentionsPlot;
