import React, { useState, useEffect } from "react";
import { Bell, Grid, Search, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import ReminderForm from "./ReminderForm";
import ReminderDetail from "./ReminderDetail";

const API_URL = "http://localhost:3001/api/reminders";

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([
    { id: "1", name: "Work", count: 0 },
    { id: "2", name: "Personal", count: 0 },
    { id: "3", name: "Health", count: 0 },
    { id: "4", name: "Finance", count: 0 },
    { id: "5", name: "Social", count: 0 },
  ]);
  const [activeView, setActiveView] = useState("list");
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder) => {
        const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
        if (reminderDate.getTime() === now.getTime()) {
          triggerAlarm(reminder);
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [reminders]);

  const triggerAlarm = (reminder) => {
    toast({
      title: `Reminder: ${reminder.title}`,
      description: reminder.description,
      action: <ToastAction altText="Dismiss reminder">Dismiss</ToastAction>,
    });

    // Play a sound (you'll need to add an audio file to your public folder)
    const audio = new Audio("/alarm-sound.mp3");
    audio.play();
  };

  const fetchReminders = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setReminders(data);
      updateCategoryCounts(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const updateCategoryCounts = (reminders) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        count: reminders.filter(
          (reminder) => reminder.category === category.name
        ).length,
      }))
    );
  };

  const addReminder = async (reminder) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reminder),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const savedReminder = await response.json();
      setReminders((prevReminders) => [...prevReminders, savedReminder]);
      updateCategoryCounts([...reminders, savedReminder]);
      setActiveView("list");
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const openReminderDetail = (reminder) => {
    setSelectedReminder(reminder);
    setActiveView("detail");
  };

  const filteredReminders = reminders.filter(
    (reminder) =>
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/5 bg-gray-50 p-6 border-r">
            <h1 className="text-2xl font-bold mb-8">Remindify</h1>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <span>{category.name}</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full bg-orange-400 text-white"
              onClick={() => setActiveView("form")}
            >
              + Create New Category
            </Button>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-4/5 p-8">
            {activeView === "list" && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <div className="relative w-full md:w-64 mb-4 md:mb-0">
                    <Input
                      type="text"
                      placeholder="Search your reminders"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full"
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon">
                      <Bell size={20} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Grid size={20} />
                    </Button>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pinned</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {filteredReminders
                      .filter((r) => r.isPinned)
                      .map((reminder) => (
                        <Card
                          key={reminder.id}
                          className={`${reminder.color} cursor-pointer`}
                          onClick={() => openReminderDetail(reminder)}
                        >
                          <CardHeader>
                            <CardTitle>{reminder.title}</CardTitle>
                            <CardDescription>
                              {reminder.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs bg-white bg-opacity-30 inline-block px-2 py-1 rounded-full">
                              {reminder.date}, {reminder.time}
                              {reminder.isRecurring &&
                                ` (Recurring: ${reminder.recurringDay})`}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredReminders
                      .filter((r) => !r.isPinned)
                      .map((reminder) => (
                        <Card
                          key={reminder.id}
                          className={`${reminder.color} cursor-pointer`}
                          onClick={() => openReminderDetail(reminder)}
                        >
                          <CardHeader>
                            <CardTitle>{reminder.title}</CardTitle>
                            <CardDescription>
                              {reminder.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs bg-white bg-opacity-30 inline-block px-2 py-1 rounded-full">
                              {reminder.date}, {reminder.time}
                              {reminder.isRecurring &&
                                ` (Recurring: ${reminder.recurringDay})`}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
                <Button
                  className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg"
                  onClick={() => setActiveView("form")}
                >
                  <Plus size={24} />
                </Button>
              </>
            )}
            {activeView === "form" && (
              <ReminderForm
                onAddReminder={addReminder}
                onCancel={() => setActiveView("list")}
                categories={categories}
              />
            )}
            {activeView === "detail" && selectedReminder && (
              <ReminderDetail
                reminder={selectedReminder}
                onBack={() => setActiveView("list")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
