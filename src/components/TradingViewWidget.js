import React, { useEffect, useRef, memo } from "react";
import { Box } from "@mui/material";

const TradingViewWidget = ({ symbol = "STRKUSDC"}) => {
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
        theme: "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        calendar: false,
        toolbar_bg: "#1e1e1e",
        enable_drawing_tools: true,
        hide_side_toolbar: false,
        support_host: "https://www.tradingview.com",
      });

      container.current.appendChild(script);
    }, 100);
  }, [symbol]);

  return (
    <Box
      sx={{
        height: "100%",
        textAlign: "center",
        borderRadius: "6px",
        overflow: "hidden",
        padding: "10px",
        backgroundColor: "white",
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
