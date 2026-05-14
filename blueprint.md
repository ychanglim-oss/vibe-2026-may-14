# Toto Random Number Generator

This document outlines the plan for creating a Toto random number generator web component with a modern Day/Night (Light/Dark) UI.

## **Project Overview**
The Toto Random Number Generator is a lightweight web application that allows users to generate random numbers for games like Toto (usually 6 numbers from 1-49). It leverages modern web standards like Web Components and CSS variables for a robust and themeable experience.

## **Version History**

### **V1: Basic Random Number Generator**
Initial version focusing on core functionality.
*   **Custom Element:** `<toto-generator>` encapsulates the logic and UI.
*   **Generation:** Generates 6 unique numbers from 1 to 49.
*   **Shadow DOM:** Used for style encapsulation.

### **V2: Day/Night UI (Current)**
Enhancing the user experience with a themeable interface.

#### **Features**
*   **Theme Toggle:** A button to switch between light and dark modes.
*   **System Preference:** Automatically respects the user's OS color scheme preference.
*   **Persistence:** Saves the user's theme choice in `localStorage`.
*   **CSS Variables:** Centralized color management for easy theming across the application and Shadow DOM.

#### **Design**
*   **Light Mode:** Clean, high-contrast UI with soft shadows and a professional feel.
*   **Dark Mode:** Deep, low-light UI using modern color spaces (oklch) for eye comfort.
*   **Visual Polish:** Multi-layered shadows and subtle gradients to create depth.

#### **Implementation Plan**
1.  **Define CSS Variables:**
    *   Update `style.css` with `:root` variables for background, text, primary colors, and shadows.
    *   Add a `[data-theme="dark"]` selector to override variables for dark mode.
2.  **Global UI Updates:**
    *   Modify `index.html` to include a theme toggle icon/button.
    *   Add global styles for the `body` to handle background and transitions.
3.  **JavaScript Logic:**
    *   Implement theme switching logic in `main.js`.
    *   Handle `localStorage` and system preference detection.
4.  **Web Component Integration:**
    *   Update the `<toto-generator>` internal styles in `main.js` to use the global CSS variables.
    *   Add "glow" effects and animations for a "premium" feel as per `GEMINI.md`.

---
*Last updated: May 14, 2026*
