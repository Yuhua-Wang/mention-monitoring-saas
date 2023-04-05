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

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const groupByTime = (mentions, timeUnit, limit) => {
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

    acc[date][mention.sentiment]++;
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

  const limit = {
    day: 180,
    week: 30,
    month: 30,
  };

  const chartData = useMemo(
    () => groupByTime(mentions, timeUnit, limit[timeUnit]),
    [mentions, timeUnit]
  );

  const defaultStartIndex = useMemo(() => {
    const currentChartData = groupByTime(mentions, "day", limit.day);
    return {
      day: Math.max(0, currentChartData.length - 30),
      week: 0,
      month: 0,
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
      console.log(startDate);
      console.log(endDate);
      onDataPointClick(startDate, endDate);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            {label} ({timeUnit})
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
        </div>
      );
    }
    return null;
  };


  return (
    <div>
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
      <select
        value={timeUnit}
        onChange={(e) => setTimeUnit(e.target.value)}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={showPositiveMean}
          onChange={(e) => setShowPositiveMean(e.target.checked)}
        />
        show mean positive mentions
      </label>
      <label>
        <input
          type="checkbox"
          checked={showNegativeMean}
          onChange={(e) => setShowNegativeMean(e.target.checked)}
        />
        show mean negative mentions
      </label>
    </div>
  );
};

export default MentionsPlot;
