import React, { useEffect, useRef, memo } from "react";
import { Box } from "@mui/material";

const TradingViewWidget = ({ symbol = "BTCUSDT"}) => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    setTimeout(() => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: "100%",
        height: "100%",
        symbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        calendar: false,
        toolbar_bg: "#1A0033",
        hide_top_toolbar: false,
        hide_legend: false,
        enable_drawing_tools: true,
        hide_side_toolbar: false,
        support_host: "https://www.tradingview.com",
        backgroundColor: "rgba(28, 25, 38, 0.9)",
        gridColor: "rgba(126, 87, 194, 0.1)",
      });

      container.current.appendChild(script);
    }, 100);
  }, [symbol]);

  return (
    <Box
      sx={{
        height: "100%",
        textAlign: "center",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "rgba(28, 25, 38, 0.5)",
        border: "1px solid rgba(126, 87, 194, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        key={symbol}
        className="tradingview-widget-container"
        ref={container}
        style={{ width: "100%", height: "100%", margin: "0 auto" }}
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </Box>
  );
};

export default memo(TradingViewWidget);
