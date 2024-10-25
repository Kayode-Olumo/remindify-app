import React from "react";
import ReminderPage from "./components/ReminderPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <ReminderPage />
      <Toaster />
    </div>
  );
}

export default App;
