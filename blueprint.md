# US Indices Predictor

This document outlines the plan and state of the US Indices Predictor web application.

## **Project Overview**
The US Indices Predictor is a modern web application designed to visualize historical performance and predict future trends for the three major US stock market indices: NASDAQ Composite, Dow Jones Industrial Average (DJIA), and S&P 500.

## **Features**
*   **Historical Visualization:** Interactive multi-line charts showing index performance from 1980 to 2023.
*   **Predictive Analysis:** CAGR-based projections for 1, 5, and 10-year timeframes.
*   **Market Overview Dashboard:** Key statistics for each index, including all-time growth and average annual return.
*   **Modern UI/UX:** Responsive design with professional financial aesthetics, oklch color palettes, and dark/light mode.

## **Version History**

### **V1: Initial Prototype (Current Request)**
Transforming the workspace into a financial dashboard.
*   **Data Layer:** Embedded historical dataset (1980-2023).
*   **Visualization:** Chart.js integration for historical and projected data.
*   **Theming:** Professional financial theme with glassmorphism.

## **Implementation Plan**

### **1. Data Assembly & Structure**
*   Integrate historical yearly close data for NASDAQ, DJIA, and S&P 500 (1980-2023).
*   Calculate historical CAGR for each index.

### **2. UI Foundation (`index.html` & `style.css`)**
*   Create a grid-based dashboard layout.
*   Define a professional financial color palette using `oklch`.
*   Implement container queries for chart responsiveness.

### **3. Logical Engine (`main.js`)**
*   Implement `MarketData` controller to handle datasets.
*   Implement `PredictionEngine` for CAGR calculations.
*   Initialize and manage Chart.js instance.

### **4. Visualization & Polish**
*   Configure Chart.js with custom tooltips and animations.
*   Apply visual polish (shadows, transitions, glow effects).

---
*Last updated: May 14, 2026*
